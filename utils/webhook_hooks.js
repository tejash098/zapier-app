const makeSubscribe = (eventName) => ({
  body: {
    target_url: "{{bundle.targetUrl}}",
    events: `['${eventName}']`,
    app_name: "zapier",
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-functions-key": "",
  },
  method: "POST",
  url: "{{process.env.MARKETPLACE_URL}}/webhook/subscribe/",
});

const unsubscribe = {
  body: { subscriptionId: "{{bundle.subscribeData.id}}" },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-functions-key": "",
  },
  method: "DELETE",
  url: "{{process.env.MARKETPLACE_URL}}/webhook/unsubscribe/",
};

module.exports = { makeSubscribe, unsubscribe };
