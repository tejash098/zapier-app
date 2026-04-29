const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/project/info/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {},
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.filter(
      (result) =>
        String(result[bundle.inputData.search_property_name]) ===
        String(bundle.inputData.search_property_value),
    );

    // You can do any parsing you need for results here before returning them

    return results;
  });
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
        key: 'search_property_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Company Field Name on which Find Action will be performed.',
        choices: {
          project_name: 'Deal Name',
          account_name: 'Account / Company Name',
          region: 'Region',
          project_type: 'Project Type',
          start_date: 'Start Date',
          due_date: 'Due Date',
          project_fee: 'Project Fee',
          revenue_amount: 'Revenue Amount',
          expected_deal_value: 'Expected Deal Value',
        },
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'search_property_value',
        label: 'Enter Search Property Value',
        type: 'string',
        helpText:
          'Select Company Field Value on which Find Action will be performed.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
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
