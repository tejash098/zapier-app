module.exports = {
  operation: {
    perform: {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      url: '{{process.env.BASE_URL}}/api/contact',
    },
  },
  display: {
    description: 'Finds a Contact by Email',
    hidden: false,
    label: 'Find Contact',
  },
  key: 'find_contact',
  noun: 'Contact',
};
