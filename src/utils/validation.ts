import type { ValidationRule, FormValues, FormErrors } from '../types/form';

export const validateField = (value: any, rules: ValidationRule[]): string => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'notEmpty':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
      case 'password':
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
        if (typeof value === 'string' && !passwordRegex.test(value)) {
          return rule.message;
        }
        break;
    }
  }
  return '';
};

export const validateForm = (values: FormValues, fields: any[]): FormErrors => {
  const errors: FormErrors = {};
  
  fields.forEach(field => {
    if (!field.isDerived) {
      const error = validateField(values[field.id], field.validationRules);
      if (error) {
        errors[field.id] = error;
      }
    }
  });
  
  return errors;
};

export const calculateDerivedValue = (field: any, values: FormValues): any => {
  if (!field.isDerived || !field.derivedConfig) {
    return '';
  }
  
  const { parentFields, formulaType, formula } = field.derivedConfig;
  
  switch (formulaType) {
    case 'age_from_birthdate':
      const birthDate = values[parentFields[0]];
      if (birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      }
      return '';
    case 'sum':
      return parentFields.reduce((sum: number, fieldId: string) => {
        const value = parseFloat(values[fieldId]) || 0;
        return sum + value;
      }, 0);
    case 'concat':
      return parentFields.map((fieldId: string) => values[fieldId] || '').join(' ');
    case 'custom':
      try {
        // Check if formula exists and is not empty
        if (!formula || formula.trim() === '') {
          return '';
        }
        
        // Clean up formula by removing backticks and extra spaces
        let cleanFormula = formula.trim().replace(/^`+|`+$/g, '');
        
        // Create a safe evaluation context
        const context: any = {};
        parentFields.forEach((fieldId: string) => {
          context[fieldId] = values[fieldId] || 0;
        });
        
        // Add common functions to context
        context.sum = (...args: number[]) => args.reduce((a, b) => (a || 0) + (b || 0), 0);
        context.multiply = (...args: number[]) => args.reduce((a, b) => (a || 1) * (b || 1), 1);
        context.concat = (...args: string[]) => args.join(' ');
        
        // Check if formula is valid (basic syntax check)
        if (cleanFormula.length === 0) {
          return '';
        }
        
        // Replace field IDs with context values
        let evalFormula = cleanFormula;
        parentFields.forEach((fieldId: string) => {
          const regex = new RegExp(`\\b${fieldId}\\b`, 'g');
          evalFormula = evalFormula.replace(regex, `context.${fieldId}`);
        });
        
        // Ensure formula has valid syntax before evaluation
        if (!evalFormula || evalFormula.trim() === '') {
          return '';
        }
        
        // Add context functions to global scope for eval
        const func = new Function('context', 'sum', 'multiply', 'concat', `
          try {
            return ${evalFormula};
          } catch (e) {
            console.warn('Formula evaluation error:', e.message);
            return '';
          }
        `);
        
        const result = func(context, context.sum, context.multiply, context.concat);
        
        // Convert result to number if it's a valid number (for number fields)
        if (typeof result === 'number' && !isNaN(result)) {
          return result;
        }
        
        // For string results, return as is
        return result || '';
      } catch (error) {
        console.error('Error evaluating custom formula:', error);
        return '';
      }
    default:
      return '';
  }
};
