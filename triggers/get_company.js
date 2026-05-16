const perform = async (z, bundle) => {
  let cursor = null;

  function fetchCompanies(cursorValue) {
    const options = {
      url: `${process.env.NGROK_URL}/company/`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      params: {
        limit: '2',
        sort: '-creation_time',
        next_cursor: cursorValue,
      },
      removeMissingValuesFrom: {
        params: true,
      },
    };

    return z.request(options).then((response) => {
      const data = response.json || {};

      const results = (data.results || []).map((item) => ({
        id: item.id,
        company_id: item.company_id,
        company_name: item.company_name,
      }));

      // No next page
      if (!data.has_next || !data.next_cursor) {
        return z.cursor.set('').then(() => results);
      }

      // Save next cursor
      return z.cursor.set(data.next_cursor).then(() => results);
    });
  }

  // First page
  if (bundle.meta.page === 0) {
    return fetchCompanies(null);
  }

  // Next pages
  return z.cursor.get().then((savedCursor) => {
    // Stop pagination
    if (!savedCursor) {
      return [];
    }

    cursor = savedCursor;

    return fetchCompanies(cursor);
  });
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: '7459953420019961857',
      company_id: '7459953420019961857',
      company_name: 'TEST ACCOUNT FOR CUSTOM FIELD',
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'company_id', label: 'Company Id' },
      { key: 'company_name', label: 'Company Name' },
    ],
  },
  display: {
    description: 'Triggers when users select company from Dropdown',
    hidden: true,
    label: 'Get Company',
  },
  key: 'get_company',
  noun: 'Company',
};
