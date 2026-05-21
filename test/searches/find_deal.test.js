const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('searches.find_deal', () => {
  it('should run', async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        deal_search_name: 'project_name',
        condition: 'contains',
        project_name: 'edge',
      },
      meta: { page: 0 },
      };

    const results = await appTester(
      App.searches['find_deal'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  }, 120000);
});
