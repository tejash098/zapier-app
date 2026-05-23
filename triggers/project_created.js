const { makeSubscribe, unsubscribe } = require("../utils/webhook_hooks");

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

const performList = async (z, bundle) => {
  const options = {
    url: `${process.env.MARKETPLACE_URL}/project/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: {
      module: "projects",
      project_type: "project",
      items_per_page: 10,
      sort: "-creation_time",
    },
    removeMissingValuesFrom: { params: true },
  };
  const response = await z.request(options);
  return response.json.results || [];
};

module.exports = {
  operation: {
    perform: perform,
    performList: performList,
    sample: {
      id: "7463469874094804993",
      status: "success",
      project_id: "7463469874094804993",
      account_id: "7455602071400615937",
      name: "Sample Deal",
      message: "Successfully added project",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "status", label: "Status" },
      { key: "project_id", label: "Project Id" },
      { key: "account_id", label: "Account Id" },
      { key: "name", label: "Name" },
      { key: "message", label: "Message" },
    ],
    inputFields: [],
    canPaginate: false,
    type: "hook",
    performSubscribe: makeSubscribe("project_created"),
    performUnsubscribe: unsubscribe,
  },
  display: {
    description: "Triggers when a new project is created in Projetly.",
    hidden: false,
    label: "New Project Created",
  },
  key: "project_created",
  noun: "Project",
};
