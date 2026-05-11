const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: '',
        key: bundle.inputData.project_search_name,
        option_type: '',
      },
      condition: {
        name: '',
        key: bundle.inputData.condition,
        types: ['input', 'select'],
      },
      option: {
        name: '',
        key: '',
        isApiCall: false,
      },
      value: bundle.inputData[bundle.inputData.project_search_name],
    },
  ];

  const options = {
    url: `${process.env.NGROK_URL}/project/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      items_per_page: 50,
      page: bundle.meta.page + 1,
      project_type: 'project',
      module: 'projects',
      filter: JSON.stringify(filter),
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results;
    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    project_name: {
      key: 'project_name',
      label: 'Project Name',
      type: 'string',
      required: true,
      helpText: 'Enter the Project name',
    },
    status__status_key: {
      key: 'status__status_key',
      label: 'Status',
      type: 'string',
      required: true,
      altersDynamicFields: false,
      choices: [
        {
          label: 'Not Started',
          value: 'not_started',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'On Hold',
          value: 'on_hold',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      helpText: 'Search By Status of Project',
    },
  };

  const selected = bundle.inputData.project_search_name;

  if (fieldMap[selected]) {
    return [fieldMap[selected]];
  }

  return [];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'project_search_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Company Field Name on which Find Action will be performed.',
        choices: { project_name: 'Project Name', status__status_key: 'Status' },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'condition',
        label: 'Select Condition',
        type: 'string',
        choices: { is: 'Is', not: 'Not', contains: 'Contains' },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      inputFields,
    ],
    sample: {
      project_id: '7442427864764387329',
      project_name: 'Projetly',
      description:
        'Projetly is an AI-powered platform to streamline onboarding, manage projects, automate workflows, and collaborate with customers in digital sales rooms.',
      start_date: '2026-03-25T04:29:32.165000Z',
      due_date: '2026-06-02T00:00:00Z',
      project_manager: {},
      is_arr: false,
      revenue: '$ 0',
      show_forecasted_date: false,
      forecasted_date: null,
      project_fee: null,
      project_owner: {
        user_id: '7424683538143776769',
        full_name: 'Samaresh',
        profile_image: '',
        email: 'sales@projetly.io',
        role: 'Organization Admin',
        phone_number: '+ 1 628 6005116',
        is_customer: false,
      },
      account_name: 'Projetly Marketplace',
      region: 'Asia',
      revenue_amount: 0,
      project_type: 'internal_project',
      visible_to_all: true,
      expected_deal_value: null,
      id: '7442427864764387329',
    },
    outputFields: [
      { key: 'project_id', label: 'Project Id' },
      { key: 'project_name', label: 'Project Name' },
      { key: 'description', label: 'Description' },
      { key: 'start_date', label: 'Start Date', type: 'datetime' },
      { key: 'due_date', label: 'Due Date', type: 'datetime' },
      { key: 'is_arr', label: 'Is Arr', type: 'boolean' },
      { key: 'revenue', label: 'Revenue', type: 'string' },
      {
        key: 'show_forecasted_date',
        label: 'Show Forecasted Date',
        type: 'boolean',
      },
      { key: 'forecasted_date', label: 'Forecasted Date', type: 'datetime' },
      { key: 'project_fee', label: 'Project Fee', type: 'number' },
      { key: 'project_owner__full_name', label: 'Project Owner Full Name' },
      { key: 'project_owner__email', label: 'Project Owner Email' },
      { key: 'project_owner__role', label: 'Project Owner Role' },
      {
        key: 'project_owner__phone_number',
        label: 'Project Owner Phone Number',
      },
      {
        key: 'project_owner__is_customer',
        label: 'Project Owner Is Customer',
        type: 'boolean',
      },
      { key: 'account_name', label: 'Account Name' },
      { key: 'region', label: 'Region' },
      { key: 'revenue_amount', label: 'Revenue Amount', type: 'number' },
      { key: 'project_type', label: 'Project Type' },
      { key: 'visible_to_all', label: 'Visible To All', type: 'boolean' },
      {
        key: 'expected_deal_value',
        label: 'Expected Deal Value',
        type: 'number',
      },
      { key: 'id', label: 'Id' },
    ],
  },
  display: {
    description: 'Finds a Project by Name',
    hidden: false,
    label: 'Find Project',
  },
  key: 'find_project',
  noun: 'Project',
};
