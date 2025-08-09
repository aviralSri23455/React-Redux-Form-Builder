import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormField, FormSchema, FormBuilderState } from '../types/form';

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: [],
  previewMode: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      const { id, updates } = action.payload;
      const fieldIndex = state.currentForm.fields.findIndex(field => field.id === id);
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...updates };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
      // Reorder remaining fields
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    reorderFields: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const fields = [...state.currentForm.fields];
      const [reorderedField] = fields.splice(oldIndex, 1);
      fields.splice(newIndex, 0, reorderedField);
      
      // Update order values
      fields.forEach((field, index) => {
        field.order = index;
      });
      
      state.currentForm.fields = fields;
    },
    saveForm: (state) => {
      if (state.currentForm.name && state.currentForm.fields.length > 0) {
        const formSchema: FormSchema = {
          id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: state.currentForm.name,
          fields: state.currentForm.fields,
          createdAt: new Date().toISOString(),
        };
        state.savedForms.push(formSchema);
      }
    },
    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    loadFormForPreview: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: form.fields,
        };
      }
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        name: '',
        fields: [],
      };
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },
    loadDraftForm: (state, action: PayloadAction<{ name: string; fields: FormField[] }>) => {
      state.currentForm = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadSavedForms,
  loadFormForPreview,
  clearCurrentForm,
  setPreviewMode,
  loadDraftForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
