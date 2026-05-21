const perform = async (z, bundle) => {
  let cursor;

  // First page is 0; only fetch a stored cursor for subsequent pages
  if (bundle.meta.page > 0) {
    cursor = await z.cursor.get();
    if (!cursor) {
      return [];
    }
  }

  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      limit: 20,
      sort: "-creation_time",
      next_cursor: cursor,
    },
    removeMissingValuesFrom: {
      params: true,
    },
  };

  const response = await z.request(options);

  // Store the cursor if it exists for pagination
  if (response.json && response.json.next_cursor) {
    await z.cursor.set(response.json.next_cursor);
  }

  const results = response.json.results || [];

  return results;
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: "7459953420019961857",
      company_id: "7459953420019961857",
      company_name: "SAMPLE COMPANY",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "company_id", label: "Company Id" },
      { key: "company_name", label: "Company Name" },
    ],
  },
  display: {
    description: "Triggers when users have to select company from Dropdown",
    hidden: true,
    label: "Get Company",
  },
  key: "get_company",
  noun: "Company",
};
