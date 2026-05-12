const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/project/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      items_per_page: 10,
      page: bundle.meta.page + 1,
      project_type: 'deal',
      sort: '-creation_time',
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.map((result) => ({
      ...result,
      id: result.project_id,
    }));
    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
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
      project_owner: {
        full_name: 'Admin Projetly',
        email: 'Admin@projetly.ai',
        role: 'Organization Admin',
        is_customer: false,
      },
      account_name: 'Projetly Marketplace',
      region: 'Asia',
      project_customers: [
        { full_name: 'Admin', email: 'Admin@projetly.ai', role: '' },
      ],
      customer_project_owner: {
        full_name: 'tejas',
        email: '',
        role: 'Customer',
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
      { key: 'revenue', label: 'Revenue', type: 'string' },
      {
        key: 'show_forecasted_date',
        label: 'Show Forecasted Date',
        type: 'boolean',
      },
      { key: 'forecasted_date', label: 'Forecasted Date', type: 'datetime' },
      { key: 'project_owner__full_name', label: 'Deal Owner Full Name' },
      { key: 'project_owner__email', label: 'Deal Owner Email' },
      { key: 'project_owner__role', label: 'Deal Owner Role' },
      {
        key: 'project_owner__is_customer',
        label: 'Deal Owner Is Customer',
        type: 'boolean',
      },
      { key: 'account_name', label: 'Account / Company Name' },
      { key: 'region', label: 'Region' },
      { key: 'customer_project_owner__full_name', label: 'Customer Full Name' },
      { key: 'customer_project_owner__email', label: 'Customer Email' },
      { key: 'customer_project_owner__role', label: 'Customer Role' },
      { key: 'revenue_amount', label: 'Revenue Amount', type: 'number' },
      { key: 'project_type', label: 'Project Type' },
      { key: 'visible_to_all', type: 'boolean', label: 'Visible To All' },
      {
        key: 'expected_deal_value',
        label: 'Expected Deal Value',
        type: 'number',
      },
      { key: 'id', label: 'Id' },
    ],
    inputFields: [],
    canPaginate: true,
  },
  display: {
    description: 'Triggers when a new deal is created in Projetly.',
    hidden: false,
    label: 'New Deal Created',
  },
  key: 'deal_created',
  noun: 'Deal',
};
