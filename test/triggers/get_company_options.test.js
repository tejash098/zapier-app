const zapier = require("zapier-platform-core");
const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("triggers.get_company_options", () => {
  it("should fetch company options", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {},
    };

    const results = await appTester(
      App.triggers["get_company_options"].operation.perform,
      bundle,
    );

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results[0].status).toBe("success");
  });
});
