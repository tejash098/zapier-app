const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/company/`,
    method: 'GET',
    headers: {
      limit: 20,
      sort: '-creation_time',
    },
    params: {},
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results || [];
    // You can do any parsing you need for results here before returning them
    results.sort((a, b) => {
      const dateA = new Date(a.creation_time || 0);
      const dateB = new Date(b.creation_time || 0);
      return dateB - dateA;
    });
    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    sample: {
      id: '7454851902669328385',
      company_id: '7454851902669328385',
      company_name: 'Projetly',
      domain: 'https://projetly.ai/',
      linkedin_url: 'https://linkedInurl.com',
      twitter_url: 'https://twitter.com',
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
      parent_company: 'Projetly Marketplace',
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
    description: 'Triggers when a new company is created.',
    hidden: false,
    label: 'New Company Created',
  },
  key: 'company_created',
  noun: 'Company',
};
