const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.create_contact', () => {
  it('should run', async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token || "test_access_token",
      },
      inputData: {
        company_owner: "7424310077881847809", //Alex Johnson
        owner_name: "Tejash Kumar Singh",
        contact_pipeline_id: "7450876547713470465",
        status_key: "new",
        first_name: "John",
        last_name: "Doe",
        primary_email: "john.doe1@example.com",
        primary_phone: "+1234567890",
        job_title: "Software Engineer",
        company_id: "7455508487884247041",
        contact_owner: "user123",
        secondary_emails: ["john.alt@example.com", "doe.work@example.com"],
        phones: ["+0987654321", "+1122334455"],
        linkedin_url: "https://linkedin.com/in/johndoe",
        department: "Engineering",
        language: "en",
        person_category: "prospect",
        buying_role: "influencer",
        communication_channel: "email",
        internal_notes: "Highly interested in the new platform features.",
      },
    };

    const results = await appTester(
      App.creates['create_contact'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    const isSuccess =
      results.status === 'success' ||
      (results.message && results.message.toLowerCase().includes('already exists'));
    expect(isSuccess).toBe(true);
  });
});
