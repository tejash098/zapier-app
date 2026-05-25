const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('triggers.project_created', () => {
  it('should pass webhook payload through perform', async () => {
    const bundle = {
      cleanedRequest: {
        project_id: '7442427864764387329',
        project_name: 'Test Project',
        id: '7442427864764387329',
      },
      inputData: {},
    };
    const results = await appTester(
      App.triggers['project_created'].operation.perform,
      bundle,
    );
    expect(results).toHaveLength(1);
    expect(results[0].project_id).toBe('7442427864764387329');
  });

  it('should subscribe and return an id', async () => {
    const bundle = {
      targetUrl: 'https://hooks.zapier.com/hooks/catch/test/abc/',
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['project_created'].operation.performSubscribe,
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
      App.triggers['project_created'].operation.performSubscribe,
      subscribeBundle,
    );
    expect(subscribeResult.id).toBeDefined();

    const bundle = {
      subscribeData: { id: subscribeResult.id },
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['project_created'].operation.performUnsubscribe,
      bundle,
    );
    expect(result).toBeDefined();
  });
});
