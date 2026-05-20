const zapier = require("zapier-platform-core");
const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("triggers.company_created", () => {
  it("should pass webhook payload through perform", async () => {
    const bundle = {
      cleanedRequest: {
        company_id: "7454851902669328385",
        company_name: "Test Company",
        id: "7454851902669328385",
      },
      inputData: {},
    };
    const results = await appTester(
      App.triggers["company_created"].operation.perform,
      bundle,
    );
    expect(results).toHaveLength(1);
    expect(results[0].company_id).toBe("7454851902669328385");
  });

  it("should subscribe and return an id", async () => {
    const bundle = {
      targetUrl: "https://hooks.zapier.com/hooks/catch/test/abc/",
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers["company_created"].operation.performSubscribe,
      bundle,
    );
    console.log("Subcribe response", result);
    expect(result.id).toBeDefined();
  });

  it("should unsubscribe", async () => {
    const bundle = {
      subscribeData: { id: "7462775981271433217" },
      authData: { access_token: process.env.authData_access_token },
      inputData: {},
    };
    const result = await appTester(
      App.triggers["company_created"].operation.performUnsubscribe,
      bundle,
    );
    expect(result).toBeDefined();
  });
});
