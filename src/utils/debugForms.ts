// Test utility to add sample forms for debugging
const sampleForms = [
  {
    id: 'form_sample_1',
    name: 'Contact Information',
    createdAt: new Date().toISOString(),
    fields: [
      {
        id: 'field_1',
        type: 'text',
        label: 'Full Name',
        required: true,
        defaultValue: '',
        validationRules: [
          { type: 'required', message: 'Name is required' }
        ],
        options: [],
        isDerived: false,
        order: 0
      },
      {
        id: 'field_2',
        type: 'email',
        label: 'Email Address',
        required: true,
        defaultValue: '',
        validationRules: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email' }
        ],
        options: [],
        isDerived: false,
        order: 1
      }
    ]
  },
  {
    id: 'form_sample_2',
    name: 'Survey Form',
    createdAt: new Date().toISOString(),
    fields: [
      {
        id: 'field_3',
        type: 'select',
        label: 'How did you hear about us?',
        required: false,
        defaultValue: '',
        validationRules: [],
        options: [
          { label: 'Google', value: 'google' },
          { label: 'Facebook', value: 'facebook' },
          { label: 'Friend', value: 'friend' }
        ],
        isDerived: false,
        order: 0
      }
    ]
  }
];

// Function to add sample forms to localStorage
export const addSampleForms = () => {
  localStorage.setItem('formBuilder_savedForms', JSON.stringify(sampleForms));
  console.log('Sample forms added to localStorage');
};

// Function to clear all forms
export const clearAllForms = () => {
  localStorage.removeItem('formBuilder_savedForms');
  console.log('All forms cleared from localStorage');
};

// Function to log current localStorage content
export const logLocalStorage = () => {
  const stored = localStorage.getItem('formBuilder_savedForms');
  console.log('Current localStorage content:', stored);
  if (stored) {
    console.log('Parsed forms:', JSON.parse(stored));
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugForms = {
    addSampleForms,
    clearAllForms,
    logLocalStorage
  };
}
