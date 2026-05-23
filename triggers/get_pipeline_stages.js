const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.MARKETPLACE_URL}/templates/`,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      module: "template",
      template_type: "pipelines",
      page: bundle.meta.page + 1,
      sub_template_type: 4,
      items_per_page: 10,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.filter(
      (result) => result.org_temp_id === bundle.inputData.selected_pipeline,
    );

    const milestones = results.flatMap((item) =>
      (item.milestone || []).map((m) => ({
        id: m.milestone_id,
        milestone_id: m.milestone_id,
        name: m.name,
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
        key: "selected_pipeline",
        type: "string",
        label: "Select Specific Deal Pipeline",
        helpText: "Select Specific Deal Pipeline for Specific Stage",
        dynamic: "get_pipeline.id.template_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      id: "7424309800764182529",
      milestone_id: "7424309800764182529",
      name: "Prospecting",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "milestone_id", label: "Milestone Id" },
      { key: "name", label: "Stage Name" },
    ],
  },
  display: {
    description:
      "Triggers when users select Specific Pipeline Stage from Dropdown",
    hidden: true,
    label: "Get Deal Pipeline Stages",
  },
  key: "get_pipeline_stages",
  noun: "Pipeline",
};
