const zapier = require("zapier-platform-core");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("creates.create_project", () => {
  it("should run", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        project_name: "Test Project " + Date.now(),
        project_type: "onboarding",
        org_temp_id: "7424309799656886273",
        company_id: "7455508487884247041",
        contact_id: "7463139406275153921",
        owner_id: "7427648063344218113",
        is_arr: true,
        revenue: 100000,
        start_date: "2026-05-21T08:19:14.480Z",
        due_date: "2026-06-25T18:30:00.000Z",
        billing_model: "fixed_cost",
        billing_frequency: "hourly",
        account_name: "Test Account",
        region: "asia",
        vertical: "prospect",
        segment: "mid_market"
      },
    };

    const results = await appTester(
      App.creates["create_project"].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    const isSuccess =
      results.status === "success" ||
      (results.message &&
        results.message.toLowerCase().includes("already exists"));
    expect(isSuccess).toBe(true);
  }, 120000);
});
