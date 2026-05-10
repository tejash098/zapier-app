const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/contact/`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {},
    body: {
      primary_email: bundle.inputData.primary_email,
      primary_phone: bundle.inputData.primary_phone,
      first_name: bundle.inputData.first_name,
      last_name: bundle.inputData.last_name,
      full_name: `${bundle.inputData.first_name} ${bundle.inputData.last_name}`,
      job_title: bundle.inputData.job_title,
      linkedin_url: bundle.inputData.linkedin_url,
      twitter_url: bundle.inputData.twitter_url,
      whatsapp_number: bundle.inputData.whatsapp_number,
      secondary_emails: [bundle.inputData.secondary_emails],
      phones: [bundle.inputData.phones],
      phone: {
        primary: bundle.inputData.primary_phone,
      },
      company_ids: [bundle.inputData.company_id],
      location: {
        phones: bundle.inputData.phones,
        country: bundle.inputData.country,
        state: bundle.inputData.state,
        city: bundle.inputData.city,
        address: bundle.inputData.address,
        zip_code: bundle.inputData.zip_code,
      },
      department: bundle.inputData.department,
      lead_status: bundle.inputData.lead_status,
      lead_status_pipeline_id: bundle.inputData.lead_status_pipeline_id,
      contact_owner: bundle.inputData.contact_owner,
      language: bundle.inputData.language,
      campaign: bundle.inputData.campaign,
      internal_notes: bundle.inputData.internal_notes,
      buying_role: bundle.inputData.buying_role,
      person_category: bundle.inputData.person_category,
      lead_source: 'integration',
      is_draft: false,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const inputFields = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/templates/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      module: 'templates',
      template_type: 'pipelines',
      sub_template_type: 5,
      items_per_page: 20,
      page: bundle.meta.page + 1,
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json || {};

    const results = (data.results || []).filter(
      (result) =>
        String(result.org_temp_id ?? '') ===
        String(bundle.inputData.contact_pipeline_id ?? ''),
    );

    const milestones = results.flatMap((item) =>
      (item.milestone || []).map((m) => ({
        value: m.status?.status_key,
        sample: m.name,
        label: m.name,
      })),
    );

    return [
      {
        key: 'lead_status',
        label: 'Lead Status',
        type: 'string',
        choices: milestones,
        required: false,
        altersDynamicFields: false,
      },
    ];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'company_id',
        label: 'Company Id',
        type: 'string',
        helpText:
          'Select the Company to specify which company the new contact should be associated with in Projetly. If cant find add search step to search with different field or create if doesnt Exist',
        dynamic: 'company_created.company_id.company_name',
        search: 'find_company.company_id',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'contact_owner',
        label: 'Contact Owner',
        type: 'string',
        helpText: 'Select Default Contact Owner from Dropdown.',
        dynamic: 'get_users.user_id.full_name',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'contact_pipeline_id',
        label: 'Select Default Contact Status Pipeline',
        type: 'string',
        dynamic: 'get_contact_pipeline.org_temp_id.template_name',
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
      {
        key: 'primary_email',
        label: 'Work Email (Primary)',
        type: 'string',
        helpText: "Enter the Contatct's Primary Work Email",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'primary_phone',
        label: 'Phone (Primary)',
        type: 'string',
        helpText: "Enter the Contact's Primary Phone",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'first_name',
        label: 'First Name',
        type: 'string',
        helpText: 'Enter First Name of Contact',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'last_name',
        label: 'Last Name',
        type: 'string',
        helpText: 'Enter Last Name of Contact.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'job_title',
        label: 'Job Title',
        type: 'string',
        helpText: 'Enter the Job Title.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'linkedin_url',
        label: 'LinkedIn URL',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'twitter_url',
        label: 'Twitter / X URL',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'whatsapp_number',
        label: 'Whatsapp Number',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'secondary_emails',
        label: 'Secondary Email',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'phones',
        label: 'Secondary Phones',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'department',
        label: 'Department',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'country',
        label: 'Location: Country',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'state',
        label: 'Location: State',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'city',
        label: 'Location: City',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'address',
        label: 'Location: Address',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'zip_code',
        label: 'Location: Zip Code',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'language',
        label: 'Preferred Language',
        type: 'string',
        choices: {
          en: 'English',
          ar: 'Arabic',
          fr: 'French',
          es: 'Spanish',
          de: 'German',
          pt: 'Portuguese',
          it: 'Italian',
          nl: 'Dutch',
          zh: 'Chinese',
          ja: 'Japanese',
          hi: 'Hindi',
          ru: 'Russian',
          ko: 'Korean',
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'person_category',
        label: 'Person Category',
        type: 'string',
        choices: {
          prospect: 'Prospect',
          customer_contact: 'Customer Contact',
          partner_contact: 'Partner Contact',
          other: 'Other',
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'campaign',
        label: 'Campaign',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'internal_notes',
        label: 'Internal Notes',
        type: 'text',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'buying_role',
        label: 'Buying Role',
        type: 'string',
        choices: {
          decision_maker: 'Decision Maker',
          champion: 'Champion',
          influencer: 'Influencer',
          user: 'User',
          blocker: 'Blocker',
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      status: 'success',
      entity_id: '7456281264811675649',
      message: 'Saved',
    },
    outputFields: [
      { key: 'status', label: 'Status' },
      { key: 'entity_id', label: 'Contact Id' },
      { key: 'message', label: 'Message' },
    ],
  },
  display: {
    description: 'Creates a Contact in Projetly.',
    hidden: false,
    label: 'Create Contact',
  },
  key: 'create_contact',
  noun: 'Contact',
};
