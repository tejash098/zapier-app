const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {},
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.filter((result) => {
      const left = String(
        result[bundle.inputData.search_property_name] ?? '',
      ).toLowerCase();
      const right = String(
        bundle.inputData.search_property_value ?? '',
      ).toLowerCase();
      return left === right;
    });
    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    company_name: {
      label: 'Company Name',
      helpText: 'Enter a Company name',
    },
    domain: {
      label: 'Domain',
      helpText: 'Enter a domain',
    },
    company_type: {
      label: 'Company Type',
      helpText: 'Enter a company type',
    },
    category: {
      label: 'Category',
      helpText: 'Enter a category',
    },
    lead_status: {
      label: 'Lead Status',
      helpText: 'Enter a lead status',
    },
    industry: {
      label: 'Industry',
      helpText: 'Enter an industry',
    },
    parent_company: {
      label: 'Parent Company',
      helpText: 'Enter a parent company',
    },
  };

  const selected = bundle.inputData.search_property_name;

  if (fieldMap[selected]) {
    return [
      {
        key: selected,
        label: fieldMap[selected].label,
        type: 'string',
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
        key: 'search_property_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Company Field Name on which Find Action will be performed.',
        choices: {
          company_name: 'Company Name',
          domain: 'Domain',
          company_type: 'Company Type',
          category: 'Category',
          lead_status: 'Lead Status',
          industry: 'Industry',
          parent_company: 'Parent Company',
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
    ],
    sample: {
      id: '7454851902669328385',
      company_id: '7454851902669328385',
      company_name: 'Projetly',
      domain: 'https://projetly.ai/',
      linkedin_url: 'https://linkedInurl.com',
      twitter_url: 'https://twitter.com',
      hq_location: 'Bengaluru, Karnataka, India',
      hq_country: 'India',
      industry: 'Sales & Marketing Automation',
      description:
        'Projetly is an AI-powered platform to streamline onboarding, manage projects, automate workflows, and collaborate with customers in digital sales rooms.',
      company_owner: { full_name: 'Projetly Admin' },
      company_type: 'prospect',
      lead_status: 'new',
      icp_fit: 'excellent',
      connection_strength: 'strong',
      connection_source: null,
      operating_regions: ['Asia', 'Europe', 'Middle East'],
      category: 'marketing',
      vendor_being_replaced: 'Projetly',
      replacement_urgency: 'low',
      partner_type: '',
      parent_company: '',
      contacts_count: 0,
      creation_time: '2026-04-28T11:19:58.047000Z',
      last_update_time: '2026-04-28T11:19:58.047000Z',
      record_source: '',
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'company_id', label: 'Company Id' },
      { key: 'company_name', label: 'Company Name' },
      { key: 'domain', label: 'Domain' },
      { key: 'linkedin_url', label: 'LinkedIn URL' },
      { key: 'twitter_url', label: 'Twitter URL' },
      { key: 'hq_location', label: 'Location' },
      { key: 'hq_country', label: 'Country' },
      { key: 'industry', label: 'Industry' },
      { key: 'description', label: 'Description' },
      { key: 'company_owner__full_name', label: 'Company Owner Full Name' },
      { key: 'company_type', label: 'Company Type' },
      { key: 'lead_status', label: 'Lead Status' },
      { key: 'icp_fit', label: 'ICP Fit' },
      { key: 'connection_strength', label: 'Connection Strength' },
      { key: 'connection_source', label: 'Connection Source' },
      { key: 'operating_regions[]0', label: 'Operating Regions' },
      { key: 'category', label: 'Category' },
      { key: 'vendor_being_replaced', label: 'Vendor Being Replaced' },
      { key: 'replacement_urgency', label: 'Replacement Urgency' },
      { key: 'partner_type', label: 'Partner Type' },
      { key: 'parent_company', label: 'Parent Company' },
      { key: 'contacts_count', label: 'Contacts Count', type: 'number' },
      { key: 'creation_time', label: 'Creation Time', type: 'datetime' },
      { key: 'last_update_time', label: 'Last Update Time', type: 'datetime' },
      { key: 'record_source', label: 'Record Source' },
    ],
  },
  display: {
    description: 'Finds a Company by Name',
    hidden: false,
    label: 'Find Company',
  },
  key: 'find_company',
  noun: 'Company',
};
