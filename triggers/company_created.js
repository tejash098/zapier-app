const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/company/`,
    method: 'GET',
    headers: {},
    params: {},
    removeMissingValuesFrom: {
      body: false,
      params: false,
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
      id: '7454397142090649601',
      company_id: '7454397142090649601',
      display_id: 'COMPANY_0018',
      company_name: 'Sample Company',
      domain: 'https://sample_domain.com',
      linkedin_url: '',
      twitter_url: '',
      hq_location: 'Bengaluru, Karnataka, India',
      hq_country: 'India',
      industry: 'Technology',
      employee_range: '1-10',
      estimated_arr: 'UI.pr_revenue_1_5m',
      description: 'sample company created for display',
      logo_url: null,
      company_owner: {
        user_id: '7424309824034181121',
        full_name: 'Tejash kumar singh',
        profile_image: null,
      },
      company_type: 'prospect',
      lead_status: 'new',
      icp_fit: 'excellent',
      customer_segment: 'UI.pr_segment_smb',
      connection_strength: 'very_strong',
      connection_source: null,
      operating_regions: ['Asia'],
      category: 'crm',
      vendor_being_replaced: null,
      replacement_urgency: null,
      partner_type: null,
      parent_company: null,
      investors: [],
      partners: [],
      subsidiaries: [],
      contacts_count: 1,
      is_draft: false,
      creation_time: '2026-04-27T05:12:54.676000Z',
      last_update_time: '2026-04-27T05:12:54.676000Z',
      record_source: null,
      custom_fields: {},
      associated_deal_project: { deals: [], projects: [] },
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'company_id', label: 'Company Id' },
      { key: 'display_id', label: 'Display Id' },
      { key: 'company_name', label: 'Company Name' },
      { key: 'domain', label: 'Domain' },
      { key: 'linkedin_url', label: 'LinkedIn URL' },
      { key: 'twitter_url', label: 'Twitter URL' },
      { key: 'hq_location' },
      { key: 'hq_country' },
      { key: 'industry', label: 'Industry' },
      { key: 'employee_range', label: 'Employee Range' },
      { key: 'estimated_arr', label: 'Estimated ARR' },
      { key: 'description', label: 'Description' },
      { key: 'logo_url', label: 'Logo Url' },
      { key: 'company_owner__user_id', label: 'Company Owner User Id' },
      { key: 'company_owner__full_name', label: 'Company Owner Full Name' },
      { key: 'company_owner__profile_image' },
      { key: 'company_type', label: 'Company Type' },
      { key: 'lead_status' },
      { key: 'icp_fit', label: 'ICP Fit' },
      { key: 'customer_segment', label: 'Customer Segment' },
      { key: 'connection_strength', label: 'Connection Strength' },
      { key: 'connection_source', label: 'Connection Source' },
      { key: 'operating_regions', label: 'Operating Regions' },
      { key: 'category', label: 'Category' },
      { key: 'vendor_being_replaced', label: 'Vendor Being Replaced' },
      { key: 'replacement_urgency', label: 'Replacement Urgency' },
      { key: 'partner_type', label: 'Partner Type' },
      { key: 'parent_company', label: 'Parent Company' },
      { key: 'contacts_count', label: 'Contacts Count' },
      { key: 'is_draft', label: 'Is Draft' },
      { key: 'creation_time', label: 'Creation Time' },
      { key: 'last_update_time', label: 'Last Update Time' },
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
