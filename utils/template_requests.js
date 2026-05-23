const makeTemplatesRequest = ({ templateType, subTemplateType, page }) => {
  const params = {
    module: "templates",
    template_type: templateType,
    sub_template_type: subTemplateType,
  };
  if (page !== undefined) {
    params.page = page;
    params.items_per_page = 10;
  }
  return {
    url: `${process.env.MARKETPLACE_URL}/templates/`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-functions-key": "",
    },
    params,
    removeMissingValuesFrom: { body: true, params: true },
  };
};

module.exports = { makeTemplatesRequest };
