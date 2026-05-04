const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/project/info/deals/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      project_type: 'deal',
      module: 'deal_plan',
      org_temp_id: bundle.inputData.selected_pipeline,
    },
    body: {},
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.deals.filter(
      (result) =>
        String(result[bundle.inputData.search_property_name]) ===
        String(bundle.inputData.search_property_value),
    );

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    project_name: {
      label: 'Deal Name',
      type: 'string',
      helpText: 'Enter the deal name',
    },
    account_name: {
      label: 'Account / Company Name',
      type: 'string',
      helpText: 'Enter the account or company name',
    },
    region: {
      label: 'Region',
      type: 'string',
      helpText: 'Enter the region',
    },
    start_date: {
      label: 'Start Date',
      type: 'datetime',
      helpText: 'Select the start date',
    },
    due_date: {
      label: 'Due Date',
      type: 'datetime',
      helpText: 'Select the due date',
    },
    revenue_amount: {
      label: 'Revenue Amount',
      type: 'number',
      helpText: 'Enter the revenue amount',
    },
    expected_deal_value: {
      label: 'Expected Deal Value',
      type: 'number',
      helpText: 'Enter the expected deal value',
    },
  };

  const selected = bundle.inputData.deal_search_name;

  if (fieldMap[selected]) {
    return [
      {
        key: selected,
        label: fieldMap[selected].label,
        type: fieldMap[selected].type,
        required: true,
        helpText: fieldMap[selected].helpText,
      },
    ];
  }

  return [];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'help_text',
        label: 'Important',
        type: 'copy',
        helpText:
          '**Important**: All search fields use the **EQ (equals)** operator for exact matches. This means the search will only return results where the property value exactly matches what you enter.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'selected_pipeline',
        label: 'Select Specific Pipeline',
        type: 'string',
        helpText: 'Select a specific pipeline to filter Deals',
        dynamic: 'get_pipeline.id.template_name',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'deal_search_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Deal Field Name on which Find Action will be performed.',
        choices: {
          project_name: 'Deal Name',
          account_name: 'Account / Company Name',
          region: 'Region',
          start_date: 'Start Date',
          due_date: 'Due Date',
          revenue_amount: 'Revenue Amount',
          expected_deal_value: 'Expected Deal Value',
        },
        required: true,
        list: false,
        altersDynamicFields: true,
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
