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
    url: `${process.env.NGROK_URL}/task/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: {
      items_per_page: 50,
      page: bundle.meta.page + 1,
      project_id: bundle.inputData.project_id,
      filter: JSON.stringify(filter),
    },
    removeMissingValuesFrom: { body: false, params: false },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    return data.results || [];
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
    canPaginate: true,
    sample: {
      item_id: "7462387195194642433",
      display_id: "TSK603",
      title: "Sample Task",
      description: "Description for sample task",
      item_type: 1,
      due_date: "2026-05-06",
      is_completed: false,
      is_private: false,
      is_starred: false,
      is_predefined: false,
      project_id: "7442427864764387329",
      project_name: "Marketplace Integration",
      milestone_id: "7442427864802136065",
      account_id: "7424309865402601473",
      status: {
        id: "1",
        status_key: "not_started",
        status_name: "Not Started",
      },
      milestone: { name: "Week 1", milestone_id: "7442427864802136065" },
      tags: [{ tag_id: "7442428455456608257", tag_name: "P1" }],
      users: [
        {
          user_id: "7424309824034181121",
          full_name: "Tejash kumar singh",
          email: "admin@projetly.ai",
          role: "Organization Admin",
        },
      ],
      checklist_items: [],
      linked_tasks: [],
      sub_items: [],
      id: "7462387195194642433",
    },
    outputFields: [
      { key: "item_id", label: "Item Id" },
      { key: "display_id", label: "Display Id" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "item_type", label: "Item Type", type: "integer" },
      { key: "due_date", label: "Due Date", type: "datetime" },
      { key: "is_completed", label: "Is Completed", type: "boolean" },
      { key: "is_private", label: "Is Private", type: "boolean" },
      { key: "is_starred", label: "Is Starred", type: "boolean" },
      { key: "is_predefined", label: "Is Predefined", type: "boolean" },
      { key: "project_id", label: "Project Id" },
      { key: "project_name", label: "Project Name" },
      { key: "milestone_id", label: "Milestone Id" },
      { key: "account_id", label: "Account Id" },
      { key: "status__id", label: "Status Id" },
      { key: "status__status_key", label: "Status Key" },
      { key: "status__status_name", label: "Status Name" },
      { key: "milestone__name", label: "Milestone Name" },
      { key: "milestone__milestone_id", label: "Milestone Id" },
      { key: "id", label: "Id" },
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
