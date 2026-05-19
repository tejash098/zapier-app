const resolveOwner = async (z, bundle, ownerKey) => {
  const { owner_email, owner_name } = bundle.inputData;
  const ownerId = bundle.inputData[ownerKey];

  const res = await z.request({
    url: `${process.env.NGROK_URL}/users/`,
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const users = Array.isArray(res.json) ? res.json : [];

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

const perform = async (z, bundle) => {
  const templateRes = await z.request({
    url: `${process.env.NGROK_URL}/templates/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      module: "templates",
      template_type: "project",
      sub_template_type: bundle.inputData.project_type || null,
    },
  });
  const templateData = templateRes.json;
  const template = templateData.results.find(
    (result) => result.org_temp_id === bundle.inputData.org_temp_id,
  );

  const ownerData = await resolveOwner(z, bundle, "owner_id");
  const ownerDict = {
    user_id: ownerData.user_id || null,
    full_name: ownerData.full_name || null,
    profile_image: ownerData.image || null,
    email: ownerData.email || null,
    role: ownerData.role?.role_name || null,
    phone_number: ownerData.phone?.number || null,
    is_customer: false,
  };

  const contactRes = await z.request({
    url: `${process.env.NGROK_URL}/contact/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      contact_id: bundle.inputData.contact_id,
    },
  });
  const contactData = contactRes.json || {};
  const contactDict = {
    contact_id: contactData.contact_id || null,
    name: contactData.full_name || null,
    full_name: contactData.full_name || null,
    email: contactData.primary_email || null,
    team_id: "contact_team",
    is_contact: true,
  };

  const options = {
    url: `${process.env.NGROK_URL}/project/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: {},
    body: {
      project: {
        project_name: bundle.inputData.project_name,
        start_date: bundle.inputData.start_date,
        due_date: bundle.inputData.due_date,
        project_type: bundle.inputData.project_type,
        project_fee: bundle.inputData.project_fee,
        show_forecasted_date: bundle.inputData.show_forecasted_date,
        revenue: bundle.inputData.revenue,
        is_arr: bundle.inputData.is_arr,
        project_template: template || {},
        project_owner: ownerDict || {},
        customer_project_owner: contactDict || {},
      },
      account: {
        company_id: bundle.inputData.company_id,
        account_name: bundle.inputData.account_name,
        description: bundle.inputData.description,
        region: bundle.inputData.region,
        vertical: bundle.inputData.vertical,
        segment: bundle.inputData.segment,
        website_url: bundle.inputData.website_url,
        account_owner: ownerDict || {},
        customer: contactDict || {},
        invite_type: "invite_later",
      },
      account_id: "",
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const inputFields = async (z, bundle) => {
  const selected = bundle.inputData.is_arr;

  if (selected === true) {
    return [
      {
        key: "revenue",
        label: "Annual Recurring Revenue (ARR)",
        type: "number",
        required: false,
        helpText: "Enter the annual recurring revenue",
      },
    ];
  }

  if (selected === false) {
    return [
      {
        key: "revenue",
        label: "Monthly Recurring Revenue (MRR)",
        type: "number",
        required: false,
        helpText: "Enter the monthly recurring revenue",
      },
    ];
  }

  return [];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "company_id",
        label: "Account / Company Id",
        type: "string",
        helpText: "Enter the Account Id from above step",
        dynamic: "company_created.company_id.company_name",
        search: "find_company.company_id",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_id",
        label: "Owner Id",
        type: "string",
        helpText:
          "Select Default Owner Id for Project. Optionally provide Owner Email or Name below to auto-map from Projetly user list; if not found, this selection is used.",
        dynamic: "get_users.profile_id.full_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_email",
        label: "Owner Email (optional)",
        type: "string",
        helpText:
          "Enter owner email to auto-map from Projetly user list. If not found, the selected Owner Id will be used.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_name",
        label: "Owner Name (optional)",
        type: "string",
        helpText: "Enter owner full name to auto-map. Used as fallback if email lookup fails.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "contact_id",
        label: "Customer / Contact Id",
        type: "string",
        dynamic: "get_contact.contact_id.full_name",
        search: "find_contact.contact_id",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "project_type",
        label: "Project Type",
        type: "string",
        choices: {
          onboarding: "Onboarding",
          service_delivery: "Service Delivery",
        },
        helpText: "Select the type of Project",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "org_temp_id",
        label: "Select Project Template",
        type: "string",
        helpText: "Select the project template from dropdown",
        dynamic: "get_project_template.org_temp_id.template_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "project_name",
        label: "Project Name",
        type: "string",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "start_date",
        label: "Start Date",
        type: "datetime",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "due_date",
        label: "Due Date",
        type: "datetime",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "is_arr",
        label: "Is Arr",
        type: "boolean",
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: "project_fee",
        label: "Project Fee",
        type: "number",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "show_forecasted_date",
        label: "Show Forecasted Date",
        type: "boolean",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      inputFields,
    ],
    sample: {
      status: "success",
      project_id: "7455240550829002753",
      account_id: "",
      name: "",
      message: "Successfully added project",
    },
    outputFields: [
      { key: "status", label: "Status" },
      { key: "project_id", label: "Project Id" },
      { key: "account_id", label: "Account Id" },
      { key: "name", label: "Name" },
      { key: "message", label: "Message" },
    ],
  },
  display: {
    description: "Creates a Project in Projetly.",
    hidden: false,
    label: "Create Project",
  },
  key: "create_project",
  noun: "Project",
};
