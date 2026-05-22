const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

const performList = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/project/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      module: "deal_plan",
      project_type: "deal",
      items_per_page: 10,
      sort: "-last_update_time",
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
    inputFields: [],
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
    canPaginate: true,
    type: "hook",
    performSubscribe: {
      body: {
        target_url: "{{bundle.targetUrl}}",
        events: "['deal_updated']",
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
    description: "Triggers when a existing deal is updated in Projetly.",
    hidden: false,
    label: "Existing Deal Updated",
  },
  key: "deal_updated",
  noun: "Deal",
};
