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
    url: `${process.env.MARKETPLACE_URL}/contact/`,
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
    full_name: {
      key: "full_name",
      label: "Full Name",
      type: "string",
      required: true,
      helpText: "Enter the full name",
    },

    job_title: {
      key: "job_title",
      label: "Job Title",
      type: "string",
      required: true,
      helpText: "Enter the job title",
    },

    location: {
      key: "location",
      label: "Location",
      type: "string",
      required: true,
      helpText: "Enter the location",
    },
  };

  const selected = bundle.inputData.search_property_name;

  // Normal input fields
  if (fieldMap[selected]) {
    return [fieldMap[selected]];
  }

  // Dynamic dropdown/API fields
  const options = {
    url: `${process.env.MARKETPLACE_URL}/contact/`,
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

    // Lead Status
    if (selected === "lead_status") {
      choices = (data.contact_lead_statuses || []).map((item) => ({
        label: item.status_name,
        value: item.status_key,
      }));

      return [
        {
          key: "lead_status",
          label: "Lead Status",
          type: "string",
          choices,
          required: true,
          helpText: "Select lead status",
          altersDynamicFields: false,
        },
      ];
    }

    // Contact Category
    if (selected === "person_category") {
      choices = (data.contact_person_categories || []).map((item) => ({
        label: item.key,
        value: item.key,
      }));

      return [
        {
          key: "person_category",
          label: "Person Category",
          type: "string",
          choices,
          required: true,
          helpText: "Select contact person category",
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
          "Select Contact Field Name on which Find Action will be performed.",
        choices: {
          full_name: "Full Name",
          job_title: "Job Title",
          lead_status: "Lead Status",
          location: "Location",
          person_category: "Person Category",
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: "condition",
        label: "Select Condition",
        type: "string",
        helpText:
          "Select how the search should match the value (Is = exact, Not = exclude, Contains = substring).",
        choices: { is: "Is", not: "Not", contains: "contains" },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      inputFields,
    ],
    sample: {
      id: "7463139406275153921",
      contact_id: "7463139406275153921",
      display_id: "PERSON_0081",
      full_name: "Sample Contact",
      primary_email: "jane.doe@example.com",
      company: [
        { company_id: "7463131829172703233", company_name: "Sample Company" },
      ],
      lead_source: "UI.pr_lead_source_projetly_ui",
      contact_owner: { full_name: "Sample Admin" },
      lead_status: "new",
      person_category: {
        key: "customer_contact",
        name: "UI.pr_person_category_customer_contact",
      },
      contact_stage: null,
      is_draft: false,
      job_title: null,
      department: null,
      location: null,
      language: null,
      seniority_level: null,
      buying_role: null,
      influence_level: null,
      interest_level: null,
      preferred_communication_channel: null,
      do_not_contact: null,
      phone: null,
      campaign: null,
      timezone: null,
      signoff_authority: null,
      lead_score: null,
      last_activity_date: null,
      linked_user: null,
      creation_time: "2026-05-21T08:11:32.881000Z",
      last_update_time: "2026-05-22T06:03:19.819000Z",
      reports_to: null,
      login_info: {
        user_id: "7463139481042817025",
        profile_id: "7463139485883043841",
        is_active: true,
        is_fir_login: false,
        slack_connected: true,
        teams_connected: false,
      },
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "contact_id", label: "Contact Id" },
      { key: "display_id", label: "Display Id" },
      { key: "full_name", label: "Full Name" },
      { key: "primary_email", label: "Primary Email" },
      { key: "company[]company_id", label: "Company Id" },
      { key: "company[]company_name", label: "Company Name" },
      { key: "lead_source", label: "Lead Source" },
      { key: "contact_owner__full_name", label: "Contact Owner Full Name" },
      { key: "lead_status", label: "Lead Status" },
      { key: "person_category__key", label: "Person Category Key" },
      { key: "person_category__name", label: "Person Category Name" },
      { key: "contact_stage", label: "Contact Stage" },
      { key: "is_draft", label: "Is Draft", type: "boolean" },
      { key: "job_title", label: "Job Title" },
      { key: "department", label: "Department" },
      { key: "location", label: "Location" },
      { key: "language", label: "Language" },
      { key: "seniority_level", label: "Seniority Level" },
      { key: "buying_role", label: "Buying Role" },
      { key: "influence_level", label: "Influence Level", type: "number" },
      { key: "interest_level", label: "Interest Level", type: "number" },
      {
        key: "preferred_communication_channel",
        label: "Preferred Communication Channel",
      },
      { key: "do_not_contact", label: "Do Not Contact" },
      { key: "phone", label: "Phone" },
      { key: "campaign", label: "Campaign" },
      { key: "timezone", label: "Timezone" },
      { key: "signoff_authority", label: "Signoff Authority" },
      { key: "lead_score", label: "Lead Score" },
      {
        key: "last_activity_date",
        label: "Last Activity Date",
        type: "datetime",
      },
      { key: "linked_user", label: "Linked User" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "reports_to", label: "Reports To" },
      { key: "login_info__user_id", label: "Login User Id" },
      { key: "login_info__profile_id", label: "Login Profile Id" },
      {
        key: "login_info__is_active",
        label: "Login Is Active",
        type: "boolean",
      },
      {
        key: "login_info__is_fir_login",
        label: "Login Is First Login",
        type: "boolean",
      },
      {
        key: "login_info__slack_connected",
        label: "Login Slack Connected",
        type: "boolean",
      },
      {
        key: "login_info__teams_connected",
        label: "Login Teams Connected",
        type: "boolean",
      },
    ],
  },
  display: {
    description: "Finds a Contact by Email",
    hidden: false,
    label: "Find Contact",
  },
  key: "find_contact",
  noun: "Contact",
};
