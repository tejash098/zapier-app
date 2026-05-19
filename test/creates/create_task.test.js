const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('creates.create_task', () => {
  it('should run', async () => {
    const bundle = {
      inputData: {
        project_id: '7442427864764387329',
        milestone_id: '7442427864802136065',
        title: 'Test Task',
      },
    };

    const results = await appTester(
      App.creates['create_task'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
