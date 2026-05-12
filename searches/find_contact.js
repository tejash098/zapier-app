const perform = async (z, bundle) => {
  const filter = [
    {
      id: 1,
      attribute: {
        name: '',
        key: bundle.inputData.search_property_name,
        option_type: '',
      },
      condition: {
        name: '',
        key: bundle.inputData.condition,
        types: ['input', 'select'],
      },
      option: {
        name: '',
        key: '',
        isApiCall: false,
      },
      value: bundle.inputData[bundle.inputData.search_property_name],
    },
  ];

  const options = {
    url: `${process.env.NGROK_URL}/contact/`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      limit: 50,
      filter: JSON.stringify(filter),
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results;
    return results;
  });
};

const inputFields = async (z, bundle) => {
  const fieldMap = {
    full_name: {
      key: 'full_name',
      label: 'Full Name',
      type: 'string',
      required: true,
      helpText: 'Enter the full name',
    },

    job_title: {
      key: 'job_title',
      label: 'Job Title',
      type: 'string',
      required: true,
      helpText: 'Enter the job title',
    },

    location: {
      key: 'location',
      label: 'Location',
      type: 'string',
      required: true,
      helpText: 'Enter the location',
    },
  };

  const selected = bundle.inputData.search_property_name;

  // Normal input fields
  if (fieldMap[selected]) {
    return [fieldMap[selected]];
  }

  // Dynamic dropdown/API fields
  const options = {
    url: `${process.env.NGROK_URL}/contact/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      options: 'options',
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json || {};

    let choices = [];

    // Lead Status
    if (selected === 'lead_status') {
      choices = (data.contact_lead_statuses || []).map((item) => ({
        label: item.status_name,
        value: item.status_key,
      }));

      return [
        {
          key: 'lead_status',
          label: 'Lead Status',
          type: 'string',
          choices,
          required: true,
          helpText: 'Select lead status',
          altersDynamicFields: false,
        },
      ];
    }

    // Contact Category
    if (selected === 'person_category') {
      choices = (data.contact_person_categories || []).map((item) => ({
        label: item.key,
        value: item.key,
      }));

      return [
        {
          key: 'person_category',
          label: 'Person Category',
          type: 'string',
          choices,
          required: true,
          helpText: 'Select contact person category',
          altersDynamicFields: false,
        },
      ];
    }

    return [];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'search_property_name',
        label: 'Select Search Property Name',
        type: 'string',
        helpText:
          'Select Contact Field Name on which Find Action will be performed.',
        choices: {
          full_name: 'Full Name',
          job_title: 'Job Title',
          lead_status: 'Lead Status',
          location: 'Location',
          person_category: 'Person Category',
        },
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'condition',
        label: 'Select Condition',
        type: 'string',
        choices: { is: 'Is', not: 'Not', contains: 'contains' },
        required: true,
        list: false,
        altersDynamicFields: false,
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
