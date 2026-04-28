const authentication = require('./authentication');
const projectCreatedTrigger = require('./triggers/project_created.js');
const companyCreatedTrigger = require('./triggers/company_created.js');
const contactCreatedTrigger = require('./triggers/contact_created.js');
const companyUpdatedTrigger = require('./triggers/company_updated.js');
const contactUpdatedTrigger = require('./triggers/contact_updated.js');
const dealCreatedTrigger = require('./triggers/deal_created.js');
const projectUpdatedTrigger = require('./triggers/project_updated.js');
const dealUpdatedTrigger = require('./triggers/deal_updated.js');
const getPipelineTrigger = require('./triggers/get_pipeline.js');
const createCompanyCreate = require('./creates/create_company.js');
const createContactCreate = require('./creates/create_contact.js');
const createDealCreate = require('./creates/create_deal.js');
const createProjectCreate = require('./creates/create_project.js');
const findProjectSearch = require('./searches/find_project.js');
const findCompanySearch = require('./searches/find_company.js');
const findContactSearch = require('./searches/find_contact.js');
const findDealSearch = require('./searches/find_deal.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  requestTemplate: {
    headers: { Authorization: 'Bearer {{bundle.authData.access_token}}' },
  },
  triggers: {
    [projectCreatedTrigger.key]: projectCreatedTrigger,
    [companyCreatedTrigger.key]: companyCreatedTrigger,
    [contactCreatedTrigger.key]: contactCreatedTrigger,
    [companyUpdatedTrigger.key]: companyUpdatedTrigger,
    [contactUpdatedTrigger.key]: contactUpdatedTrigger,
    [dealCreatedTrigger.key]: dealCreatedTrigger,
    [projectUpdatedTrigger.key]: projectUpdatedTrigger,
    [dealUpdatedTrigger.key]: dealUpdatedTrigger,
    [getPipelineTrigger.key]: getPipelineTrigger,
  },
  searches: {
    [findProjectSearch.key]: findProjectSearch,
    [findCompanySearch.key]: findCompanySearch,
    [findContactSearch.key]: findContactSearch,
    [findDealSearch.key]: findDealSearch,
  },
  creates: {
    [createCompanyCreate.key]: createCompanyCreate,
    [createContactCreate.key]: createContactCreate,
    [createDealCreate.key]: createDealCreate,
    [createProjectCreate.key]: createProjectCreate,
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
    find_deal: {
      create: 'create_deal',
      display: {
        description: 'Finds a Deal by Name',
        label: 'Find or Create Deal',
      },
      key: 'find_deal',
      search: 'find_deal',
    },
    find_project: {
      create: 'create_project',
      display: {
        description: 'Finds a Project by Name',
        label: 'Find or Create Project',
      },
      key: 'find_project',
      search: 'find_project',
    },
  },
  authentication: authentication,
};
