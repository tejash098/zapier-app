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
    url: `${process.env.MARKETPLACE_URL}/contact/`,
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
    url: `${process.env.MARKETPLACE_URL}/templates/`,
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
        helpText:
          "Enter one or more additional email addresses for this contact.",
        required: false,
        list: true,
        altersDynamicFields: false,
      },
      {
        key: "phones",
        label: "Secondary Phones",
        type: "string",
        helpText:
          "Enter one or more additional phone numbers for this contact.",
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
      id: "7463467538928635905",
      contact_id: "7463467538928635905",
      display_id: "PERSON_0087",
      person_id: "7463467538928635905",
      full_name: "Sample Name",
      first_name: "Sample",
      last_name: "Name",
      primary_email: "jane.doe@example.com",
      secondary_emails: ["jane.alt@example.com"],
      phone: { primary: "+1-555-0100" },
      phones: [
        {
          number: "+1 555 0101",
          e164Number: "+15550101",
          internationalNumber: "+1 555 0101",
          nationalNumber: "555 0101",
          countryCode: "US",
          dialCode: "+1",
        },
      ],
      company: [
        { company_id: "7463464076690067457", company_name: "Sample Company" },
      ],
      company_ids: ["7463464076690067457"],
      contact_owner: { full_name: "Sample Admin" },
      lead_source: "projetly_ui",
      lead_status: "new",
      contact_stage: null,
      location: {
        country: "India",
        state: "Karnataka",
        city: "Bengaluru",
        address: "Sample Address",
        zip_code: "6546532",
      },
      timezone: "Asia/Calcutta",
      language: "en",
      department: "Engineering",
      person_category: { key: "other", name: "UI.pr_other" },
      whatsapp_number: {
        number: "+1 555 0101",
        e164Number: "+15550101",
        internationalNumber: "+1 555 0101",
        nationalNumber: "555 0101",
        countryCode: "US",
        dialCode: "+1",
      },
      preferred_communication_channel: "email",
      influence_level: 1,
      seniority_level: "ic",
      buying_role: "decision_maker",
      signoff_authority: "yes",
      interest_level: 1,
      do_not_contact: "no",
      internal_notes: "Sample Notes",
      reports_to: null,
      linked_user: "7424309824034181121",
      external_map: null,
      responsiveness_score: null,
      engagement_score: null,
      last_activity_date: null,
      average_response_time: null,
      lead_score: null,
      is_draft: false,
      is_system_created: false,
      created_by: "7424309824034181121",
      creation_time: "2026-05-22T05:55:25.801992Z",
      last_update_time: "2026-05-22T05:55:25.801992Z",
      lead_status_pipeline_id: "7450876547713470465",
      login_info: null,
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "contact_id", label: "Contact Id" },
      { key: "display_id", label: "Display Id" },
      { key: "person_id", label: "Person Id" },
      { key: "full_name", label: "Full Name" },
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "primary_email", label: "Primary Email" },
      { key: "secondary_emails", label: "Secondary Emails" },
      { key: "phone__primary", label: "Phone Primary" },
      { key: "phones[]number", label: "Phone Number" },
      { key: "phones[]e164Number", label: "Phone E164 Number" },
      {
        key: "phones[]internationalNumber",
        label: "Phone International Number",
      },
      { key: "phones[]nationalNumber", label: "Phone National Number" },
      { key: "phones[]countryCode", label: "Phone Country Code" },
      { key: "phones[]dialCode", label: "Phone Dial Code" },
      { key: "company[]company_id", label: "Company Id" },
      { key: "company[]company_name", label: "Company Name" },
      { key: "company_ids", label: "Company Ids" },
      { key: "contact_owner__full_name", label: "Contact Owner Full Name" },
      { key: "lead_source", label: "Lead Source" },
      { key: "lead_status", label: "Lead Status" },
      { key: "contact_stage", label: "Contact Stage" },
      { key: "location__country", label: "Country" },
      { key: "location__state", label: "State" },
      { key: "location__city", label: "City" },
      { key: "location__address", label: "Address" },
      { key: "location__zip_code", label: "Zip Code" },
      { key: "timezone", label: "Timezone" },
      { key: "language", label: "Language" },
      { key: "department", label: "Department" },
      { key: "person_category__key", label: "Person Category Key" },
      { key: "person_category__name", label: "Person Category Name" },
      { key: "whatsapp_number__number", label: "WhatsApp Number" },
      { key: "whatsapp_number__e164Number", label: "WhatsApp E164 Number" },
      {
        key: "whatsapp_number__internationalNumber",
        label: "WhatsApp International Number",
      },
      {
        key: "whatsapp_number__nationalNumber",
        label: "WhatsApp National Number",
      },
      { key: "whatsapp_number__countryCode", label: "WhatsApp Country Code" },
      { key: "whatsapp_number__dialCode", label: "WhatsApp Dial Code" },
      {
        key: "preferred_communication_channel",
        label: "Preferred Communication Channel",
      },
      { key: "influence_level", label: "Influence Level", type: "number" },
      { key: "seniority_level", label: "Seniority Level" },
      { key: "buying_role", label: "Buying Role" },
      { key: "signoff_authority", label: "Signoff Authority" },
      { key: "interest_level", label: "Interest Level", type: "number" },
      { key: "do_not_contact", label: "Do Not Contact" },
      { key: "internal_notes", label: "Internal Notes" },
      { key: "reports_to", label: "Reports To" },
      { key: "linked_user", label: "Linked User" },
      { key: "external_map", label: "External Map" },
      { key: "responsiveness_score", label: "Responsiveness Score" },
      { key: "engagement_score", label: "Engagement Score" },
      {
        key: "last_activity_date",
        label: "Last Activity Date",
        type: "datetime",
      },
      { key: "average_response_time", label: "Average Response Time" },
      { key: "lead_score", label: "Lead Score" },
      { key: "is_draft", label: "Is Draft", type: "boolean" },
      { key: "is_system_created", label: "Is System Created", type: "boolean" },
      { key: "created_by", label: "Created By" },
      { key: "creation_time", label: "Creation Time", type: "datetime" },
      { key: "last_update_time", label: "Last Update Time", type: "datetime" },
      { key: "lead_status_pipeline_id", label: "Lead Status Pipeline Id" },
      { key: "login_info", label: "Login Info" },
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
