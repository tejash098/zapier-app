const { makeContactsRequest } = require("../utils/contact_requests");

const perform = async (z, bundle) => {
  const response = await z.request(makeContactsRequest({ options: "options" }));
  const data = response.json || {};
  return [{ ...data, id: "contact_options" }];
};

module.exports = {
  key: "get_contact_options",
  noun: "Contact Options",
  display: {
    label: "Get Contact Options",
    description: "Internal trigger to fetch contact metadata options.",
    hidden: true,
  },
  operation: {
    perform: perform,
  },
};
