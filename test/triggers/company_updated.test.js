const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('triggers.company_updated', () => {
  it('should pass webhook payload through perform', async () => {
    const bundle = {
      cleanedRequest: {
        company_id: '7454851902669328385',
        company_name: 'Test Company',
        id: '7454851902669328385',
      },
      inputData: {},
    };
    const results = await appTester(
      App.triggers['company_updated'].operation.perform,
      bundle,
    );
    expect(results).toHaveLength(1);
    expect(results[0].company_id).toBe('7454851902669328385');
  });

  it('should subscribe and return an id', async () => {
    const bundle = {
      targetUrl: 'https://hooks.zapier.com/hooks/catch/test/abc/',
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['company_updated'].operation.performSubscribe,
      bundle,
    );
    expect(result.id).toBeDefined();
  });

  it('should unsubscribe', async () => {
    const subscribeBundle = {
      targetUrl: 'https://hooks.zapier.com/hooks/catch/test/abc/',
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const subscribeResult = await appTester(
      App.triggers['company_updated'].operation.performSubscribe,
      subscribeBundle,
    );
    expect(subscribeResult.id).toBeDefined();

    const bundle = {
      subscribeData: { id: subscribeResult.id },
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['company_updated'].operation.performUnsubscribe,
      bundle,
    );
    expect(result).toBeDefined();
  });
});
