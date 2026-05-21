const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/templates/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      module: 'templates',
      template_type: 'pipelines',
      sub_template_type: 5,
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
    canPaginate: true,
    sample: {
      id: '7450876547713470465',
      org_temp_id: '7450876547713470465',
      template_name: 'Contact Lead Status',
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'org_temp_id', label: 'Org Temp Id' },
      { key: 'template_name', label: 'Template Name' },
    ],
  },
  display: {
    description: 'Triggers when users select Specific Pipeline from Dropdown.',
    hidden: true,
    label: 'Get Contact Pipeline',
  },
  key: 'get_contact_pipeline',
  noun: 'Pipeline',
};
