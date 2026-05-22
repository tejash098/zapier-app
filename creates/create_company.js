const getUsersTrigger = require("../triggers/get_users");
const getCompanyOptionsTrigger = require("../triggers/get_company_options");

const resolveOwner = async (z, bundle, ownerKey) => {
  const { owner_email, owner_name } = bundle.inputData;
  const ownerId = bundle.inputData[ownerKey];

  const users = await getUsersTrigger.operation.perform(z, bundle);

  if (owner_email) {
    const found = users.find(
      (u) => u.email?.toLowerCase() === owner_email.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  if (owner_name) {
    const found = users.find(
      (u) => u.full_name?.toLowerCase() === owner_name.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  return users.find((u) => u.user_id === ownerId) || {};
};

const mapNumberToRangeKey = (num, ranges) => {
  if (num === undefined || num === null || num === "") return undefined;
  const value = Number(num);
  for (const range of ranges) {
    const key = range.key;
    const isMillion = key.includes("m");
    const cleanKey = key.replace("m", "");

    if (cleanKey.includes("+")) {
      const min =
        parseFloat(cleanKey.replace("+", "")) * (isMillion ? 1000000 : 1);
      if (value >= min) return key;
    } else if (cleanKey.includes("-")) {
      const parts = cleanKey.split("-");
      const min = parseFloat(parts[0]) * (isMillion ? 1000000 : 1);
      const max = parseFloat(parts[1]) * (isMillion ? 1000000 : 1);
      if (value >= min && value <= max) return key;
    }
  }
  return undefined;
};

const perform = async (z, bundle) => {
  const ownerData = await resolveOwner(z, bundle, "company_owner");
  const resolvedOwner = ownerData.user_id || bundle.inputData.company_owner;

  const companyOptions = await getCompanyOptionsTrigger.operation.perform(
    z,
    bundle,
  );
  const data = companyOptions[0] || {};
  const { company_revenues = [], company_employee_ranges = [] } = data;

  const mappedArr = mapNumberToRangeKey(
    bundle.inputData.estimated_arr,
    company_revenues,
  );
  const mappedEmp = mapNumberToRangeKey(
    bundle.inputData.employee_range,
    company_employee_ranges,
  );

  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: {},
    body: {
      company_name: bundle.inputData.company_name,
      domain: bundle.inputData.domain,
      linkedin_url: bundle.inputData.linkedin_url,
      twitter_url: bundle.inputData.twitter_url,
      description: bundle.inputData.description,
      lead_status: {
        status_key: bundle.inputData.status_key,
        status_name: bundle.inputData.status_key.replace(/^./, (s) =>
          s.toUpperCase(),
        ),
      },
      lead_status_pipeline_id: bundle.inputData.company_pipeline_id,
      parent_company: bundle.inputData.parent_company,
      parent_company_id: bundle.inputData.parent_company_id,
      operating_regions: (bundle.inputData.operating_regions || []).map(
        (region) =>
          region
            .split(" ")
            .map((word) =>
              word.length === 2
                ? word.toUpperCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join(" "),
      ),
      category: bundle.inputData.category,
      industry: bundle.inputData.industry,
      company_owner: resolvedOwner,
      customer_segment: bundle.inputData.customer_segment,
      icp_fit: bundle.inputData.icp_fit,
      company_type: bundle.inputData.company_type,
      connection_source: bundle.inputData.connection_source,
      vendor_being_replaced: bundle.inputData.vendor_being_replaced,
      record_source: "integration",
      estimated_arr: mappedArr,
      employee_range: mappedEmp,
      hq_location: {
        country: bundle.inputData.country,
        state: bundle.inputData.state,
        city: bundle.inputData.city,
        address: bundle.inputData.address,
        zip_code: bundle.inputData.zip_code,
      },
      is_draft: false,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;
    return results;
  });
};

const inputFields = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/templates/`,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      module: "templates",
      template_type: "pipelines",
      sub_template_type: 6,
      items_per_page: 10,
      page: bundle.meta.page + 1,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json || {};

    const results = (data.results || []).filter(
      (result) =>
        String(result.org_temp_id ?? "") ===
        String(bundle.inputData.company_pipeline_id ?? ""),
    );

    const milestones = results.flatMap((item) =>
      (item.milestone || []).map((m) => ({
        value: m.status?.status_key,
        sample: m.name,
        label: m.name,
      })),
    );

    return [
      {
        key: "status_key",
        label: "Lead Status",
        type: "string",
        choices: milestones,
        helpText:
          "Select the default Lead Status for this company. To add a custom status, use the three-dot menu in Projetly.",
        required: false,
        altersDynamicFields: false,
      },
    ];
  });
};

const optionsFields = async (z, bundle) => {
  const companyOptions = await getCompanyOptionsTrigger.operation.perform(
    z,
    bundle,
  );
  const data = companyOptions || {};

  const formatLabel = (name) => {
    if (!name) return "";
    let clean = name.replace(/^UI\.pr_(?:company_type_|segment_|icp_)?/, "");
    return clean
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const mapChoices = (items, keyProp = "key") => {
    const choices = {};
    (items || []).forEach((item) => {
      choices[item[keyProp] || item.value] = formatLabel(
        item.name || item.label,
      );
    });
    return choices;
  };

  return [
    {
      key: "customer_segment",
      label: "Customer Segment",
      type: "string",
      helpText: "Select the Customer Segment.",
      choices: mapChoices(data.company_customer_segments),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
    {
      key: "icp_fit",
      label: "ICP Fit",
      type: "string",
      helpText: "Select how well this company matches your Ideal Customer Profile.",
      choices: mapChoices(data.company_icp_fits),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
    {
      key: "company_type",
      label: "Company Type",
      type: "string",
      helpText: "Select the type of company (e.g. Prospect, Customer, Partner).",
      choices: mapChoices(data.company_types),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
    {
      key: "connection_source",
      label: "Connection Source",
      type: "string",
      helpText: "Select how this company was first connected with (e.g. Inbound, Outbound, Referral).",
      choices: mapChoices(data.company_connection_sources, "value"),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
  ];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "company_owner",
        label: "Company Owner",
        type: "string",
        helpText:
          "Select the Default Company Owner from given Users List. Optionally provide Owner Email or Name below to auto-map; if not found, this selection is used.",
        dynamic: "get_users.user_id.full_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_email",
        label: "Owner Email (optional)",
        type: "string",
        helpText:
          "Enter owner email to auto-map from Projetly user list. If not found, the selected Company Owner will be used.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_name",
        label: "Owner Name (optional)",
        type: "string",
        helpText:
          "Enter owner full name to auto-map. Used as fallback if email lookup fails.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "company_pipeline_id",
        label: "Select Default Lead Status Pipeline",
        type: "string",
        helpText: "Select Default Lead Status Pipeline for Company Created.",
        dynamic: "get_company_pipeline.org_temp_id.template_name",
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
      {
        key: "company_name",
        label: "Company Name",
        type: "string",
        helpText: "Enter the Company Name.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "domain",
        label: "Domain / Website",
        type: "string",
        helpText: "Enter the Domain / Website Url of Company",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "linkedin_url",
        label: "LinkedIn URL",
        type: "string",
        helpText: "Enter the Company LinkedIn URL",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "twitter_url",
        label: "Twitter / X URL",
        type: "string",
        helpText: "Enter the Twitter / X Url",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "description",
        label: "Description",
        type: "string",
        helpText: "Enter the Description of the Company",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "parent_company_id",
        label: "Parent Company Id",
        type: "string",
        helpText:
          "Select an existing parent company to link this company under (e.g. subsidiary or business unit). Use a Find Company search step if not in the dropdown.",
        dynamic: "company_created.company_id.company_name",
        search: "find_company.company_id",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "estimated_arr",
        label: "Estimated ARR",
        type: "number",
        helpText: "Enter the Estimated Annual Recurring Revenue.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "employee_range",
        label: "Employee Range",
        type: "number",
        helpText: "Enter the number of employees.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "operating_regions",
        label: "Operating Regions",
        type: "string",
        helpText: "Enter the Operating Region of the Company",
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: "category",
        label: "Category",
        type: "string",
        helpText: "Enter the Category of the Company.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "industry",
        label: "Enter Vertical / Industry",
        type: "string",
        helpText: "Enter Vertical / Industry of Company",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "country",
        label: "Location: Country",
        type: "string",
        helpText: "Enter the Country of Company Headquarter",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "state",
        label: "Location: State",
        type: "string",
        helpText: "Enter the State of Company Headquarter",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "city",
        label: "Location: City",
        type: "string",
        helpText: "Enter the City of Company Headquarter",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "address",
        label: "Location: Address",
        type: "string",
        helpText: "Enter the Address of Company Headquarter",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "zip_code",
        label: "Location: Zip Code",
        type: "string",
        helpText: "Enter the Zip Code of Company Headquarter",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      optionsFields,
    ],
    sample: {
      id: "7463464076690067457",
      company_id: "7463464076690067457",
      display_id: "COMPANY_0275",
      company_name: "Sample Company",
      domain: "https://sample.com",
      hq_location: {
        country: "India",
        state: "Karnataka",
        city: "Bengaluru",
        address: "sample address",
        zip_code: "456123",
      },
      industry: "sample",
      employee_range: "1-10",
      estimated_arr: "1-5m",
      employees: null,
      description: "Sample Description",
      company_owner: {
        user_id: "7424309824034181121",
        full_name: "Sample Admin",
      },
      company_type: "prospect",
      lead_status: "new",
      operating_regions: ["Africa"],
      customer_segment: "smb",
      icp_fit: "excellent",
      connection_strength: "very_strong",
      connection_source: "founder",
      vendor_being_replaced: null,
      replacement_urgency: "low",
      category: "crm",
      record_source: "ui",
      partner_type: null,
      parent_company: null,
      external_map: null,
      is_draft: false,
      created_by: "7424309824034181121",
      last_updated_by: "7424309824034181121",
      creation_time: "2026-05-22T05:41:40.340054Z",
      last_update_time: "2026-05-22T05:41:40.340054Z",
      lead_status_pipeline_id: "7450876547860271105",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "company_id", label: "Company Id" },
      { key: "display_id", label: "Display Id" },
      { key: "company_name", label: "Company Name" },
      { key: "domain", label: "Domain" },
      { key: "hq_location__country", label: "HQ Country" },
      { key: "hq_location__state", label: "HQ State" },
      { key: "hq_location__city", label: "HQ City" },
      { key: "hq_location__address", label: "HQ Address" },
      { key: "hq_location__zip_code", label: "HQ Zip Code" },
      { key: "industry", label: "Industry" },
      { key: "employee_range", label: "Employee Range" },
      { key: "estimated_arr", label: "Estimated ARR" },
      { key: "employees", label: "Employees" },
      { key: "description", label: "Description" },
      { key: "company_owner__user_id", label: "Company Owner User Id" },
      { key: "company_owner__full_name", label: "Company Owner Full Name" },
      { key: "company_type", label: "Company Type" },
      { key: "lead_status", label: "Lead Status" },
      { key: "operating_regions", label: "Operating Regions" },
      { key: "customer_segment", label: "Customer Segment" },
      { key: "icp_fit", label: "ICP Fit" },
      { key: "connection_strength", label: "Connection Strength" },
      { key: "connection_source", label: "Connection Source" },
      { key: "vendor_being_replaced", label: "Vendor Being Replaced" },
      { key: "replacement_urgency", label: "Replacement Urgency" },
      { key: "category", label: "Category" },
      { key: "record_source", label: "Record Source" },
      { key: "partner_type", label: "Partner Type" },
      { key: "parent_company", label: "Parent Company" },
      { key: "external_map", label: "External Map" },
      { key: "is_draft", label: "Is Draft", type: "boolean" },
      { key: "created_by", label: "Created By" },
      { key: "last_updated_by", label: "Last Updated By" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "lead_status_pipeline_id", label: "Lead Status Pipeline Id" },
    ],
  },
  display: {
    description: "Creates a New Company in Projetly.",
    hidden: false,
    label: "Create Company",
  },
  key: "create_company",
  noun: "Company",
};
