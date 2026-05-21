const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.create_deal', () => {
  it('should run', async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        project_name: "Test Deal " + Date.now(),
        template_id: "7424309800739016705",
        selected_pipeline: "7424309800785154049",
        company_id: "7463131829172703233",
        contact_id: "7463139406275153921",
        owner_id: "7424309824034181121",
        selected_milestone: "7424309800785154049",
        billing_model: "fixed_cost",
        expected_deal_value: 50000,
        account_name: "Test Account",
        region: "asia",
        vertical: "prospect",
        start_date: "2026-05-21T08:09:14.913Z",
        due_date: "2026-06-17T18:30:00.000Z",
      },
    };

    const results = await appTester(
      App.creates['create_deal'].operation.perform,
      bundle,
    );
    console.log('Response:', results);
    expect(results).toBeDefined();
    const isSuccess =
      results.status === 'success' ||
      (results.message && results.message.toLowerCase().includes('already exists'));
    expect(isSuccess).toBe(true);
  }, 30000);
});
