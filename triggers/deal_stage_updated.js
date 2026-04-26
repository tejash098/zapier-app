module.exports = {
  operation: {
    perform: {
      params: {
        deal_pipeline: '{{bundle.inputData.deal_pipeline}}',
        deal_stage: '{{bundle.inputData.deal_stage}}',
      },
    },
    inputFields: [
      {
        key: 'deal_pipeline',
        type: 'string',
        label: 'Deal Pipeline',
        helpText: 'Select the Deal Pipeline',
        default: 'Choose Value...',
        choices: ['Sales Pipeline', 'Pipeline DSR'],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'deal_stage',
        type: 'string',
        label: 'Deal Stage',
        helpText: 'Select Deal Stage for Trigger',
        default: 'Choose Value...',
        choices: ['Discovery & Alignment', 'Proposal Sent'],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Triggers when a deal updated to specified stage.',
    hidden: false,
    label: 'Deal Stage Updated',
  },
  key: 'deal_stage_updated',
  noun: 'Deal',
};
