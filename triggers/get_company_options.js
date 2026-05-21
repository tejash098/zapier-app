const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: { options: "options" },
  };

  const response = await z.request(options);
  const data = response.json || {};
  return [{ ...data, id: "company_options" }];
};

module.exports = {
  key: "get_company_options",
  noun: "Company Options",
  display: {
    label: "Get Company Options",
    description: "Internal trigger to fetch company metadata options.",
    hidden: true,
  },
  operation: {
    perform: perform,
  },
};
