const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: "",
        key: bundle.inputData.search_property_name,
        option_type: "",
      },
      condition: {
        name: "",
        key: bundle.inputData.condition,
        types: ["input", "select"],
      },
      option: {
        name: "",
        key: "",
        isApiCall: false,
      },
      value: bundle.inputData[bundle.inputData.search_property_name],
    },
  ];

  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: {
      limit: 20,
      filter: JSON.stringify(filter),
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results;
    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    company_name: {
      key: "company_name",
      label: "Company Name",
      type: "string",
      required: true,
      helpText: "Enter a company name",
    },

    domain: {
      key: "domain",
      label: "Domain",
      type: "string",
      required: true,
      helpText: "Enter a domain",
    },
  };

  const selected = bundle.inputData.search_property_name;

  // Simple input fields
  if (fieldMap[selected]) {
    return [fieldMap[selected]];
  }

  // Dynamic dropdown fields
  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      options: "options",
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json || {};

    let choices = [];

    // Company Type
    if (selected === "company_type") {
      choices = (data.company_types || []).map((item) => ({
        label: item.key,
        value: item.key,
      }));

      return [
        {
          key: "company_type",
          label: "Company Type",
          type: "string",
          choices,
          required: true,
          helpText: "Select company type",
          altersDynamicFields: false,
        },
      ];
    }

    // Category
    if (selected === "category") {
      choices = (data.company_categories || []).map((item) => ({
        label: item.name,
        value: item.value,
      }));

      return [
        {
          key: "category",
          label: "Category",
          type: "string",
          choices,
          required: true,
          helpText: "Select category",
          altersDynamicFields: false,
        },
      ];
    }

    // Industry -> verticals
    if (selected === "industry") {
      choices = (data.verticals || []).map((item) => ({
        label: item.name,
        value: item.value,
      }));

      return [
        {
          key: "industry",
          label: "Industry",
          type: "string",
          choices,
          required: true,
          helpText: "Select industry",
          altersDynamicFields: false,
        },
      ];
    }

    // Lead Status
    if (selected === "lead_status") {
      const lead_status = (data.company_lead_statuses || []).map((item) => ({
        label: item.status_name,
        value: item.status_key,
      }));

      return [
        {
          key: "lead_status",
          label: "Lead Status",
          type: "string",
          choices: lead_status,
          required: true,
          helpText: "Select lead status",
          altersDynamicFields: false,
        },
      ];
    }

    return [];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "search_property_name",
        label: "Select Search Property Name",
        type: "string",
        helpText:
          "Select Company Field Name on which Find Action will be performed.",
        choices: {
          company_name: "Company Name",
          domain: "Domain",
          company_type: "Company Type",
          category: "Category",
          lead_status: "Lead Status",
          industry: "Industry",
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: "condition",
        label: "Select Condition",
        type: "string",
        helpText: "Select the Condition of filter search",
        choices: { is: "Is", not: "Not", contains: "Contains" },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      inputFields,
    ],
    sample: {
      id: "7463116721927229441",
      company_id: "7463116721927229441",
      display_id: "COMPANY_0267",
      company_name: "Sample Company",
      domain: "https://sample.com",
      hq_location: "Afghanistan",
      hq_country: "Afghanistan",
      industry: "Agriculture",
      employee_range: "51-200",
      estimated_arr: null,
      description: "Sample Description",
      company_owner: {
        user_id: "7427648063344218113",
        full_name: "Sample Admin",
      },
      company_type: "prospect",
      lead_status: "new",
      icp_fit: null,
      customer_segment: null,
      connection_strength: null,
      connection_source: null,
      category: null,
      vendor_being_replaced: null,
      replacement_urgency: null,
      partner_type: null,
      parent_company: "7462824333019189249",
      contacts_count: 0,
      is_draft: false,
      creation_time: "2026-05-21T06:41:24.511000Z",
      last_update_time: "2026-05-21T06:41:24.511000Z",
      record_source: null,
      custom_fields: {
        cf_7463116711198199809: "cfo_7463116711198199810",
        cf_7463116711198199811: "cfo_7463116711198199812",
        cf_7463116721772040193: "cfo_7463116721772040194",
        cf_7463116721772040195: "cfo_7463116721772040196",
        cf_7463116721772040197: "7878",
        cf_7463116721772040198: "2026-05-27",
      },
      associated_deal_project: {
        deals: [{ id: "7463117099506864129", name: "Sample Deal" }],
      },
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "company_id", label: "Company Id" },
      { key: "display_id", label: "Display Id" },
      { key: "company_name", label: "Company Name" },
      { key: "domain", label: "Domain" },
      { key: "hq_location", label: "HQ Location" },
      { key: "hq_country", label: "HQ Country" },
      { key: "industry", label: "Industry" },
      { key: "employee_range", label: "Employee Range" },
      { key: "estimated_arr", label: "Estimated ARR" },
      { key: "description", label: "Description" },
      { key: "company_owner__user_id", label: "Company Owner User Id" },
      { key: "company_owner__full_name", label: "Company Owner Full Name" },
      { key: "company_type", label: "Company Type" },
      { key: "lead_status", label: "Lead Status" },
      { key: "icp_fit", label: "ICP Fit" },
      { key: "customer_segment", label: "Customer Segment" },
      { key: "connection_strength", label: "Connection Strength" },
      { key: "connection_source", label: "Connection Source" },
      { key: "category", label: "Category" },
      { key: "vendor_being_replaced", label: "Vendor Being Replaced" },
      { key: "replacement_urgency", label: "Replacement Urgency" },
      { key: "partner_type", label: "Partner Type" },
      { key: "parent_company", label: "Parent Company" },
      { key: "contacts_count", label: "Contacts Count", type: "number" },
      { key: "is_draft", label: "Is Draft", type: "boolean" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "record_source", label: "Record Source" },
      {
        key: "associated_deal_project__deals[]id",
        label: "Associated Deal Id",
      },
      {
        key: "associated_deal_project__deals[]name",
        label: "Associated Deal Name",
      },
    ],
  },
  display: {
    description: "Finds a Company by Name",
    hidden: false,
    label: "Find Company",
  },
  key: "find_company",
  noun: "Company",
};
