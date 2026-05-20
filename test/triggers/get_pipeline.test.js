const zapier = require("zapier-platform-core");

const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("triggers.get_pipeline", () => {
  it("should handle pagination correctly across page 0 and page 1", async () => {
    const authData = {
      access_token: process.env.authData_access_token,
      refresh_token: process.env.authData_refresh_token,
    };

    // --- Request Page 0 ---
    const bundlePage0 = { inputData: {}, meta: { page: 0 }, authData };
    const resultsPage0 = await appTester(
      App.triggers["get_pipeline"].operation.perform,
      bundlePage0,
    );

    expect(resultsPage0).toBeDefined();
    expect(Array.isArray(resultsPage0)).toBe(true);

    // --- Request Page 1 ---
    const bundlePage1 = { inputData: {}, meta: { page: 1 }, authData };
    const resultsPage1 = await appTester(
      App.triggers["get_pipeline"].operation.perform,
      bundlePage1,
    );

    expect(resultsPage1).toBeDefined();
    expect(Array.isArray(resultsPage1)).toBe(true);
  });
});
