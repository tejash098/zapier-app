const perform = async (z, bundle) => {
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
      lead_status_pipeline_id: bundle.inputData.lead_status_pipeline_id,
      parent_company: bundle.inputData.parent_company,
      parent_company_id: bundle.inputData.parent_company_id,
      operating_regions: bundle.inputData.operating_regions
        ? [bundle.inputData.operating_regions]
        : [],
      category: bundle.inputData.category,
      industry: bundle.inputData.industry,
      company_owner: bundle.inputData.company_owner,
      customer_segment: bundle.inputData.customer_segment,
      icp_fit: bundle.inputData.icp_fit,
      company_type: bundle.inputData.company_type,
      vendor_being_replaced: bundle.inputData.vendor_being_replaced,
      record_source: "integration",
      estimated_arr: bundle.inputData.estimated_arr,
      employee_range: bundle.inputData.employee_range,
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
      items_per_page: 20,
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
          "Select the Default Lead Status of Company, If Want to add custom Click on three dot icon",
        required: false,
        altersDynamicFields: false,
      },
    ];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "company_owner",
        label: "Company Owner",
        type: "string",
        helpText: "Select the Default Company Owner from given Users List",
        dynamic: "get_users.user_id.full_name",
        required: true,
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
        dynamic: "company_created.company_id.company_name",
        search: "find_company.company_id",
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
        list: false,
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
      {
        key: "customer_segment",
        label: "Customer Segment",
        type: "string",
        helpText: "Select the Customer Segment.",
        choices: {
          smb: "SMB",
          market: "Mid Market",
          enterprise: "Enterprise",
          strategic: "Strategic",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "icp_fit",
        label: "ICP Fit",
        type: "string",
        choices: {
          excellent: "Excellent",
          good: "Good",
          medium: "Medium",
          low: "Low",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "company_type",
        label: "Company Type",
        type: "string",
        choices: {
          prospect: "Prospect",
          active_customer: "Active Customer",
          partner: "Partner",
          other: "Other",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "vendor_being_replaced",
        label: "Vendor Being Replaced",
        type: "string",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "estimated_arr",
        label: "Estimated ARR",
        type: "string",
        choices: {
          "1-5m": "1-5M",
          "5-10m": "5-10M",
          "10-50m": "10-50M",
          "50m+": "50M+",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "employee_range",
        label: "Employee Range",
        type: "string",
        choices: {
          "1-10": "1-10 Employees",
          "11-50": "11-50 Employees",
          "51-200": "51-200 Employees",
          "201-500": "201-500 Employees",
          "500+": "500+ Employees",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      status: "success",
      entity_id: "7455508487884247041",
      message: "Saved",
    },
    outputFields: [
      { key: "status", label: "Status Id" },
      { key: "entity_id", label: "Company Id" },
      { key: "message", label: "Message" },
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
