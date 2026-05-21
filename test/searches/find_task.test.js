const zapier = require("zapier-platform-core");

const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("searches.find_task", () => {
  it("should run", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
        refresh_token: process.env.authData_refresh_token,
      },
      inputData: {
        project_id: "7442427864764387329",
        task_search_name: "title",
        condition: "contains",
        title: "zapier",
      },
    };

    const results = await appTester(
      App.searches["find_task"].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
  });
});
