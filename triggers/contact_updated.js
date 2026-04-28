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
      id: '7454406795776233473-2026-04-27T05:51:16.294000Z',
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
      originalId: '7454406795776233473',
    },
    outputFields: [
      { key: 'id' },
      { key: 'contact_id' },
      { key: 'display_id' },
      { key: 'full_name' },
      { key: 'profile_image' },
      { key: 'profile_image_url' },
      { key: 'primary_email' },
      { key: 'company[]company_id' },
      { key: 'company[]company_name' },
      { key: 'lead_source' },
      { key: 'contact_owner__full_name' },
      { key: 'contact_owner__profile_image' },
      { key: 'lead_status' },
      { key: 'person_category__key' },
      { key: 'person_category__name' },
      { key: 'contact_stage' },
      { key: 'is_draft' },
      { key: 'job_title' },
      { key: 'department' },
      { key: 'location__country' },
      { key: 'location__state' },
      { key: 'location__city' },
      { key: 'location__address' },
      { key: 'location__zip_code' },
      { key: 'language' },
      { key: 'seniority_level' },
      { key: 'buying_role' },
      { key: 'influence_level' },
      { key: 'interest_level' },
      { key: 'preferred_communication_channel' },
      { key: 'do_not_contact' },
      { key: 'phone__primary' },
      { key: 'whatsapp_number' },
      { key: 'campaign' },
      { key: 'timezone' },
      { key: 'signoff_authority' },
      { key: 'lead_score' },
      { key: 'last_activity_date' },
      { key: 'linkedin_url' },
      { key: 'twitter_url' },
      { key: 'linked_user' },
      { key: 'creation_time' },
      { key: 'last_update_time' },
      { key: 'reports_to' },
      { key: 'originalId' },
    ],
  },
  display: {
    description: 'Triggers when a existing contact updated.',
    hidden: false,
    label: 'Existing Contact Updated',
  },
  key: 'contact_updated',
  noun: 'Contact',
};
