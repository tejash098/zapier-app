const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: "",
        key: bundle.inputData.project_search_name,
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
      value: bundle.inputData[bundle.inputData.project_search_name],
    },
  ];

  const options = {
    url: `${process.env.MARKETPLACE_URL}/project/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: {
      items_per_page: 10,
      page: bundle.meta.page + 1,
      project_type: "project",
      module: "projects",
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

  const selected = bundle.inputData.project_search_name;

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
        key: "project_search_name",
        label: "Select Search Property Name",
        type: "string",
        helpText: "Select the project field to search on.",
        choices: { project_name: "Project Name", status__status_key: "Status" },
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
      id: "7442427864764387329",
      project_id: "7442427864764387329",
      project_name: "Sample Project",
      description: null,
      start_date: "2026-03-25T04:29:32.165000Z",
      due_date: "2026-06-02T00:00:00Z",
      project_score: 2,
      tasks_count: 42,
      milestones_count: 3,
      is_arr: false,
      revenue: "$ 0",
      show_forecasted_date: false,
      forecasted_date: null,
      project_fee: null,
      project_owner: {
        user_id: "7424683538143776769",
        full_name: "Sample Owner",
        email: "owner@example.com",
        role: "Organization Admin",
        is_customer: false,
      },
      health_score: 2,
      account_name: "Sample Account",
      all_milestones: [
        {
          name: "Week 1",
          color: "#e6ecf5",
          milestone_id: "7442427864802136065",
          status: {
            id: 2,
            status_key: "in_progress",
            status_name: "In Progress",
          },
          insight: { id: 4, key: "running_late", name: "Running Late" },
          is_project_due: false,
        },
        {
          name: "Week 2",
          color: "#f5e8e6",
          milestone_id: "7442427864806330369",
          status: {
            status_id: 1,
            status_key: "not_started",
            status_name: "Not Started",
          },
          insight: { id: 1, key: "on_time", name: "On Time" },
          is_project_due: false,
        },
      ],
      status: {
        id: 2,
        status_key: "in_progress",
        status_name: "In Progress",
        color: "#50C878",
        icon: "fa-solid fa-circle-three-quarters",
      },
      stage: {
        name: "Week 1",
        color: "#e6ecf5",
        milestone_id: "7442427864802136065",
        status: {
          id: 2,
          status_key: "in_progress",
          status_name: "In Progress",
        },
        insight: { id: 4, key: "running_late", name: "Running Late" },
        is_project_due: false,
      },
      progress: {
        overdue: 22,
        blocked: 0,
        on_hold: 1,
        completed: 9,
        in_progress: 12,
        open: 0,
        not_started: 20,
        total_tasks: 42,
      },
      region: "Asia",
      template_id: "7442427864802136065",
      project_users: [
        {
          user_id: "7424683538143776769",
          full_name: "Sample User 1",
          email: "user1@example.com",
          role: "Organization Admin",
          is_customer: false,
          is_owner: true,
        },
        {
          user_id: "7424309824034181121",
          full_name: "Sample User 2",
          email: "user2@example.com",
          role: "Organization Admin",
          added_date: "2026-03-25T04:32:26.293000",
        },
      ],
      account_id: "7424309865402601473",
      five_milestones: [
        {
          name: "Week 1",
          color: "#e6ecf5",
          milestone_id: "7442427864802136065",
          status: {
            id: 2,
            status_key: "in_progress",
            status_name: "In Progress",
          },
          insight: { id: 4, key: "running_late", name: "Running Late" },
          is_project_due: false,
        },
        {
          name: "Week 2",
          color: "#f5e8e6",
          milestone_id: "7442427864806330369",
          status: {
            status_id: 1,
            status_key: "not_started",
            status_name: "Not Started",
          },
          insight: { id: 1, key: "on_time", name: "On Time" },
          is_project_due: false,
        },
      ],
      external_map: null,
      follow_up_project_data: null,
      formatted_revenue: "$ 0 ",
      revenue_amount: 0,
      pipeline_id: null,
      current_milestone_id: null,
      project_type: "internal_project",
      project_type_str: "UI.pr_internal_project",
      position: 1,
      visible_to_all: true,
      status_position: 0,
      expected_deal_value: null,
      formatted_deal_value: "$ 0 ",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "project_id", label: "Project Id" },
      { key: "project_name", label: "Project Name" },
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
      { key: "project_owner__user_id", label: "Project Owner User Id" },
      { key: "project_owner__full_name", label: "Project Owner Full Name" },
      { key: "project_owner__email", label: "Project Owner Email" },
      { key: "project_owner__role", label: "Project Owner Role" },
      {
        key: "project_owner__is_customer",
        label: "Project Owner Is Customer",
        type: "boolean",
      },
      { key: "health_score", label: "Health Score", type: "number" },
      { key: "account_name", label: "Account Name" },
      { key: "all_milestones[]name", label: "Milestone Name" },
      { key: "all_milestones[]color", label: "Milestone Color" },
      { key: "all_milestones[]milestone_id", label: "Milestone Id" },
      {
        key: "all_milestones[]status__status_key",
        label: "Milestone Status Key",
      },
      {
        key: "all_milestones[]status__status_name",
        label: "Milestone Status Name",
      },
      { key: "all_milestones[]insight__key", label: "Milestone Insight Key" },
      { key: "all_milestones[]insight__name", label: "Milestone Insight Name" },
      {
        key: "all_milestones[]is_project_due",
        label: "Milestone Is Project Due",
        type: "boolean",
      },
      { key: "status__id", label: "Status Id", type: "number" },
      { key: "status__status_key", label: "Status Key" },
      { key: "status__status_name", label: "Status Name" },
      { key: "status__color", label: "Status Color" },
      { key: "status__icon", label: "Status Icon" },
      { key: "stage__name", label: "Stage Name" },
      { key: "stage__color", label: "Stage Color" },
      { key: "stage__milestone_id", label: "Stage Milestone Id" },
      { key: "stage__status__status_key", label: "Stage Status Key" },
      { key: "stage__status__status_name", label: "Stage Status Name" },
      { key: "stage__insight__key", label: "Stage Insight Key" },
      { key: "stage__insight__name", label: "Stage Insight Name" },
      {
        key: "stage__is_project_due",
        label: "Stage Is Project Due",
        type: "boolean",
      },
      { key: "progress__overdue", label: "Progress Overdue", type: "number" },
      { key: "progress__blocked", label: "Progress Blocked", type: "number" },
      { key: "progress__on_hold", label: "Progress On Hold", type: "number" },
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
        key: "progress__not_started",
        label: "Progress Not Started",
        type: "number",
      },
      {
        key: "progress__total_tasks",
        label: "Progress Total Tasks",
        type: "number",
      },
      { key: "region", label: "Region" },
      { key: "template_id", label: "Template Id" },
      { key: "project_users[]user_id", label: "Project User Id" },
      { key: "project_users[]full_name", label: "Project User Full Name" },
      { key: "project_users[]email", label: "Project User Email" },
      { key: "project_users[]role", label: "Project User Role" },
      { key: "project_users[]added_date", label: "Project User Added Date" },
      {
        key: "project_users[]is_customer",
        label: "Project User Is Customer",
        type: "boolean",
      },
      {
        key: "project_users[]is_owner",
        label: "Project User Is Owner",
        type: "boolean",
      },
      { key: "account_id", label: "Account Id" },
      { key: "five_milestones[]name", label: "Five Milestone Name" },
      { key: "five_milestones[]milestone_id", label: "Five Milestone Id" },
      {
        key: "five_milestones[]status__status_key",
        label: "Five Milestone Status Key",
      },
      {
        key: "five_milestones[]status__status_name",
        label: "Five Milestone Status Name",
      },
      { key: "external_map", label: "External Map" },
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
    description: "Finds a Project by Name",
    hidden: false,
    label: "Find Project",
  },
  key: "find_project",
  noun: "Project",
};
