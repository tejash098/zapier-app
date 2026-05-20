const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

module.exports = {
  operation: {
    perform: perform,
    sample: {
      project_id: "7442427864764387329",
      project_name: "Projetly",
      description:
        "Projetly is an AI-powered platform to streamline onboarding, manage projects, automate workflows, and collaborate with customers in digital sales rooms.",
      start_date: "2026-03-25T04:29:32.165000Z",
      due_date: "2026-06-02T00:00:00Z",
      is_arr: false,
      revenue: "$ 0",
      show_forecasted_date: false,
      forecasted_date: "2026-06-02T00:00:00Z",
      project_fee: 313555,
      project_owner: {
        full_name: "Admin Projetly",
        email: "sales@projetly.io",
        role: "Organization Admin",
        is_customer: false,
      },
      account_name: "Projetly Marketplace",
      region: "Asia",
      revenue_amount: 0,
      project_type: "internal_project",
      visible_to_all: true,
      expected_deal_value: 7890000,
      id: "7442427864764387329",
    },
    outputFields: [
      { key: "project_id", label: "Project Id" },
      { key: "project_name", label: "Project Name" },
      { key: "description", label: "Description" },
      { key: "start_date", label: "Start Date", type: "datetime" },
      { key: "due_date", label: "Due Date", type: "datetime" },
      { key: "is_arr", label: "Is Arr", type: "boolean" },
      { key: "revenue", label: "Revenue" },
      {
        key: "show_forecasted_date",
        label: "Show Forecasted Date",
        type: "boolean",
      },
      { key: "forecasted_date", label: "Forecasted Date", type: "datetime" },
      { key: "project_fee", label: "Project Fee", type: "number" },
      { key: "project_owner__full_name", label: "Project Owner Full Name" },
      { key: "project_owner__email", label: "Project Owner Email" },
      { key: "project_owner__role", label: "Project Owner Role" },
      {
        key: "project_owner__is_customer",
        label: "Project Owner Is Customer",
        type: "boolean",
      },
      { key: "account_name", label: "Account Name" },
      { key: "region", label: "Region" },
      { key: "revenue_amount", label: "Revenue Amount", type: "number" },
      { key: "project_type", label: "Project Type" },
      { key: "visible_to_all", label: "Visible To All", type: "boolean" },
      {
        key: "expected_deal_value",
        label: "Expected Deal Value",
        type: "number",
      },
      { key: "id", label: "Id" },
    ],
    inputFields: [],
    canPaginate: false,
    type: "hook",
    performSubscribe: {
      body: {
        target_url: "{{bundle.targetUrl}}",
        events: "[project_created]",
        app_name: "zapier",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      url: "{{process.env.WEBHOOK_SUBSCRIBE}}",
    },
    performUnsubscribe: {
      body: { subscriptionId: "{{bundle.subscribeData.id}}" },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "DELETE",
      url: "{{process.env.WEBHOOK_UNSUBSCRIBE",
    },
  },
  display: {
    description: "Triggers when a new project is created in Projetly.",
    hidden: false,
    label: "New Project Created",
  },
  key: "project_created",
  noun: "Project",
};
