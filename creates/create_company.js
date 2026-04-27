module.exports = {
  operation: {
    perform: {
      body: { company_name: "" },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      url: "{{process.env.BASE_URL}}/api/company",
    },
  },
  display: {
    description: "Creates a Company in Projetly.",
    hidden: false,
    label: "Create Company",
  },
  key: "create_company",
  noun: "Company",
};
