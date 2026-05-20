const zapier = require("zapier-platform-core");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("triggers.get_contact", () => {
  it("should handle pagination correctly across page 0 and page 1", async () => {
    const authData = {
      access_token: process.env.authData_access_token,
      refresh_token: process.env.authData_refresh_token,
    };

    // --- Request Page 0 ---
    const bundlePage0 = { inputData: {}, meta: { page: 0 }, authData };
    const resultsPage0 = await appTester(
      App.triggers["get_contact"].operation.perform,
      bundlePage0
    );
    // Verify Page 0 results
    expect(resultsPage0).toBeDefined();
    expect(Array.isArray(resultsPage0)).toBe(true);

    // --- Request Page 1 ---
    const bundlePage1 = { inputData: {}, meta: { page: 1 }, authData };
    const resultsPage1 = await appTester(
      App.triggers["get_contact"].operation.perform,
      bundlePage1,
    );

    // Verify Page 1 results
    expect(resultsPage1).toBeDefined();
    expect(Array.isArray(resultsPage1)).toBe(true);
  });
});
