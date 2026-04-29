const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/api/contact/`,
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
      id: '7454861106754883585',
      contact_id: '7454861106754883585',
      full_name: 'Projetly Sales',
      primary_email: 'sales@projetly.io',
      company: [{ company_name: 'Projetly' }],
      contact_owner: { full_name: 'Admin Projetly' },
      lead_status: 'new',
      contact_stage: null,
      job_title: 'Sales',
      department: 'Sales',
      location: {
        country: 'United States',
        state: 'Delaware',
        city: 'Wilmington',
        address: '1007 N Orange St. 4th Floor Suite #3328',
        zip_code: '19801',
      },
      language: 'en',
      seniority_level: 'Director',
      do_not_contact: true,
      phone: { primary: 'CElSoGEIPorkyhT31I6+YQ==' },
      campaign: '',
      timezone: 'Asia/Calcutta',
      last_activity_date: null,
      linkedin_url: '',
      twitter_url: '',
      linked_user: { full_name: 'Admin Projetly' },
      creation_time: '2026-04-28T11:56:32.472000Z',
      last_update_time: '2026-04-28T11:56:32.472000Z',
      reports_to: null,
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'contact_id', label: 'Contact Id' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'primary_email', label: 'Primary Email' },
      { key: 'company[]company_name', label: 'Company Name' },
      { key: 'contact_owner__full_name', label: 'Contact Owner Full Name' },
      { key: 'lead_status', label: 'Lead Status' },
      { key: 'contact_stage', label: 'Contact Stage' },
      { key: 'job_title', label: 'Job Title' },
      { key: 'department', label: 'Department' },
      { key: 'location__country', label: 'Country' },
      { key: 'location__state', label: 'State' },
      { key: 'location__city', label: 'City' },
      { key: 'location__address', label: 'Address' },
      { key: 'location__zip_code', label: 'Zip Code' },
      { key: 'language', label: 'Language' },
      { key: 'seniority_level', label: 'Seniority Level' },
      { key: 'do_not_contact', label: 'Do Not Contact', type: 'boolean' },
      { key: 'phone__primary', label: 'Primary Phone' },
      { key: 'campaign', label: 'Campaign' },
      { key: 'timezone', label: 'Timezone' },
      {
        key: 'last_activity_date',
        label: 'Last Activity Date',
        type: 'datetime',
      },
      { key: 'linkedin_url', label: 'LinkedIn URL' },
      { key: 'twitter_url', label: 'Twitter URl' },
      { key: 'linked_user__full_name', label: 'Linked User Full Name' },
      { key: 'creation_time', label: 'Creation Time', type: 'datetime' },
      { key: 'last_update_time', label: 'Last Update Time', type: 'datetime' },
      { key: 'reports_to', label: 'Reports to' },
    ],
    canPaginate: false,
  },
  display: {
    description: 'Triggers when a new contact is created.',
    hidden: false,
    label: 'New Contact Created',
  },
  key: 'contact_created',
  noun: 'Contact',
};
