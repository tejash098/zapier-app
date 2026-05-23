const { makeTemplatesRequest } = require("../utils/template_requests");

const perform = async (z, bundle) => {
  const options = makeTemplatesRequest({
    templateType: "pipelines",
    subTemplateType: 4,
    page: bundle.meta.page + 1,
  });

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
      id: "7424309800764182529",
      org_temp_id: "7424309800764182529",
      template_name: "Salesforce Default",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "org_temp_id", label: "Org Temp Id" },
      { key: "template_name", label: "Template Name" },
    ],
    type: "polling",
  },
  display: {
    description: "Triggers when users select Specific Pipeline from Dropdown",
    hidden: true,
    label: "Get Deal Pipeline",
  },
  key: "get_pipeline",
  noun: "Pipeline",
};
