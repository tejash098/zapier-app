const resolveUser = async (z, bundle, userKey) => {
  const { user_email, user_name } = bundle.inputData;
  const userId = bundle.inputData[userKey];

  const res = await z.request({
    url: `${process.env.NGROK_URL}/users/`,
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const users = Array.isArray(res.json) ? res.json : [];

  if (user_email) {
    const found = users.find(
      (u) => u.email?.toLowerCase() === user_email.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  if (user_name) {
    const found = users.find(
      (u) => u.full_name?.toLowerCase() === user_name.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  return users.find((u) => u.user_id === userId) || {};
};

const perform = async (z, bundle) => {
  const userData = await resolveUser(z, bundle, "default_assigned_user");
  const userDict = {
    user_id: userData.user_id || null,
    full_name: userData.full_name || null,
    profile_image: userData.image || null,
    email: userData.email || null,
    role: userData.role?.role_name || null,
    phone_number: userData.phone?.number || null,
    is_customer: false,
  };

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
        status_key: bundle.inputData.status_key,
        status_name: bundle.inputData.status_key
          .toUpperCase()
          .replace("_", " "),
      },
      item_type: 1,
      item_type_key: "task",
      users: [userDict],
      checklist_items: (bundle.inputData.checklist_items || []).map((item) => ({
        item: item,
        is_checked: false,
      })),
      tags: (bundle.inputData.tags || []).map((tag) => ({
        tag_name: tag,
        is_new: true,
      })),
    },
    removeMissingValuesFrom: { body: true },
  };

  return z.request(options).then((response) => response.json);
};

const milestoneAndStatusFields = async (z, bundle) => {
  const projectId = bundle.inputData.project_id;
  if (!projectId) return [];

  const projectRes = await z.request({
    url: `${process.env.NGROK_URL}/project/${projectId}/`,
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
      choices: statuses.map((s) => ({
        value: s.status_key,
        label: s.status_name,
      })),
    },
  ];
};

const assignUserFields = async (z, bundle) => {
  const staticFields = [
    {
      key: "user_name",
      label: "Assigned User Name",
      type: "string",
      required: false,
      list: false,
      altersDynamicFields: false,
      helpText: "Optional: name of the user to assign.",
    },
    {
      key: "user_email",
      label: "Assigned User Email",
      type: "string",
      required: false,
      list: false,
      altersDynamicFields: false,
      helpText: "Optional: email of the user to assign.",
    },
  ];

  const projectId = bundle.inputData.project_id;
  if (!projectId) return staticFields;

  const res = await z.request({
    url: `${process.env.NGROK_URL}/task/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: { users: "users", project_id: projectId },
  });

  const users = res.json || [];

  return [
    ...staticFields,
    {
      key: "default_assigned_user",
      label: "Default Assigned User",
      type: "string",
      required: true,
      list: false,
      altersDynamicFields: false,
      helpText:
        "Select the user to assign this task will be used when no user found by name or email.",
      choices: users.map((u) => ({ value: u.user_id, label: u.full_name })),
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
      {
        key: "checklist_items",
        label: "Checklist Items",
        type: "string",
        required: false,
        list: true,
        helpText: "Add items for the task checklist.",
      },
      {
        key: "tags",
        label: "Tags",
        type: "string",
        required: false,
        list: true,
        helpText: "Add tags for the task.",
      },
      assignUserFields,
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
