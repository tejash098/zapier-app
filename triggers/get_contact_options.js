const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.MARKETPLACE_URL}/contact/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params: { options: "options" },
  };

  const response = await z.request(options);
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
