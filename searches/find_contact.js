const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/contact/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      limit: 50,
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.filter((result) => {
      const left = String(
        result[bundle.inputData.search_property_name] ?? '',
      ).toLowerCase();
      const right = String(
        bundle.inputData[bundle.inputData.search_property_name] ?? '',
      ).toLowerCase();
      return left === right;
    });
    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    full_name: {
      label: 'Full Name',
      helpText: 'Enter the full name',
    },
    primary_email: {
      label: 'Primary Email',
      helpText: 'Enter the primary email',
    },
    department: {
      label: 'Department',
      helpText: 'Enter the department',
    },
    job_title: {
      label: 'Job Title',
      helpText: 'Enter the job title',
    },
    lead_status: {
      label: 'Lead Status',
      helpText: 'Enter the lead status',
    },
    phone__primary: {
      label: 'Primary Phone',
      helpText: 'Enter the primary phone number',
    },
    linkedin_url: {
      label: 'Linkedin Url',
      helpText: 'Enter the LinkedIn profile URL',
    },
    twitter_url: {
      label: 'Twitter Url',
      helpText: 'Enter the Twitter profile URL',
    },
    reports_to: {
      label: 'Reports To',
      helpText: 'Enter the reporting person',
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
          'Select Contact Field Name on which Find Action will be performed.',
        choices: {
          full_name: 'Full Name',
          primary_email: 'Primary Email',
          department: 'Department',
          job_title: 'Job Title',
          lead_status: 'Lead Status',
          phone__primary: 'Primary Phone',
          linkedin_url: 'Linkedin Url',
          twitter_url: 'Twitter Url',
          reports_to: 'Reports To',
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
    ],
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
  },
  display: {
    description: 'Finds a Contact by Email',
    hidden: false,
    label: 'Find Contact',
  },
  key: 'find_contact',
  noun: 'Contact',
};
