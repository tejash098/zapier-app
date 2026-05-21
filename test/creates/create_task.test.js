const zapier = require("zapier-platform-core");

const App = require("../../index");
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe("creates.create_task", () => {
  it("should create a task with comprehensive data", async () => {
    const bundle = {
      authData: {
        access_token: process.env.authData_access_token,
        refresh_token: process.env.authData_refresh_token,
      },
      inputData: {
        project_id: "7442427864764387329",
        milestone_id: "7442427864802136065",
        title: "Zapier Test Task " + Date.now(),
        description: "Created via automated Zapier CLI test",
        status_key: JSON.stringify({
          id: "1",
          status_key: "not_started",
          status_name: "Not Started",
          color: "#E5BA03",
          icon: "fa-regular fa-circle"
        }),
        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        checklist_items: ["Item 1", "Item 2"],
        tags: ["AutomatedTest", "Zapier"],
        default_assigned_user: "7424309824034181121",
      },
    };

    const results = await appTester(
      App.creates["create_task"].operation.perform,
      bundle,
    );
    expect(results).toBeDefined();
    expect(results.status).toBe("success");
    expect(results.item_id).toBeDefined();
  }, 120000);
});
