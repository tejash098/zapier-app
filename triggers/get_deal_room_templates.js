const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.MARKETPLACE_URL}/templates/`,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      module: "templates",
      template_type: "deal_stages",
      sub_template_type: 4,
      items_per_page: 10,
      page: bundle.meta.page + 1,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.map((result) => ({
      id: result.org_temp_id,
      org_temp_id: result.org_temp_id,
      template_name: result.template_name,
    }));

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    type: "polling",
    sample: {
      id: "7424309800739016705",
      org_temp_id: "7424309800739016705",
      template_name: "Sales Deal Room",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "org_temp_id", label: "Org Temp Id" },
      { key: "template_name", label: "Template Name" },
    ],
    canPaginate: true,
  },
  display: {
    description:
      "Triggers when users select Specific Deal Room Template from Dropdown.",
    hidden: true,
    label: "Get Deal Room Templates",
  },
  key: "get_deal_room_templates",
  noun: "Template",
};
