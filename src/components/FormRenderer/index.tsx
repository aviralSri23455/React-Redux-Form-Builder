import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { CheckCircle as CheckIcon, Description as FormIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { validateForm, calculateDerivedValue } from '../../utils/validation';
import FormFieldRenderer from './FormFieldRenderer';
import type { FormValues, FormErrors } from '../../types/form';

const FormRenderer: React.FC = () => {
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  useEffect(() => {
    const initialValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (!field.isDerived && field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    setFormValues(initialValues);
    setIsSubmitted(false);
  }, [currentForm.fields]);

  // Update derived fields whenever form values change
  useEffect(() => {
    const updatedValues = { ...formValues };
    let hasChanges = false;

    currentForm.fields
      .filter((field) => field.isDerived && field.derivedConfig)
      .forEach((derivedField) => {
        try {
          const newValue = calculateDerivedValue(derivedField, formValues);
          if (updatedValues[derivedField.id] !== newValue) {
            updatedValues[derivedField.id] = newValue;
            hasChanges = true;
          }
        } catch (error) {
          console.warn(`Failed to calculate derived value for field ${derivedField.id}:`, error);
          // Set to empty string if calculation fails
          if (updatedValues[derivedField.id] !== '') {
            updatedValues[derivedField.id] = '';
            hasChanges = true;
          }
        }
      });

    if (hasChanges) {
      setFormValues(updatedValues);
    }
  }, [formValues, currentForm.fields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const errors = validateForm(formValues, currentForm.fields);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
      console.log('Form submitted with values:', formValues);
      // Here you would typically send the form data to a server
    }
    
    setIsSubmitting(false);
  };

  const handleReset = () => {
    const initialValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (!field.isDerived && field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    setFormValues(initialValues);
    setFormErrors({});
    setIsSubmitted(false);
  };

  if (currentForm.fields.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 2 }}>
          <FormIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No form to preview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a form in the Form Builder first, then come back to preview it.
          </Typography>
          <Button variant="contained" href="/create">
            Create a Form
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isSubmitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Thank you!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your response has been recorded
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We appreciate you taking the time to fill out our form.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Button variant="outlined" onClick={handleReset}>
              Submit Another Response
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Your Response:
            </Typography>
            <Card sx={{ bgcolor: 'grey.50' }}>
              <CardContent>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {JSON.stringify(formValues, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Box>
    );
  }

  const completedFields = currentForm.fields.filter(field => 
    field.isDerived || (formValues[field.id] !== undefined && formValues[field.id] !== '')
  ).length;
  const progressPercentage = Math.round((completedFields / currentForm.fields.length) * 100);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Form Header */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {currentForm.name || 'Untitled Form'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please fill out all required fields to submit this form.
        </Typography>
        
        {/* Progress Indicator */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedFields} of {currentForm.fields.length} completed
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>
      
      {/* Error Alert */}
      {Object.keys(formErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Please fix the errors below before submitting the form.
        </Alert>
      )}

      {/* Form Fields */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          {[...currentForm.fields]
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <Box key={field.id} sx={{ mb: index < currentForm.fields.length - 1 ? 4 : 0 }}>
                <FormFieldRenderer
                  field={field}
                  value={formValues[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={formErrors[field.id]}
                />
              </Box>
            ))}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Clear form
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {isSubmitting && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default FormRenderer;
