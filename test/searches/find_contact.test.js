const zapier = require("zapier-platform-core");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("searches.find_contact", () => {
  it("should run", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        search_property_name: "full_name",
        condition: "contains",
        full_name: "john",
      },
    };

    const results = await appTester(
      App.searches["find_contact"].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  }, 120000);
});
