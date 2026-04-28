const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/company/`,
    method: 'GET',
    headers: {
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
    const results = data.results
      .map((result) => ({
        ...result,
        originalId: result.id,
        id: result.id + '-' + result.last_update_time,
      }))
      .sort(
        (a, b) => new Date(b.last_update_time) - new Date(a.last_update_time),
      );

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    sample: {
      id: '7454397142090649601-2026-04-27T05:12:54.676000Z',
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
      originalId: '7454397142090649601',
    },
    outputFields: [
      { key: 'id' },
      { key: 'company_id' },
      { key: 'display_id' },
      { key: 'company_name' },
      { key: 'domain' },
      { key: 'linkedin_url' },
      { key: 'twitter_url' },
      { key: 'hq_location' },
      { key: 'hq_country' },
      { key: 'industry' },
      { key: 'employee_range' },
      { key: 'estimated_arr' },
      { key: 'description' },
      { key: 'logo_url' },
      { key: 'company_owner__user_id' },
      { key: 'company_owner__full_name' },
      { key: 'company_owner__profile_image' },
      { key: 'company_type' },
      { key: 'lead_status' },
      { key: 'icp_fit' },
      { key: 'customer_segment' },
      { key: 'connection_strength' },
      { key: 'connection_source' },
      { key: 'operating_regions[]0' },
      { key: 'operating_regions[]1' },
      { key: 'operating_regions[]2' },
      { key: 'operating_regions[]3' },
      { key: 'category' },
      { key: 'vendor_being_replaced' },
      { key: 'replacement_urgency' },
      { key: 'partner_type' },
      { key: 'parent_company' },
      { key: 'contacts_count' },
      { key: 'is_draft' },
      { key: 'creation_time' },
      { key: 'last_update_time' },
      { key: 'record_source' },
      { key: 'originalId' },
    ],
  },
  display: {
    description: 'Triggers when a existing company is updated.',
    hidden: false,
    label: 'Existing Company Updated',
  },
  key: 'company_updated',
  noun: 'Company',
};
