const getUsersTrigger = require("../triggers/get_users");
const getContactOptionsTrigger = require("../triggers/get_contact_options");

const resolveOwner = async (z, bundle, ownerKey) => {
  const { owner_email, owner_name } = bundle.inputData;
  const ownerId = bundle.inputData[ownerKey];

  const users = await getUsersTrigger.operation.perform(z, bundle);

  if (owner_email) {
    const found = users.find(
      (u) => u.email?.toLowerCase() === owner_email.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  if (owner_name) {
    const found = users.find(
      (u) => u.full_name?.toLowerCase() === owner_name.toLowerCase(),
    );
    if (found?.user_id) return found;
  }

  return users.find((u) => u.user_id === ownerId) || {};
};

const perform = async (z, bundle) => {
  const ownerData = await resolveOwner(z, bundle, "contact_owner");
  const resolvedOwner = ownerData.user_id || bundle.inputData.contact_owner;

  const options = {
    url: `${process.env.NGROK_URL}/contact/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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
      secondary_emails: bundle.inputData.secondary_emails || [],
      phones: bundle.inputData.phones || [],
      phone: {
        primary: bundle.inputData.primary_phone,
      },
      company_ids: bundle.inputData.company_id
        ? [bundle.inputData.company_id]
        : [],
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
      contact_owner: resolvedOwner,
      language: bundle.inputData.language,
      campaign: bundle.inputData.campaign,
      internal_notes: bundle.inputData.internal_notes,
      buying_role: bundle.inputData.buying_role,
      person_category: bundle.inputData.person_category,
      communication_channel: bundle.inputData.communication_channel,
      lead_source: "integration",
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
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    params: {
      module: "templates",
      template_type: "pipelines",
      sub_template_type: 5,
      items_per_page: 10,
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
        String(result.org_temp_id ?? "") ===
        String(bundle.inputData.contact_pipeline_id ?? ""),
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
        key: "lead_status",
        label: "Lead Status",
        type: "string",
        helpText:
          "Select the default Lead Status for this contact from the selected pipeline.",
        choices: milestones,
        required: false,
        altersDynamicFields: false,
      },
    ];
  });
};

const optionsFields = async (z, bundle) => {
  const contactOptions = await getContactOptionsTrigger.operation.perform(
    z,
    bundle,
  );
  const data = contactOptions[0] || {};

  const formatLabel = (name) => {
    if (!name) return "";
    let clean = name.replace(/^UI\.pr_(?:person_category_|other)?/, "");
    return clean
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const mapChoices = (items) => {
    const choices = {};
    (items || []).forEach((item) => {
      choices[item.key] = formatLabel(item.name || item.label);
    });
    return choices;
  };

  return [
    {
      key: "person_category",
      label: "Person Category",
      type: "string",
      helpText:
        "Select the category that best describes this contact (e.g. Decision Maker, Influencer).",
      choices: mapChoices(data.contact_person_categories),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
    {
      key: "buying_role",
      label: "Buying Role",
      type: "string",
      helpText: "Select the contact's role in the buying process.",
      choices: mapChoices(data.contact_buying_roles),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
    {
      key: "communication_channel",
      label: "Preferred Communication Channel",
      type: "string",
      helpText:
        "Select the contact's preferred channel for outreach (e.g. Email, Phone, LinkedIn).",
      choices: mapChoices(data.contact_communication_channels),
      required: false,
      list: false,
      altersDynamicFields: false,
    },
  ];
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: "company_id",
        label: "Company Id",
        type: "string",
        helpText:
          "Select the company this contact belongs to. If it's not in the dropdown, add a Find Company search step (and Create Company if it doesn't exist yet).",
        dynamic: "company_created.company_id.company_name",
        search: "find_company.company_id",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "contact_owner",
        label: "Contact Owner",
        type: "string",
        helpText:
          "Select Default Contact Owner from Dropdown. Optionally provide Owner Email or Name below to auto-map; if not found, this selection is used.",
        dynamic: "get_users.user_id.full_name",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_email",
        label: "Owner Email (optional)",
        type: "string",
        helpText:
          "Enter owner email to auto-map from Projetly user list. If not found, the selected Contact Owner will be used.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "owner_name",
        label: "Owner Name (optional)",
        type: "string",
        helpText:
          "Enter owner full name to auto-map. Used as fallback if email lookup fails.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "contact_pipeline_id",
        label: "Select Default Contact Status Pipeline",
        type: "string",
        helpText:
          "Select the Contact Status Pipeline whose statuses will be available in the Lead Status dropdown below.",
        dynamic: "get_contact_pipeline.org_temp_id.template_name",
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      inputFields,
      {
        key: "primary_email",
        label: "Work Email (Primary)",
        type: "string",
        helpText: "Enter the contact's primary work email.",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "primary_phone",
        label: "Phone (Primary)",
        type: "string",
        helpText: "Enter the Contact's Primary Phone",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "first_name",
        label: "First Name",
        type: "string",
        helpText: "Enter First Name of Contact",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "last_name",
        label: "Last Name",
        type: "string",
        helpText: "Enter Last Name of Contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "job_title",
        label: "Job Title",
        type: "string",
        helpText: "Enter the Job Title.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "linkedin_url",
        label: "LinkedIn URL",
        type: "string",
        helpText: "Enter the contact's LinkedIn profile URL.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "twitter_url",
        label: "Twitter / X URL",
        type: "string",
        helpText: "Enter the contact's Twitter / X profile URL.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "whatsapp_number",
        label: "Whatsapp Number",
        type: "string",
        helpText:
          "Enter the contact's WhatsApp number including country code (e.g. +14155551234).",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "secondary_emails",
        label: "Secondary Email",
        type: "string",
        helpText: "Enter one or more additional email addresses for this contact.",
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: "phones",
        label: "Secondary Phones",
        type: "string",
        helpText: "Enter one or more additional phone numbers for this contact.",
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: "department",
        label: "Department",
        type: "string",
        helpText:
          "Enter the department the contact belongs to (e.g. Sales, Engineering).",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "country",
        label: "Location: Country",
        type: "string",
        helpText: "Enter the country of the contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "state",
        label: "Location: State",
        type: "string",
        helpText: "Enter the state or region of the contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "city",
        label: "Location: City",
        type: "string",
        helpText: "Enter the city of the contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "address",
        label: "Location: Address",
        type: "string",
        helpText: "Enter the street address of the contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "zip_code",
        label: "Location: Zip Code",
        type: "string",
        helpText: "Enter the postal / ZIP code of the contact.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "internal_notes",
        label: "Internal Notes",
        type: "text",
        helpText:
          "Enter internal notes about this contact. Only visible to your team in Projetly.",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "language",
        label: "Preferred Language",
        type: "string",
        helpText: "Select the contact's preferred communication language.",
        choices: {
          en: "English",
          ar: "Arabic",
          fr: "French",
          es: "Spanish",
          de: "German",
          pt: "Portuguese",
          it: "Italian",
          nl: "Dutch",
          zh: "Chinese",
          ja: "Japanese",
          hi: "Hindi",
          ru: "Russian",
          ko: "Korean",
        },
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: "campaign",
        label: "Campaign",
        type: "string",
        helpText:
          "Enter the campaign this contact is associated with (e.g. Q2 Outbound, Webinar Apr-2026).",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      optionsFields,
    ],
    sample: {
      status: "success",
      entity_id: "7456281264811675649",
      message: "Saved",
    },
    outputFields: [
      { key: "status", label: "Status" },
      { key: "entity_id", label: "Contact Id" },
      { key: "message", label: "Message" },
    ],
  },
  display: {
    description: "Creates a Contact in Projetly.",
    hidden: false,
    label: "Create Contact",
  },
  key: "create_contact",
  noun: "Contact",
};
