module.exports = {
  operation: {
    perform: {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      removeMissingValuesFrom: { body: false, params: false },
      url: '{{process.env.BASE_URL}}/api/company/',
    },
  },
  display: {
    description: 'Finds a Company by Name',
    hidden: false,
    label: 'Find Company',
  },
  key: 'find_company',
  noun: 'Company',
};
