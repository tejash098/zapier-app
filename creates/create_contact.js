module.exports = {
  operation: {
    perform: {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      url: '{{process.env.BASE_URL}}/api/contact/',
    },
  },
  display: {
    description: 'Creates a Contact in Projetly.',
    hidden: false,
    label: 'Create Contact',
  },
  key: 'create_contact',
  noun: 'Contact',
};
