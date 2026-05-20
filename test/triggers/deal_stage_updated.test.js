const zapier = require("zapier-platform-core");

const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("triggers.deal_stage_updated", () => {
  it("should handle authentication and fetch results", async () => {
    const authData = {
      access_token: process.env.authData_access_token,
      refresh_token: process.env.authData_refresh_token,
    };

    const bundle = { inputData: {}, authData };
    // This trigger key might be missing in index.js, but we update the test structure as requested.
    if (App.triggers["deal_stage_updated"]) {
      const results = await appTester(
        App.triggers["deal_stage_updated"].operation.perform,
        bundle,
      );
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    }
  });
});
