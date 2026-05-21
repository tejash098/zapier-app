const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('creates.create_task', () => {
  it('should run', async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        project_id: '7442427864764387329',
        milestone_id: '7442427864802136065',
        title: 'Test Task ' + Date.now(),
        description: 'Testing resilient assertions',
        status_key: 'not_started',
      },
    };

    const results = await appTester(
      App.creates['create_task'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    const isSuccess =
      results.status === 'success' ||
      (results.message && results.message.toLowerCase().includes('already exists'));
    expect(isSuccess).toBe(true);
  });
});
