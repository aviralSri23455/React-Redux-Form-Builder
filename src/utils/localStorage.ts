import type { FormSchema } from '../types/form';

const STORAGE_KEY = 'formBuilder_savedForms';

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const deleteFormFromStorage = (formId: string): FormSchema[] => {
  try {
    const forms = loadFormsFromStorage();
    const updatedForms = forms.filter(form => form.id !== formId);
    saveFormsToStorage(updatedForms);
    return updatedForms;
  } catch (error) {
    console.error('Error deleting form from localStorage:', error);
    return loadFormsFromStorage();
  }
};
