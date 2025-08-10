
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
        let parsedDate: Date | null = null;
        
        // Handle both ISO format (YYYY-MM-DD) and DD/MM/YYYY format
        if (typeof birthDate === 'string') {
          if (birthDate.includes('/')) {
            // DD/MM/YYYY format
            const parts = birthDate.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              parsedDate = new Date(year, month, day);
            }
          } else {
            // ISO format (YYYY-MM-DD)
            parsedDate = new Date(birthDate);
          }
        } else {
          parsedDate = new Date(birthDate);
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          let age = today.getFullYear() - parsedDate.getFullYear();
          const monthDiff = today.getMonth() - parsedDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
            age--;
          }
          return Math.max(0, age); // Ensure age is not negative
        }
      }
      return 0; // Return 0 instead of empty string for better UX
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
            
            // Clean up formula by removing backticks, extra spaces, and common syntax errors
            let cleanFormula = formula.trim()
              .replace(/^`+|`+$/g, '')  // Remove backticks
              .replace(/\s+/g, ' ')     // Normalize whitespace
              .trim();
            
            // Check for empty formula after cleaning
            if (cleanFormula.length === 0) {
              return '';
            }
            
            // Basic syntax validation - check for common errors
            if (cleanFormula.includes('()') || cleanFormula.endsWith(',') || cleanFormula.startsWith(',')) {
              console.warn('Invalid formula syntax:', cleanFormula);
              return '';
            }
            
            // Create a safe evaluation context with actual field values
            const context: any = {};
            parentFields.forEach((fieldId: string, index: number) => {
              const value = values[fieldId];
              // Convert to number if it's a numeric string, otherwise keep as string
              const numericValue = value !== undefined && value !== '' && !isNaN(Number(value)) ? Number(value) : (value || 0);
              
              // Add both the full field ID and generic field names (field1, field2, etc.)
              context[fieldId] = numericValue;
              context[`field${index + 1}`] = numericValue; // Support field1, field2, field3, etc.
            });
            
            // Ensure all field references are defined to prevent "fieldX is not defined" errors
            // This handles cases where formula references field2 but only field1 is configured
            for (let i = 1; i <= 10; i++) {
              if (context[`field${i}`] === undefined) {
                context[`field${i}`] = 0; // Default missing fields to 0
              }
            }
            
            // Add built-in functions to context
            context.sum = (...args: any[]) => {
              const nums = args.map(arg => Number(arg) || 0);
              return nums.reduce((a, b) => a + b, 0);
            };
            context.multiply = (...args: any[]) => {
              const nums = args.map(arg => Number(arg) || 1);
              return nums.reduce((a, b) => a * b, 1);
            };
            context.concat = (...args: any[]) => {
              return args.map(arg => String(arg || '')).join('');
            };
            context.Math = Math; // Add Math object for min, max, etc.
            
            // Validate that formula contains valid references
            const hasGenericFields = /field\d+/.test(cleanFormula);
            const hasSpecificFields = parentFields.some((fieldId: string) => cleanFormula.includes(fieldId));
            const hasFunctions = /sum\(|multiply\(|concat\(/.test(cleanFormula);
            
            if (!hasGenericFields && !hasSpecificFields && !hasFunctions) {
              console.warn('No valid field references found in formula:', cleanFormula);
              return '';
            }
            
            // Create evaluation function with proper context and error handling
            const func = new Function('context', `
              with (context) {
                try {
                  const result = ${cleanFormula};
                  return result;
                } catch (e) {
                  console.error('Formula evaluation error:', e.message);
                  console.error('Formula:', '${cleanFormula}');
                  console.error('Available context:', Object.keys(context));
                  return '';
                }
              }
            `);
            
            const result = func(context);
            
            // Convert result to appropriate type
            if (typeof result === 'number' && !isNaN(result)) {
              return result;
            }
            
            // For string results, return as is
            return String(result || '');
          } catch (error) {
            console.error('Error evaluating custom formula:', error);
            console.error('Formula was:', formula);
            return '';
          }
    default:
      return '';
  }
};
