const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

const performList = async (z, bundle) => {
  const options = {
    url: `${process.env.MARKETPLACE_URL}/project/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      module: "deal_plan",
      project_type: "deal",
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
    canPaginate: true,
    type: "hook",
    performSubscribe: {
      body: {
        target_url: "{{bundle.targetUrl}}",
        events: "['deal_created']",
        app_name: "zapier",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      url: "{{process.env.MARKETPLACE_URL}}/webhook/subscribe/",
    },
    performUnsubscribe: {
      body: { subscriptionId: "{{bundle.subscribeData.id}}" },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "DELETE",
      url: "{{process.env.MARKETPLACE_URL}}/webhook/unsubscribe/",
    },
  },
  display: {
    description: "Triggers when a new deal is created in Projetly.",
    hidden: false,
    label: "New Deal Created",
  },
  key: "deal_created",
  noun: "Deal",
};
