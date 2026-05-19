const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/task/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: {
      title: bundle.inputData.title,
      description: bundle.inputData.description,
      project_id: bundle.inputData.project_id,
      milestone_id: bundle.inputData.milestone_id,
      due_date: bundle.inputData.due_date
        ? bundle.inputData.due_date.slice(0, 10)
        : undefined,
      status_key: bundle.inputData.status_key,
      status: {
        "status_key": bundle.inputData.status_key,
        "status_name": bundle.inputData.status_key.toUpperCase().replace("_", " "),
      },
      item_type: 1,
      item_type_key: "task",
    },
    removeMissingValuesFrom: { body: true },
  };

  return z.request(options).then((response) => response.json);
};

const milestoneAndStatusFields = async (z, bundle) => {
  const projectId = bundle.inputData.project_id;
  if (!projectId) return [];

  const projectRes = await z.request({
    url: `${process.env.NGROK_URL}/project/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: { project_id: projectId },
  });
  const { template_id, stages = [] } = projectRes.json;

  const taskOptRes = await z.request({
    url: `${process.env.NGROK_URL}/task/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: { options: "options", template_id },
  });
  const statuses = taskOptRes.json.status || [];

  return [
    {
      key: "milestone_id",
      label: "Select Milestone of Project",
      type: "string",
      required: true,
      altersDynamicFields: false,
      helpText: "Select the milestone for this task.",
      choices: stages.map((m) => ({ value: m.milestone_id, label: m.name })),
    },
    {
      key: "status_key",
      label: "Select Status",
      type: "string",
      required: false,
      default: "not_started",
      list: false,
      altersDynamicFields: false,
      choices: statuses.map((s) => ({ value: s.status_key, label: s.status_name })),
    },
  ];
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
        altersDynamicFields: true,
        helpText: "Select the project this task belongs to.",
      },
      milestoneAndStatusFields,
      {
        key: "title",
        label: "Task Title",
        type: "string",
        required: true,
        list: false,
        altersDynamicFields: false,
        helpText: "Enter the title of the task.",
      },
      {
        key: "description",
        label: "Task Description",
        type: "text",
        required: false,
        list: false,
        altersDynamicFields: false,
        helpText: "Enter the description of the task.",
      },
      {
        key: "due_date",
        label: "Due Date",
        type: "datetime",
        required: false,
        list: false,
        altersDynamicFields: false,
        helpText: "Enter the due date of the task.",
      },
    ],
    sample: {
      status: "success",
      item_id: "7462387195194642433",
      message: "Task created successfully",
    },
    outputFields: [
      { key: "status", label: "Status" },
      { key: "item_id", label: "Task Id" },
      { key: "message", label: "Message" },
    ],
  },
  display: {
    description: "Creates a new task in Projetly.",
    hidden: false,
    label: "Create Task",
  },
  key: "create_task",
  noun: "Task",
};
