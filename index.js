const projectCreatedTrigger = require('./triggers/project_created.js');
const companyCreatedTrigger = require('./triggers/company_created.js');
const contactCreatedTrigger = require('./triggers/contact_created.js');
const createCompanyCreate = require('./creates/create_company.js');
const createContactCreate = require('./creates/create_contact.js');
const findProjectSearch = require('./searches/find_project.js');
const findCompanySearch = require('./searches/find_company.js');
const findContactSearch = require('./searches/find_contact.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  requestTemplate: {},
  triggers: {
    [projectCreatedTrigger.key]: projectCreatedTrigger,
    [companyCreatedTrigger.key]: companyCreatedTrigger,
    [contactCreatedTrigger.key]: contactCreatedTrigger,
  },
  searches: {
    [findProjectSearch.key]: findProjectSearch,
    [findCompanySearch.key]: findCompanySearch,
    [findContactSearch.key]: findContactSearch,
  },
  creates: {
    [createCompanyCreate.key]: createCompanyCreate,
    [createContactCreate.key]: createContactCreate,
  },
  searchOrCreates: {
    find_company: {
      create: 'create_company',
      display: {
        description: 'Finds a Company by Name',
        label: 'Find or Create Company',
      },
      key: 'find_company',
      search: 'find_company',
    },
    find_contact: {
      create: 'create_contact',
      display: {
        description: 'Finds a Contact by Email',
        label: 'Find or Create Contact',
      },
      key: 'find_contact',
      search: 'find_contact',
    },
  },
};
