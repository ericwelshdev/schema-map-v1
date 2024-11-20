export const mockSourceSchema = [
  {
    id: 1,
    name: 'customer_id',
    type: 'INTEGER',
    isPrimaryKey: true,
    isModified: true,
    isSaved: true,
    isMapped: true,
    mappedByAI: true,
    isValidated: true,
    validatedByAI: true,
    confidence: 0.95,
    aiComments: [
      { id: 1, type:'ai', isNew: false, isModified: true, text: 'Primary key mapping verified - What level of confidence threshold should trigger automatic mapping suggestions? mapping show be triggered per column or all ( any mapping that was maually mapped would be ignored when the "all ai mappings" is ran ', timestamp: '2024-01-20T10:30:00Z' },
      { id: 2, type:'ai', isNew: false, isModified: false, text: 'Data type match confirmed', timestamp: '2024-01-20T11:00:00Z' },
      { id: 3, type:'ai', isNew: false, isModified: false, text: 'given we are working with whats suppose to be one to one classficiaton mapping - can we rule out a mapping candidate in the event its already been mapped at a respectful match threshold ? as an example  the Physical Column Name was matched at ', timestamp: '2024-01-19T11:00:00Z' }
    ],
    userComments: [
      { id: 101, type:'user', isNew: true, isModified: false, text: 'Confirmed with data team How should we visualize profiling results? grid intially ( perhaps dials and small gauges and dials eventualy - depending on space as all of this information will be contained within the sourceDetails Page ', timestamp: '2024-01-21T09:00:00Z' },
      { id: 102, type:'user', isNew: false, isModified: true, text: 'The process shall extract data from the Kantar data feed (in BDF) to create a Fact File with the following columns, using CMF: - depending on space as all of this information will be contained within the sourceDetails Page ', timestamp: '2024-01-21T09:00:00Z' }
    ]
  },
  {
    id: 2,
    name: 'email_address',
    type: 'VARCHAR',
    isPII: true,
    isModified: true,
    isSaved: false,
    isMapped: true,
    mappedByAI: false,
    isValidated: true,
    validatedByAI: false,
    confidence: 0.88,
    aiComments: [
      { id: 3, text: 'PII data detected', timestamp: '2024-01-20T14:20:00Z', isNew: true }
    ],
    userComments: []
  },
  {
    id: 3,
    name: 'last_login_date',
    type: 'TIMESTAMP',
    isModified: false,
    isSaved: false,
    isMapped: true,
    mappedByAI: true,
    isValidated: false,
    confidence: 0.75,
    aiComments: [],
    userComments: [
      { id: 102, text: 'Check timezone handling', timestamp: '2024-01-22T11:30:00Z', isNew: true },
      { id: 103, text: 'Format confirmed', timestamp: '2024-01-22T15:45:00Z', isNew: false }
    ]
  }
];
export const mockTargetSchema = [
  { id: 't1', name: 'id', type: 'number', description: 'Primary key' },
  { id: 't2', name: 'firstName', type: 'string', description: 'First name' },
  { id: 't3', name: 'lastName', type: 'string', description: 'Last name' },
  { id: 't4', name: 'email', type: 'string', description: 'Email address' },
  { id: 't5', name: 'birthDate', type: 'date', description: 'Birth date' }
];

export const mockMappingSuggestions = [
  {
    sourceId: 's1',
    targetId: 't1',
    confidence: 0.95,
    label: 'customer_id → id',
    reason: 'Strong identifier pattern match'
  },
  {
    sourceId: 's2',
    targetId: 't2',
    confidence: 0.88,
    label: 'first_name → firstName',
    reason: 'Name field similarity'
  }
];

export const mockValidationResults = {
  score: 85,
  categories: [
    { name: 'Data Types', status: 'success', score: 100 },
    { name: 'Pattern Match', status: 'warning', score: 75 },
    { name: 'Nullability', status: 'success', score: 90 }
  ]
};

export const mockSampleData = [
  { id: 1, customer_id: '001', first_name: 'John', last_name: 'Doe', email_address: 'john@example.com' },
  { id: 2, customer_id: '002', first_name: 'Jane', last_name: 'Smith', email_address: 'jane@example.com' }
];

export const mockColumnProfile = {
  distinctCount: 150,
  nullRate: 2.5,
  distribution: [
    { category: 'Valid', count: 980 },
    { category: 'Null', count: 20 },
    { category: 'Invalid', count: 0 }
  ]
};

export const mockTransformationRules = [
  {
    id: 'tr1',
    type: 'CASE',
    params: { type: 'UPPER' },
    description: 'Convert to uppercase'
  },
  {
    id: 'tr2',
    type: 'FORMAT',
    params: { type: 'DATE', format: 'YYYY-MM-DD' },
    description: 'Format date'
  }
];
