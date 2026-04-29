const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/templates/template/paginated-templates/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      template_type: 'pipelines',
      page: bundle.meta.page + 1,
      sub_template_type: 4,
      sort: 'creation_time',
      items_per_page: 10,
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.filter(
      (result) => result.org_temp_id === bundle.inputData.selected_pipeline,
    );

    // You can do any parsing you need for results here before returning them
    const milestones = results.flatMap((item) =>
      (item.milestone || []).map((m) => ({
        ...m,
        id: m.milestone_id,
      })),
    );
    return milestones;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'selected_pipeline',
        type: 'string',
        label: 'Select Specific Deal Pipeline',
        helpText: 'Select Specific Deal Pipeline for Specific Stage',
        dynamic: 'get_pipeline.id.template_name',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      name: 'Discovery & Alignment',
      milestone_id: '7424309800785154049',
      id: '7424309800785154049',
    },
    outputFields: [
      { key: 'name', label: 'Stage Name' },
      { key: 'milestone_id', label: 'Milestone Id' },
      { key: 'id', label: 'Id' },
    ],
  },
  display: {
    description:
      'Triggers when users select Specific Pipeline Stage from Dropdown',
    hidden: true,
    label: 'Get Deal Pipeline Stages',
  },
  key: 'get_pipeline_stages',
  noun: 'Pipeline',
};
