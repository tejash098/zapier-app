const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: "",
        key: bundle.inputData.task_search_name,
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
      value: bundle.inputData[bundle.inputData.task_search_name],
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
      project_id: bundle.inputData.project_id,
      filter: JSON.stringify(filter),
      task_filter: true,
    },
    removeMissingValuesFrom: { body: false, params: false },
  };

  return z.request(options).then((response) => {
    const milestones = response.json.milestones || [];
    return milestones.flatMap((m) => m.tasks || []);
  });
};

const inputFields = async (z, bundle) => {
  const selected = bundle.inputData.task_search_name;

  if (!selected) return [];

  if (selected === "due_date") {
    return [
      {
        key: "condition",
        label: "Condition",
        type: "string",
        choices: { after: "After Date", before: "Before Date" },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "due_date",
        label: "Due Date",
        type: "datetime",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ];
  }

  const conditionField = {
    key: "condition",
    label: "Condition",
    type: "string",
    choices: { is: "Is", not: "Not", contains: "Contains" },
    required: true,
    list: false,
    altersDynamicFields: false,
  };

  const fieldMap = {
    title: {
      key: "title",
      label: "Task Title",
      type: "string",
      required: true,
      helpText: "Enter the task title to search for.",
    },
    status__status_name: {
      key: "status__status_name",
      label: "Status",
      type: "string",
      required: true,
      helpText: "Enter the task status to search for.",
    },
    tags__tag_name: {
      key: "tags__tag_name",
      label: "Tag Name",
      type: "string",
      required: true,
      helpText: "Enter the tag name to search for.",
    },
  };

  if (fieldMap[selected]) {
    return [conditionField, fieldMap[selected]];
  }

  return [];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "project_id",
        label: "Select Project",
        type: "string",
        dynamic: "get_projects.project_id.project_name",
        required: true,
        list: false,
        altersDynamicFields: false,
        helpText: "Select the project to search tasks in.",
      },
      {
        key: "task_search_name",
        label: "Select Search Property",
        type: "string",
        helpText: "Select the task field to search on.",
        choices: {
          title: "Task Title",
          status__status_name: "Status",
          tags__tag_name: "Tags",
          due_date: "Due Date",
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
    ],
    canPaginate: false,
    sample: {
      id: "7463477153879822337",
      item_id: "7463477153879822337",
      display_id: "TSK983",
      title: "Sample Task",
      item_type: 1,
      due_date: "2026-05-29",
      tags: [{ tag_id: "7463477231566721025", tag_name: "Sample Tag" }],
      is_completed: false,
      status: {
        id: "1",
        status_key: "not_started",
        status_name: "Not Started",
        color: "#E5BA03",
        icon: "fa-regular fa-circle",
      },
      project_id: "7442427864764387329",
      milestone_id: "7442427864802136065",
      is_private: false,
      is_starred: false,
      is_predefined: false,
      users: [
        {
          user_id: "7424309824034181121",
          full_name: "Sample User",
          email: "user@example.com",
          role: "Organization Admin",
          added_date: "2026-03-25T04:32:26.293000",
        },
      ],
      is_risk: false,
      is_blocked: false,
      time_track_id: null,
      creation_time: "2026-05-22T06:33:38.185000Z",
      last_update_time: "2026-05-22T06:34:34.784000Z",
      parent_id: null,
      is_timer_running: false,
      total_elapsed_time: 0,
      position: 0,
      is_recurring: false,
      parent_recurring_id: null,
      recurrence_pattern: null,
      recurrence_status: "active",
      is_recurring_child: false,
      form_id: null,
      form_structure: null,
      form_responses: null,
      meeting_summary_id: null,
      calendar_id: null,
      external_map: null,
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "item_id", label: "Item Id" },
      { key: "display_id", label: "Display Id" },
      { key: "title", label: "Title" },
      { key: "item_type", label: "Item Type", type: "integer" },
      { key: "due_date", label: "Due Date", type: "datetime" },
      { key: "tags[]tag_id", label: "Tag Id" },
      { key: "tags[]tag_name", label: "Tag Name" },
      { key: "is_completed", label: "Is Completed", type: "boolean" },
      { key: "status__id", label: "Status Id" },
      { key: "status__status_key", label: "Status Key" },
      { key: "status__status_name", label: "Status Name" },
      { key: "status__color", label: "Status Color" },
      { key: "status__icon", label: "Status Icon" },
      { key: "project_id", label: "Project Id" },
      { key: "milestone_id", label: "Milestone Id" },
      { key: "is_private", label: "Is Private", type: "boolean" },
      { key: "is_starred", label: "Is Starred", type: "boolean" },
      { key: "is_predefined", label: "Is Predefined", type: "boolean" },
      { key: "users[]user_id", label: "User Id" },
      { key: "users[]full_name", label: "User Full Name" },
      { key: "users[]email", label: "User Email" },
      { key: "users[]role", label: "User Role" },
      { key: "users[]added_date", label: "User Added Date" },
      { key: "is_risk", label: "Is Risk", type: "boolean" },
      { key: "is_blocked", label: "Is Blocked", type: "boolean" },
      { key: "time_track_id", label: "Time Track Id" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "parent_id", label: "Parent Id" },
      { key: "is_timer_running", label: "Is Timer Running", type: "boolean" },
      {
        key: "total_elapsed_time",
        label: "Total Elapsed Time",
        type: "number",
      },
      { key: "position", label: "Position", type: "number" },
      { key: "is_recurring", label: "Is Recurring", type: "boolean" },
      { key: "parent_recurring_id", label: "Parent Recurring Id" },
      { key: "recurrence_pattern", label: "Recurrence Pattern" },
      { key: "recurrence_status", label: "Recurrence Status" },
      {
        key: "is_recurring_child",
        label: "Is Recurring Child",
        type: "boolean",
      },
      { key: "form_id", label: "Form Id" },
      { key: "form_structure", label: "Form Structure" },
      { key: "form_responses", label: "Form Responses" },
      { key: "meeting_summary_id", label: "Meeting Summary Id" },
      { key: "calendar_id", label: "Calendar Id" },
      { key: "external_map", label: "External Map" },
    ],
  },
  display: {
    description: "Finds a task in Projetly.",
    hidden: false,
    label: "Find Task",
  },
  key: "find_task",
  noun: "Task",
};
