const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

module.exports = {
  operation: {
    perform: perform,
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
        status_name: "Not Started"
      },
      milestone: {
        name: "Week 1",
        milestone_id: "7442427864802136065"
      },
      tags: [{ tag_id: "7442428455456608257", tag_name: "P1" }],
      users: [
        {
          user_id: "7424309824034181121",
          full_name: "Tejash kumar singh",
          email: "admin@projetly.ai",
          role: "Organization Admin",
        },
      ],
      checklist_items: [
        {
          checklist_id: "7462387489638977537",
          item: "fghjhkj",
          is_checked: false,
        },
      ],
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
      { key: "status__color", label: "Status Color" },
      { key: "milestone__name", label: "Milestone Name" },
      { key: "milestone__milestone_id", label: "Milestone Id" },
      { key: "id", label: "Id" },
    ],
    inputFields: [],
    type: "hook",
    performSubscribe: {
      body: {
        target_url: "{{bundle.targetUrl}}",
        events: "[task_create]",
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
      url: "{{process.env.WEBHOOK_UNSUBSCRIBE}}",
    },
  },
  display: {
    description: "Triggers when a new task is created in Projetly.",
    hidden: false,
    label: "New Task Created",
  },
  key: "task_created",
  noun: "Task",
};
