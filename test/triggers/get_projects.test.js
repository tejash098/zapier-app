const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('triggers.get_projects', () => {
  it('should run', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(
      App.triggers['get_projects'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
