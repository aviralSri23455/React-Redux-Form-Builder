import type { FormBuilderState } from '../types/form';

const DRAFT_FORM_KEY = 'formBuilder_draftForm';

export const saveDraftForm = (form: FormBuilderState['currentForm']): void => {
  try {
    const draftForm = {
      ...form,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_FORM_KEY, JSON.stringify(draftForm));
    console.log('Draft form auto-saved:', draftForm.name || 'Untitled Form');
  } catch (error) {
    console.error('Failed to save draft form:', error);
  }
};

export const loadDraftForm = (): FormBuilderState['currentForm'] | null => {
  try {
    const draftForm = localStorage.getItem(DRAFT_FORM_KEY);
    if (draftForm) {
      const parsed = JSON.parse(draftForm);
      console.log('Draft form loaded:', parsed.name || 'Untitled Form');
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load draft form:', error);
  }
  return null;
};

export const clearDraftForm = (): void => {
  try {
    localStorage.removeItem(DRAFT_FORM_KEY);
    console.log('Draft form cleared');
  } catch (error) {
    console.error('Failed to clear draft form:', error);
  }
};

export const hasDraftForm = (): boolean => {
  return localStorage.getItem(DRAFT_FORM_KEY) !== null;
};
