const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: "",
        key: bundle.inputData.deal_search_name,
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
      value: bundle.inputData[bundle.inputData.deal_search_name],
    },
  ];

  const options = {
    url: `${process.env.MARKETPLACE_URL}/project/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: {
      items_per_page: 10,
      page: bundle.meta.page + 1,
      project_type: "deal",
      module: "deal_plan",
      filter: JSON.stringify(filter),
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json || {};
    return data.results || [];
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    project_name: {
      key: "project_name",
      label: "Project Name",
      type: "string",
      required: true,
      helpText: "Enter the Project name",
    },
    status__status_key: {
      key: "status__status_key",
      label: "Status",
      type: "string",
      required: true,
      altersDynamicFields: false,
      choices: [
        {
          label: "Not Started",
          value: "not_started",
        },
        {
          label: "In Progress",
          value: "in_progress",
        },
        {
          label: "On Hold",
          value: "on_hold",
        },
        {
          label: "Completed",
          value: "completed",
        },
      ],
      helpText: "Search By Status of Project",
    },
  };

  const selected = bundle.inputData.deal_search_name;

  if (fieldMap[selected]) {
    return [fieldMap[selected]];
  }

  return [];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "deal_search_name",
        label: "Select Search Property Name",
        type: "string",
        helpText:
          "Select Deal Field Name on which Find Action will be performed.",
        choices: { project_name: "Deal Name", status__status_key: "Status" },
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
        choices: { is: "Is", not: "Not", contains: "Contains" },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      inputFields,
    ],
    sample: {
      id: "7463469874094804993",
      project_id: "7463469874094804993",
      project_name: "Sample Deal",
      description: null,
      start_date: "2026-05-22T06:04:10.707000Z",
      due_date: "2026-05-28T18:30:00Z",
      project_score: 5,
      tasks_count: 0,
      milestones_count: 0,
      is_arr: false,
      revenue: "$ 0",
      show_forecasted_date: false,
      forecasted_date: null,
      project_fee: null,
      project_owner: {
        user_id: "7427301354906849281",
        profile_id: "7427301359768047617",
        full_name: "Sample Owner",
        email: "owner@example.com",
      },
      health_score: 5,
      account_name: "Sample Account",
      insights: {
        id: 1,
        key: "on_time",
        text: "On Time",
        class: "fa-solid fa-thumbs-up text-success",
      },
      status: {
        id: 4,
        status_key: "closed_won",
        status_name: "Closed Won",
        color: "#388C54",
        icon: "fa-solid fa-circle-check",
      },
      progress: { completed: 0, in_progress: 0, open: 0, total_tasks: 0 },
      region: "USA",
      template_id: "7463469874132553729",
      project_customers: [
        {
          user_id: "7457324492503650305",
          full_name: "Sample Customer",
          email: "customer@example.com",
          role: "Customer",
          is_invite_sent: false,
          invite_sent_at: null,
          is_customer: true,
        },
      ],
      account_id: "7455602071400615937",
      customer_project_owner: {
        user_id: "7457324492503650305",
        contact_id: "7457323178814083073",
        name: "Sample Customer",
        full_name: "Sample Customer",
        email: "customer@example.com",
        team_id: "contact_team",
        is_contact: true,
        is_invite_sent: false,
        is_customer: true,
        invite_sent_at: null,
      },
      external_map: { project_id: "7463471496124436481", project_flag: true },
      follow_up_project_data: null,
      formatted_revenue: "$ 0 ",
      revenue_amount: 0,
      pipeline_id: "7424309800785154049",
      current_milestone_id: "7424309800785154054",
      project_type: "sales_deal_room",
      project_type_str: "UI.pr_sales_deal_room",
      position: 0,
      visible_to_all: false,
      status_position: 0,
      expected_deal_value: 7894652,
      formatted_deal_value: "$ 7.89 M",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "project_id", label: "Deal Id" },
      { key: "project_name", label: "Deal Name" },
      { key: "description", label: "Description" },
      { key: "start_date", label: "Start Date", type: "datetime" },
      { key: "due_date", label: "Due Date", type: "datetime" },
      { key: "project_score", label: "Project Score", type: "number" },
      { key: "tasks_count", label: "Tasks Count", type: "number" },
      { key: "milestones_count", label: "Milestones Count", type: "number" },
      { key: "is_arr", label: "Is Arr", type: "boolean" },
      { key: "revenue", label: "Revenue" },
      {
        key: "show_forecasted_date",
        label: "Show Forecasted Date",
        type: "boolean",
      },
      { key: "forecasted_date", label: "Forecasted Date", type: "datetime" },
      { key: "project_fee", label: "Project Fee", type: "number" },
      { key: "project_owner__user_id", label: "Deal Owner User Id" },
      { key: "project_owner__profile_id", label: "Deal Owner Profile Id" },
      { key: "project_owner__full_name", label: "Deal Owner Full Name" },
      { key: "project_owner__email", label: "Deal Owner Email" },
      { key: "health_score", label: "Health Score", type: "number" },
      { key: "account_name", label: "Account Name" },
      { key: "insights__id", label: "Insight Id", type: "number" },
      { key: "insights__key", label: "Insight Key" },
      { key: "insights__text", label: "Insight Text" },
      { key: "insights__class", label: "Insight Class" },
      { key: "status__id", label: "Status Id", type: "number" },
      { key: "status__status_key", label: "Status Key" },
      { key: "status__status_name", label: "Status Name" },
      { key: "status__color", label: "Status Color" },
      { key: "status__icon", label: "Status Icon" },
      {
        key: "progress__completed",
        label: "Progress Completed",
        type: "number",
      },
      {
        key: "progress__in_progress",
        label: "Progress In Progress",
        type: "number",
      },
      { key: "progress__open", label: "Progress Open", type: "number" },
      {
        key: "progress__total_tasks",
        label: "Progress Total Tasks",
        type: "number",
      },
      { key: "region", label: "Region" },
      { key: "template_id", label: "Template Id" },
      { key: "project_customers[]user_id", label: "Customer User Id" },
      { key: "project_customers[]full_name", label: "Customer Full Name" },
      { key: "project_customers[]email", label: "Customer Email" },
      { key: "project_customers[]role", label: "Customer Role" },
      {
        key: "project_customers[]is_invite_sent",
        label: "Customer Is Invite Sent",
        type: "boolean",
      },
      {
        key: "project_customers[]invite_sent_at",
        label: "Customer Invite Sent At",
      },
      {
        key: "project_customers[]is_customer",
        label: "Customer Is Customer",
        type: "boolean",
      },
      { key: "account_id", label: "Account Id" },
      {
        key: "customer_project_owner__user_id",
        label: "Customer Owner User Id",
      },
      {
        key: "customer_project_owner__contact_id",
        label: "Customer Owner Contact Id",
      },
      { key: "customer_project_owner__name", label: "Customer Owner Name" },
      {
        key: "customer_project_owner__full_name",
        label: "Customer Owner Full Name",
      },
      { key: "customer_project_owner__email", label: "Customer Owner Email" },
      {
        key: "customer_project_owner__team_id",
        label: "Customer Owner Team Id",
      },
      {
        key: "customer_project_owner__is_contact",
        label: "Customer Owner Is Contact",
        type: "boolean",
      },
      {
        key: "customer_project_owner__is_invite_sent",
        label: "Customer Owner Is Invite Sent",
        type: "boolean",
      },
      {
        key: "customer_project_owner__is_customer",
        label: "Customer Owner Is Customer",
        type: "boolean",
      },
      {
        key: "customer_project_owner__invite_sent_at",
        label: "Customer Owner Invite Sent At",
      },
      { key: "external_map__project_id", label: "External Map Project Id" },
      {
        key: "external_map__project_flag",
        label: "External Map Project Flag",
        type: "boolean",
      },
      { key: "follow_up_project_data", label: "Follow Up Project Data" },
      { key: "formatted_revenue", label: "Formatted Revenue" },
      { key: "revenue_amount", label: "Revenue Amount", type: "number" },
      { key: "pipeline_id", label: "Pipeline Id" },
      { key: "current_milestone_id", label: "Current Milestone Id" },
      { key: "project_type", label: "Project Type" },
      { key: "project_type_str", label: "Project Type Str" },
      { key: "position", label: "Position", type: "number" },
      { key: "visible_to_all", label: "Visible To All", type: "boolean" },
      { key: "status_position", label: "Status Position", type: "number" },
      {
        key: "expected_deal_value",
        label: "Expected Deal Value",
        type: "number",
      },
      { key: "formatted_deal_value", label: "Formatted Deal Value" },
    ],
    canPaginate: false,
  },
  display: {
    description: "Finds a Deal by Name",
    hidden: false,
    label: "Find Deal",
  },
  key: "find_deal",
  noun: "Deal",
};
