export const mockSourceSchema = [
  { id: 's1', name: 'customer_id', type: 'number', description: 'Unique customer identifier' },
  { id: 's2', name: 'first_name', type: 'string', description: 'Customer first name' },
  { id: 's3', name: 'last_name', type: 'string', description: 'Customer last name' },
  { id: 's4', name: 'email_address', type: 'string', description: 'Customer email' },
  { id: 's5', name: 'dob', type: 'date', description: 'Date of birth' }
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
