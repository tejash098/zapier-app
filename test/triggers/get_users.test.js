const zapier = require("zapier-platform-core");

const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("triggers.get_users", () => {
  it("should handle authentication and fetch users", async () => {
    const authData = {
      access_token: process.env.authData_access_token,
      refresh_token: process.env.authData_refresh_token,
    };

    const bundle = { inputData: {}, authData, meta: { page: 0 } };
    const results = await appTester(
      App.triggers["get_users"].operation.perform,
      bundle,
    );

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });
});
