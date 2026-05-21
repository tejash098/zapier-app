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
      id: "7454851902669328385",
      company_id: "7454851902669328385",
      company_name: "Projetly",
      domain: "https://projetly.ai/",
      linkedin_url: "https://linkedInurl.com",
      twitter_url: "https://twitter.com",
      hq_location: "Bengaluru, Karnataka, India",
      hq_country: "India",
      industry: "Sales & Marketing Automation",
      description:
        "Projetly is an AI-powered platform to streamline onboarding, manage projects, automate workflows, and collaborate with customers in digital sales rooms.",
      company_owner: { full_name: "Projetly Admin" },
      company_type: "prospect",
      lead_status: "new",
      icp_fit: "excellent",
      connection_strength: "strong",
      connection_source: null,
      operating_regions: ["Asia", "Europe", "Middle East"],
      category: "marketing",
      vendor_being_replaced: "Projetly",
      replacement_urgency: "low",
      partner_type: "",
      parent_company: "",
      contacts_count: 0,
      creation_time: "2026-04-28T11:19:58.047000Z",
      last_update_time: "2026-04-28T11:19:58.047000Z",
      record_source: "",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "company_id", label: "Company Id" },
      { key: "company_name", label: "Company Name" },
      { key: "domain", label: "Domain" },
      { key: "linkedin_url", label: "LinkedIn URL" },
      { key: "twitter_url", label: "Twitter URL" },
      { key: "hq_location", label: "Location" },
      { key: "hq_country", label: "Country" },
      { key: "industry", label: "Industry" },
      { key: "description", label: "Description" },
      { key: "company_owner__full_name", label: "Company Owner Full Name" },
      { key: "company_type", label: "Company Type" },
      { key: "lead_status", label: "Lead Status" },
      { key: "icp_fit", label: "ICP Fit" },
      { key: "connection_strength", label: "Connection Strength" },
      { key: "connection_source", label: "Connection Source" },
      { key: "operating_regions[]0", label: "Operating Regions" },
      { key: "category", label: "Category" },
      { key: "vendor_being_replaced", label: "Vendor Being Replaced" },
      { key: "replacement_urgency", label: "Replacement Urgency" },
      { key: "partner_type", label: "Partner Type" },
      { key: "parent_company", label: "Parent Company" },
      { key: "contacts_count", label: "Contacts Count", type: "number" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "record_source", label: "Record Source" },
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
