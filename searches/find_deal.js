const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: '',
        key: bundle.inputData.deal_search_name,
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
      value: bundle.inputData[bundle.inputData.deal_search_name],
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
      items_per_page: 10,
      page: bundle.meta.page + 1,
      project_type: 'deal',
      module: 'deal_plan',
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

  const selected = bundle.inputData.deal_search_name;

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
        key: 'deal_search_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Deal Field Name on which Find Action will be performed.',
        choices: { project_name: 'Deal Name', status__status_key: 'Status' },
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
      project_id: '7454779361359564801',
      project_name: 'Projetly',
      description: '',
      start_date: '2026-04-27T18:30:00Z',
      due_date: '2026-04-29T18:30:00Z',
      is_arr: false,
      revenue: '$ 0',
      show_forecasted_date: false,
      forecasted_date: null,
      project_fee: null,
      project_owner: {
        full_name: 'Admin Projetly',
        email: 'Admin@projetly.ai',
        role: 'Organization Admin',
        phone_number: '',
        is_customer: false,
      },
      account_name: 'Projetly Marketplace',
      region: 'Asia',
      project_customers: [
        {
          full_name: 'Admin',
          email: 'Admin@projetly.ai',
          role: '',
          phone_number: '',
        },
      ],
      customer_project_owner: {
        full_name: 'tejas',
        email: '',
        role: 'Customer',
        phone_number: '',
      },
      revenue_amount: 0,
      project_type: 'sales_deal_room',
      visible_to_all: false,
      expected_deal_value: 464653,
      id: '7454779361359564801',
    },
    outputFields: [
      { key: 'project_id', label: 'Deal Id' },
      { key: 'project_name', label: 'Deal Name' },
      { key: 'description', label: 'Description' },
      { key: 'start_date', label: 'Start Date', type: 'datetime' },
      { key: 'due_date', label: 'Due Date', type: 'datetime' },
      { key: 'is_arr', label: 'Is Arr', type: 'boolean' },
      { key: 'revenue', label: 'Revenue' },
      {
        key: 'show_forecasted_date',
        label: 'Show Forecasted Date',
        type: 'boolean',
      },
      { key: 'forecasted_date', label: 'Forecasted Date', type: 'datetime' },
      { key: 'project_fee', label: 'Project Fee', type: 'number' },
      { key: 'project_owner__full_name', label: 'Deal Owner Full Name' },
      { key: 'project_owner__email', label: 'Deal Owner Email' },
      { key: 'project_owner__role', label: 'Deal Owner Role' },
      { key: 'project_owner__phone_number', label: 'Deal Owner Phone Number' },
      {
        key: 'project_owner__is_customer',
        label: 'Deal Owner Is Customer',
        type: 'boolean',
      },
      { key: 'account_name', label: 'Account Name' },
      { key: 'region', label: 'Region' },
      { key: 'project_customers[]full_name', label: 'Customer Full Name' },
      { key: 'project_customers[]email', label: 'Customer Email' },
      { key: 'project_customers[]role', label: 'Customer Role' },
      { key: 'project_customers[]phone_number', label: 'Customer Phone' },
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
    description: 'Finds a Deal by Name',
    hidden: false,
    label: 'Find Deal',
  },
  key: 'find_deal',
  noun: 'Deal',
};
