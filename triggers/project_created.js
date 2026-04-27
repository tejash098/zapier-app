module.exports = {
  operation: {
    perform: {
      headers: { Accept: 'application/json' },
      url: '{{process.env.BASE_URL}}/api/project/info/',
    },
  },
  display: {
    description: 'Triggers when a new project is created.',
    hidden: false,
    label: 'New Project Created',
  },
  key: 'project_created',
  noun: 'Project',
};
