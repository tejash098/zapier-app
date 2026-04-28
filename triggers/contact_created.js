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
      id: '7454406795776233473',
      contact_id: '7454406795776233473',
      display_id: 'PERSON_0020',
      full_name: 'Sample Name',
      profile_image: '',
      profile_image_url: null,
      primary_email: 'zuf92vXv1DXIVmUrf+5Wqoq2whOcheoVPrvw4HUYfiE=',
      company: [
        { company_id: '7454397142090649601', company_name: 'Sample Company' },
      ],
      lead_source: 'UI.pr_lead_source_projetly_ui',
      contact_owner: { full_name: 'Tejash kumar singh', profile_image: null },
      associated_deals: [],
      lead_status: 'new',
      person_category: {
        key: 'customer_contact',
        name: 'UI.pr_person_category_customer_contact',
      },
      custom_fields: {},
      contact_stage: null,
      is_draft: false,
      job_title: 'VP',
      department: null,
      location: {
        country: 'India',
        state: 'Karnataka',
        city: 'Bengaluru',
        address: null,
        zip_code: '560102',
      },
      language: 'en',
      seniority_level: 'VP',
      buying_role: null,
      influence_level: 1,
      interest_level: null,
      preferred_communication_channel: null,
      do_not_contact: null,
      phone: { primary: 'FAxqG9GJwolu6MQqD1mjzg==' },
      whatsapp_number: '',
      campaign: '',
      timezone: 'Asia/Calcutta',
      signoff_authority: null,
      lead_score: null,
      last_activity_date: null,
      linkedin_url: '',
      twitter_url: '',
      linked_user: null,
      creation_time: '2026-04-27T05:51:16.294000Z',
      last_update_time: '2026-04-27T05:51:16.294000Z',
      reports_to: null,
      associated_deal_project: { deals: [], projects: [] },
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'contact_id', label: 'Contact Id' },
      { key: 'display_id', label: 'Display Id' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'profile_image', label: 'Profile Image' },
      { key: 'profile_image_url', label: 'Profile Image Url' },
      { key: 'primary_email', label: 'Primary Email' },
      { key: 'company[]company_id', label: 'Company Id' },
      { key: 'company[]company_name', label: 'Company Name' },
      { key: 'lead_source', label: 'Lead Source' },
      { key: 'contact_owner__full_name', label: 'Contact Owner Full Name' },
      { key: 'contact_owner__profile_image' },
      { key: 'lead_status', label: 'Lead Status' },
      { key: 'person_category__key', label: 'Person Category Key' },
      { key: 'person_category__name', label: 'Person Category Name' },
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
      { key: 'buying_role', label: 'Buying Role' },
      { key: 'influence_level', label: 'Influence Level' },
      { key: 'interest_level', label: 'Interest Level' },
      { key: 'do_not_contact', label: 'Do Not Contact', type: 'boolean' },
      { key: 'phone__primary', label: 'Primary Phone' },
      { key: 'whatsapp_number', label: 'Whatsapp Number' },
      { key: 'campaign', label: 'Campaign' },
      { key: 'timezone', label: 'Timezone' },
      { key: 'signoff_authority', label: 'Signoff Authority' },
      { key: 'lead_score', label: 'Lead Score' },
      {
        key: 'last_activity_date',
        label: 'Last Activity Date',
        type: 'datetime',
      },
      { key: 'linkedin_url', label: 'LinkedIn URL' },
      { key: 'twitter_url', label: 'Twitter URl' },
      { key: 'linked_user', label: 'Linked User', type: 'string' },
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
