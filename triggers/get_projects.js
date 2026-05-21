const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/project/`,
    method: "GET",
    headers: { Accept: "application/json" },
    params: {
      module: "projects",
      project_type: "project",
      items_per_page: 10,
      page: bundle.meta.page + 1,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = (data.results || []).map((p) => ({
      id: p.project_id,
      project_id: p.project_id,
      project_name: p.project_name,
    }));
    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: "7442427864764387329",
      project_id: "7442427864764387329",
      project_name: "Marketplace Integration",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "project_id", label: "Project Id" },
      { key: "project_name", label: "Project Name" },
    ],
  },
  display: {
    description: "Fetches a list of projects for use in dropdowns.",
    hidden: true,
    label: "Get Projects",
  },
  key: "get_projects",
  noun: "Project",
};
