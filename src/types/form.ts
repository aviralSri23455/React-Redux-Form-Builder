export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: string | number;
  message: string;
}

export interface DerivedField {
  parentFields: string[];
  formula: string; // JavaScript expression or predefined formula type
  formulaType: 'age_from_birthdate' | 'sum' | 'concat' | 'custom';
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
  options?: { label: string; value: string }[]; // For select, radio, checkbox
  isDerived?: boolean;
  derivedConfig?: DerivedField;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  previewMode: boolean;
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string;
}
