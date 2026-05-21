const zapier = require("zapier-platform-core");
const App = require("../../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("creates.create_company", () => {
  it("should run", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
      },
      inputData: {
        company_owner: "7424310077881847809", //Alex Johnson
        owner_name: "Tejash Kumar Singh",
        company_pipeline_id: "7450876547860271105",
        status_key: "new",
        company_name: "Test Company Inc (test 2)",
        domain: "testcompany.com",
        company_owner: "user123",
        company_pipeline_id: "pipeline123",
        status_key: "new_lead",
        estimated_arr: 2500000,
        employee_range: 150,
        operating_regions: ["North America", "europe"],
        customer_segment: "mid_market",
        icp_fit: "excellent",
        company_type: "prospect",
        connection_source: "partner",
      },
    };

    const results = await appTester(
      App.creates["create_company"].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    const isSuccess =
      results.status === "success" ||
      (results.message && results.message.toLowerCase().includes("already exists"));
    expect(isSuccess).toBe(true);
  });
});
