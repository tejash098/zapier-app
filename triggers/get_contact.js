const { makeContactsRequest } = require("../utils/contact_requests");

const perform = async (z, bundle) => {
  let cursor;

  // First page is 0; only fetch a stored cursor for subsequent pages
  if (bundle.meta.page > 0) {
    cursor = await z.cursor.get();
    if (!cursor) {
      return [];
    }
  }

  const response = await z.request(
    makeContactsRequest({
      limit: "20",
      sort: "-creation_time",
      next_cursor: cursor,
    }),
  );

  // Store the cursor if it exists for pagination
  if (response.json && response.json.next_cursor) {
    await z.cursor.set(response.json.next_cursor);
  }

  const results = (response.json.results || []).map((item) => {
    return {
      id: item.id,
      contact_id: item.contact_id,
      full_name: item.full_name,
    };
  });

  return results;
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: "7459963752570425345",
      contact_id: "7459963752570425345",
      full_name: "TEST CONTACT FOR FIELDS",
    },
    outputFields: [
      { key: "id", label: "Id" },
      { key: "contact_id", label: "Contact Id" },
      { key: "full_name", label: "Full Name" },
    ],
  },
  display: {
    description: "Triggers when users select Specific Contact from Dropdown",
    hidden: true,
    label: "Get Contact",
  },
  key: "get_contact",
  noun: "Contact",
};
