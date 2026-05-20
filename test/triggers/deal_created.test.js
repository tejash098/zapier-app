const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('triggers.deal_created', () => {
  it('should pass webhook payload through perform', async () => {
    const bundle = {
      cleanedRequest: {
        project_id: '7454779361359564801',
        project_name: 'Test Deal',
        id: '7454779361359564801',
      },
      inputData: {},
    };
    const results = await appTester(
      App.triggers['deal_created'].operation.perform,
      bundle,
    );
    expect(results).toHaveLength(1);
    expect(results[0].project_id).toBe('7454779361359564801');
  });

  it('should subscribe and return an id', async () => {
    const bundle = {
      targetUrl: 'https://hooks.zapier.com/hooks/catch/test/abc/',
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['deal_created'].operation.performSubscribe,
      bundle,
    );
    expect(result.id).toBeDefined();
  });

  it('should unsubscribe', async () => {
    const bundle = {
      subscribeData: { id: '7462779711999983616' },
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['deal_created'].operation.performUnsubscribe,
      bundle,
    );
    expect(result).toBeDefined();
  });
});
