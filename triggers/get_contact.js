const perform = async (z, bundle) => {
  let cursor;

  const getCursorPromise =
    bundle.meta.page > 0
      ? z.cursor.get().then((value) => {
          if (!value) return [];
          cursor = value;
        })
      : Promise.resolve();

  return getCursorPromise.then((earlyResult) => {
    // If no cursor exists, stop pagination
    if (Array.isArray(earlyResult)) {
      return earlyResult;
    }

    const options = {
      url: `${process.env.NGROK_URL}/contact/`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      params: {
        limit: '20',
        sort: '-creation_time',
        next_cursor: cursor,
      },
      removeMissingValuesFrom: {
        body: false,
        params: false,
      },
    };

    return z.request(options).then((response) => {
      const data = response.json;

      const saveCursorPromise = data.has_next
        ? z.cursor.set(data.next_cursor ?? '')
        : Promise.resolve();

      return saveCursorPromise.then(() => {
        const results = (data.results || []).map((item) => {
          return {
            id: item.id,
            contact_id: item.contact_id,
            full_name: item.full_name,
          };
        });

        return results;
      });
    });
  });
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: '7459963752570425345',
      contact_id: '7459963752570425345',
      full_name: 'TEST CONTACT FOR FIELDS',
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'contact_id', label: 'Contact Id' },
      { key: 'full_name', label: 'Full Name' },
    ],
  },
  display: {
    description: 'Triggers when users select Specific Contact from Dropdown',
    hidden: true,
    label: 'Get Contact',
  },
  key: 'get_contact',
  noun: 'Contact',
};
