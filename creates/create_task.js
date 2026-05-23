const resolveUser = async (z, bundle, userKey) => {
  const { user_email, user_name, project_id } = bundle.inputData;
  const userId = bundle.inputData[userKey];

  const res = await z.request({
    url: `${process.env.MARKETPLACE_URL}/task/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: { users: "users", project_id: project_id },
  });

  const users = res.json || [];

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
    email: userData.email || null,
    role: userData.role?.role_name || null,
    phone_number: userData.phone?.number || null,
    is_customer: false,
  };

  let statusObj;
  let statusKeyStr;
  if (bundle.inputData.status_key) {
    try {
      statusObj = JSON.parse(bundle.inputData.status_key);
      statusKeyStr = statusObj.status_key;
    } catch (e) {
      statusKeyStr = bundle.inputData.status_key;
      statusObj = {
        status_key: statusKeyStr,
        status_name: statusKeyStr
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      };
    }
  }

  const options = {
    url: `${process.env.MARKETPLACE_URL}/task/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-functions-key": "",
    },
    body: {
      title: bundle.inputData.title,
      description: bundle.inputData.description,
      project_id: bundle.inputData.project_id,
      milestone_id: bundle.inputData.milestone_id,
      due_date: bundle.inputData.due_date
        ? bundle.inputData.due_date.slice(0, 10)
        : undefined,
      status: statusObj,
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

  return z.request(options).then((response) => response.json.task);
};

const milestoneAndStatusFields = async (z, bundle) => {
  const projectId = bundle.inputData.project_id;
  if (!projectId) return [];

  const projectRes = await z.request({
    url: `${process.env.MARKETPLACE_URL}/project/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: { project_id: projectId },
  });
  const { template_id, stages = [] } = projectRes.json;

  const taskOptRes = await z.request({
    url: `${process.env.MARKETPLACE_URL}/task/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: { options: "options", template_id },
  });
  // skipThrowForStatus is set globally, so a failed call returns its error body
  // here instead of throwing — and that body's `status` is a string, not the array.
  if (taskOptRes.status >= 400) {
    z.console.error(
      `[create:create_task] task options failed status=${taskOptRes.status}`,
    );
  }
  const rawStatuses = taskOptRes.json && taskOptRes.json.status;
  const statuses = Array.isArray(rawStatuses) ? rawStatuses : [];

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
        value: JSON.stringify(s),
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
    url: `${process.env.MARKETPLACE_URL}/task/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: { users: "users", project_id: projectId },
  });

  const users = Array.isArray(res.json) ? res.json : [];

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
      id: "7463477153879822337",
      item_id: "7463477153879822337",
      display_id: "TSK983",
      title: "Sample Task",
      description: null,
      item_type: 1,
      due_date: "2026-05-29",
      tags: [{ tag_id: "7463477231566721025", tag_name: "Sample Tag" }],
      checklist_items: [
        {
          checklist_id: "7463477288911245313",
          item: "Sample Check list",
          is_checked: false,
        },
      ],
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
      total_elapsed_time: 0,
      is_timer_running: false,
      time_track_id: null,
      account_id: "7424309865402601473",
      raw_description: {
        time: 1779431670291,
        blocks: [
          {
            id: "REGSI6iboP",
            type: "paragraph",
            data: { text: "Sample Descriptio" },
          },
        ],
        version: "2.31.5",
      },
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
      is_risk: false,
      is_blocked: false,
      status_options: [
        {
          id: "1",
          status_key: "not_started",
          status_name: "Not Started",
          color: "#E5BA03",
          icon: "fa-regular fa-circle",
        },
        {
          id: "2",
          status_key: "in_progress",
          status_name: "In Progress",
          color: "#50C878",
          icon: "fa-solid fa-circle-three-quarters",
        },
        {
          id: "3",
          status_key: "on_hold",
          status_name: "On Hold",
          color: "#898F98",
          icon: "fa-solid fa-circle-pause",
        },
        {
          id: "4",
          status_key: "completed",
          status_name: "Completed",
          color: "#388C54",
          icon: "fa-solid fa-circle-check",
        },
      ],
      milestone: {
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
      project_name: "Sample Project",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "item_id", label: "Item Id" },
      { key: "display_id", label: "Display Id" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "item_type", label: "Item Type", type: "integer" },
      { key: "due_date", label: "Due Date", type: "datetime" },
      { key: "tags[]tag_id", label: "Tag Id" },
      { key: "tags[]tag_name", label: "Tag Name" },
      { key: "checklist_items[]checklist_id", label: "Checklist Id" },
      { key: "checklist_items[]item", label: "Checklist Item" },
      {
        key: "checklist_items[]is_checked",
        label: "Checklist Is Checked",
        type: "boolean",
      },
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
      {
        key: "total_elapsed_time",
        label: "Total Elapsed Time",
        type: "number",
      },
      { key: "is_timer_running", label: "Is Timer Running", type: "boolean" },
      { key: "time_track_id", label: "Time Track Id" },
      { key: "account_id", label: "Account Id" },
      {
        key: "raw_description__time",
        label: "Raw Description Time",
        type: "number",
      },
      { key: "raw_description__version", label: "Raw Description Version" },
      {
        key: "raw_description__blocks[]id",
        label: "Raw Description Block Id",
      },
      {
        key: "raw_description__blocks[]type",
        label: "Raw Description Block Type",
      },
      {
        key: "raw_description__blocks[]data__text",
        label: "Raw Description Block Text",
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
      { key: "is_risk", label: "Is Risk", type: "boolean" },
      { key: "is_blocked", label: "Is Blocked", type: "boolean" },
      { key: "status_options[]id", label: "Status Option Id" },
      { key: "status_options[]status_key", label: "Status Option Key" },
      { key: "status_options[]status_name", label: "Status Option Name" },
      { key: "status_options[]color", label: "Status Option Color" },
      { key: "status_options[]icon", label: "Status Option Icon" },
      { key: "milestone__name", label: "Milestone Name" },
      { key: "milestone__color", label: "Milestone Color" },
      { key: "milestone__milestone_id", label: "Milestone Id" },
      { key: "milestone__status__status_key", label: "Milestone Status Key" },
      { key: "milestone__status__status_name", label: "Milestone Status Name" },
      { key: "milestone__insight__key", label: "Milestone Insight Key" },
      { key: "milestone__insight__name", label: "Milestone Insight Name" },
      {
        key: "milestone__is_project_due",
        label: "Milestone Is Project Due",
        type: "boolean",
      },
      { key: "project_name", label: "Project Name" },
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
