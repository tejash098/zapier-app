const perform = async (z, bundle) => {
  const templateRes = await z.request({
    url: `${process.env.NGROK_URL}/templates/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      module: "templates",
      template_type: "deal_stages",
      sub_template_type: 4,
    },
  });
  const templateData = templateRes.json;
  const template = templateData.results.find(
    (result) => result.org_temp_id === bundle.inputData.template_id,
  );

  const ownerRes = await z.request({
    url: `${process.env.NGROK_URL}/users/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      user_id: bundle.inputData.owner_id,
    },
  });
  const ownerData = ownerRes.json.find((item)=>item.user_id === bundle.inputData.owner_id) || {};
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
    contact_id: contactData.user_id || null,
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
        pipeline_id: bundle.inputData.selected_pipeline,
        target_milestone_id: bundle.inputData.selected_milestone,
        start_date: bundle.inputData.start_date,
        due_date: bundle.inputData.due_date,
        expected_deal_value: bundle.inputData.expected_deal_value,
        billing_model: bundle.inputData.billing_model,
        billing_frequency: bundle.inputData.billing_frequency,
        deal_resources: bundle.inputData.deal_resources,
        contract_duration: bundle.inputData.contract_duration,
        duration_type: bundle.inputData.duration_type,
        revenue: bundle.inputData.revenue,
        hourly_rate: bundle.inputData.hourly_rate,
        monthly_rate: bundle.inputData.monthly_rate,
        project_type: "sales_deal_room",
        project_template: template || {},
        customer_project_owner: contactDict || {},
        project_owner: ownerDict || {},
      },
      account: {
        company_id: bundle.inputData.company_id,
        account_name: bundle.inputData.account_name,
        description: bundle.inputData.description,
        region: bundle.inputData.region,
        vertical: bundle.inputData.vertical,
        segment: bundle.inputData.segment,
        website_url: bundle.inputData.website_url,
        customer: contactDict || {},
        account_owner: ownerDict || {},
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
    return results;
  });
};

const inputFields = async (z, bundle) => {
  const selected = bundle.inputData.billing_model;

  if (selected === "fixed_cost") {
    return [];
  }

  if (selected === "annual_recurring") {
    return [
      {
        key: "revenue",
        label: "Annual Recurring Revenue (ARR)",
        type: "number",
        required: false,
        helpText: "Enter the annual recurring revenue",
      },
      {
        key: "contract_duration",
        label: "Contract Duration (Years)",
        type: "number",
        required: false,
        helpText: "Enter the contract duration in years",
      },
    ];
  }

  if (selected === "monthly_recurring") {
    return [
      {
        key: "revenue",
        label: "Monthly Recurring Revenue (MRR)",
        type: "number",
        required: false,
        helpText: "Enter the monthly recurring revenue",
      },
      {
        key: "contract_duration",
        label: "Contract Duration (Months)",
        type: "number",
        required: false,
        helpText: "Enter the contract duration in months",
      },
    ];
  }

  if (selected === "time_materials") {
    return [
      {
        key: "billing_frequency",
        label: "Billing Frequency",
        type: "string",
        required: false,
        altersDynamicFields: true,
        choices: {
          hourly: "Hourly",
          monthly: "Monthly",
        },
        helpText: "Select the billing frequency",
      },
      {
        key: "deal_resources",
        label: "Deal Resources",
        type: "string",
        required: false,
        helpText: "Enter the Deal Resources.",
      },
    ];
  }

  return [];
};

const inputFields1 = async (z, bundle) => {
  const selected = bundle.inputData.billing_frequency;

  if (selected === "hourly") {
    return [
      {
        key: "hourly_rate",
        label: "Hourly Rate",
        type: "number",
        required: false,
        helpText: "Enter the hourly rate",
      },
      {
        key: "contract_duration",
        label: "Contract Duration (Days)",
        type: "number",
        required: false,
        helpText: "Enter the contract duration in days",
      },
    ];
  }

  if (selected === "monthly") {
    return [
      {
        key: "monthly_rate",
        label: "Monthly Rate",
        type: "number",
        required: false,
        helpText: "Enter the monthly rate",
      },
      {
        key: "contract_duration",
        label: "Contract Duration (Days)",
        type: "number",
        required: false,
        helpText: "Enter the contract duration in days",
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
        dynamic: "get_company.company_id.company_name",
        search: "find_company.company_id",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "contact_id",
        label: "Customer / Contact Id",
        type: "string",
        helpText:
          "Select the Existing Contact Id, If Not present add search step to create",
        dynamic: "get_contact.contact_id.full_name",
        search: "find_contact.contact_id",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_id",
        label: "Default Owner Id",
        type: "string",
        helpText: "Select Default Owner Id for Deal",
        dynamic: "get_users.profile_id.full_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "account_name",
        label: "Account: Account Name",
        type: "string",
        helpText: "Enter the Account Name",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "website_url",
        label: "Account: website URL / Domain",
        type: "string",
        helpText: "Enter the Website URL or Domain Name of Account",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "description",
        label: "Account: Description",
        type: "string",
        helpText: "Enter the Description of Account.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "vertical",
        label: "Account: Vertical",
        type: "string",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "segment",
        label: "Account: Segment",
        type: "string",
        helpText: "Enter the Segment / Industry of Account.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "region",
        label: "Account: Region",
        type: "string",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "project_name",
        label: "Deal: Name",
        type: "string",
        helpText: "Enter the Deal Name.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "selected_pipeline",
        label: "Deal: Pipeline",
        type: "string",
        dynamic: "get_pipeline.id.template_name",
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: "selected_milestone",
        label: "Deal: Stage / Milestone",
        type: "string",
        dynamic: "get_pipeline_stages.id.name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "template_id",
        label: "Select Default Deal Room Template",
        type: "string",
        helpText: "select the template for your sales deal room",
        dynamic: "get_deal_room_templates.id.template_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "start_date",
        label: "Deal: Start Date",
        type: "datetime",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "due_date",
        label: "Deal: Due Date",
        type: "datetime",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "expected_deal_value",
        label: "Expected Deal Value",
        type: "number",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "billing_model",
        label: "Billing Model",
        type: "string",
        helpText: "Select Billing Model",
        choices: {
          fixed_cost: "Fixed Cost",
          annual_recurring: "Annual Recurring",
          monthly_recurring: "Monthly Recurring",
          time_materials: "Time & Material",
        },
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
      inputFields1,
    ],
    sample: {
      status: "success",
      project_id: "7455235793758457857",
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
    description: "Creates a Deal in Projetly.",
    hidden: false,
    label: "Create Deal",
  },
  key: "create_deal",
  noun: "Deal",
};
