const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('searches.find_task', () => {
  it('should run', async () => {
    const bundle = {
      inputData: {
        task_search_name: 'title',
        condition: 'contains',
        title: 'test',
      },
    };

    const results = await appTester(
      App.searches['find_task'].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
