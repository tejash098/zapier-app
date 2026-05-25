const makeContactsRequest = (params = {}, extra = {}) => ({
  url: `${process.env.MARKETPLACE_URL}/contact/`,
  method: "GET",
  headers: {
    Accept: "application/json",
    "x-functions-key": "",
  },
  params,
  removeMissingValuesFrom: { params: true },
  ...extra,
});

module.exports = { makeContactsRequest };
