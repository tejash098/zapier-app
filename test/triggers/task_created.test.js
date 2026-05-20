const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('triggers.task_created', () => {
  it('should pass webhook payload through perform', async () => {
    const bundle = {
      cleanedRequest: {
        item_id: '7462387195194642433',
        title: 'Test Task',
        id: '7462387195194642433',
      },
      inputData: {},
    };
    const results = await appTester(
      App.triggers['task_created'].operation.perform,
      bundle,
    );
    expect(results).toHaveLength(1);
    expect(results[0].item_id).toBe('7462387195194642433');
  });

  it('should subscribe and return an id', async () => {
    const bundle = {
      targetUrl: 'https://hooks.zapier.com/hooks/catch/test/abc/',
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['task_created'].operation.performSubscribe,
      bundle,
    );
    expect(result.id).toBeDefined();
  });

  it('should unsubscribe', async () => {
    const bundle = {
      subscribeData: { id: '7462779712247447553' },
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers['task_created'].operation.performUnsubscribe,
      bundle,
    );
    expect(result).toBeDefined();
  });
});
