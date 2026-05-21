const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/templates/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      module: 'templates',
      template_type: 'project',
      sub_template_type: bundle.inputData.project_type || null,
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
    inputFields: [
      {
        key: 'project_type',
        type: 'string',
        label: 'Project Type',
        helpText: 'Enter the Project Type.',
        choices: {
          onboarding: 'Onboarding',
          service_delivery: 'Service Delivery',
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    canPaginate: true,
    sample: {
      id: '7424309799656886273',
      org_temp_id: '7424309799656886273',
      template_name: 'CRM',
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'org_temp_id', label: 'Org Temp Id' },
      { key: 'template_name', label: 'Template Name' },
    ],
  },
  display: {
    description:
      'Triggers when users select Specific Project type from Dropdown',
    hidden: true,
    label: 'Get Project Template',
  },
  key: 'get_project_template',
  noun: 'Template',
};
