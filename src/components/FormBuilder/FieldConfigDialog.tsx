import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { FormField, ValidationRule } from '../../types/form';

interface FieldConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  field?: FormField;
  existingFields: FormField[];
}

const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({
  open,
  onClose,
  onSave,
  field,
  existingFields,
}) => {
  const [fieldConfig, setFieldConfig] = useState<FormField>({
    id: '',
    type: 'text',
    label: '',
    required: false,
    defaultValue: '',
    validationRules: [],
    options: [],
    isDerived: false,
    derivedConfig: {
      parentFields: [],
      formula: '',
      formulaType: 'custom',
    },
    order: 0,
  });

  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [newRule, setNewRule] = useState<Partial<ValidationRule>>({ 
    type: 'required', 
    message: '', 
    value: '' 
  });

  useEffect(() => {
    if (field && open) {
      setFieldConfig({ ...field });
    } else if (open) {
      setFieldConfig({
        id: '',
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
        validationRules: [],
        options: [],
        isDerived: false,
        derivedConfig: {
          parentFields: [],
          formula: '',
          formulaType: 'custom',
        },
        order: 0,
      });
    }
  }, [field, open]);

  const handleSave = () => {
    if (!fieldConfig.label.trim()) {
      alert('Please enter a field label');
      return;
    }

    // Validate derived field configuration
    if (fieldConfig.isDerived) {
      if (!fieldConfig.derivedConfig) {
        alert('Derived field configuration is missing');
        return;
      }

      const { formulaType, parentFields, formula } = fieldConfig.derivedConfig;

      if (!formulaType) {
        alert('Please select a formula type for the derived field');
        return;
      }

      if (!parentFields || parentFields.length === 0) {
        alert('Please select at least one parent field for the derived field');
        return;
      }

      if (formulaType === 'custom' && (!formula || formula.trim() === '')) {
        alert('Please enter a custom formula for the derived field');
        return;
      }
    }

    onSave(fieldConfig);
    onClose();
  };

  const addOption = () => {
    if (newOption.label && newOption.value) {
      setFieldConfig({
        ...fieldConfig,
        options: [...(fieldConfig.options || []), newOption],
      });
      setNewOption({ label: '', value: '' });
    }
  };

  const removeOption = (index: number) => {
    setFieldConfig({
      ...fieldConfig,
      options: fieldConfig.options?.filter((_, i) => i !== index),
    });
  };

  const addValidationRule = () => {
    if (newRule.message && newRule.type) {
      const validationRule: ValidationRule = {
        type: newRule.type as ValidationRule['type'],
        message: newRule.message,
        value: newRule.value,
      };
      setFieldConfig({
        ...fieldConfig,
        validationRules: [...fieldConfig.validationRules, validationRule],
      });
      setNewRule({ type: 'required', message: '', value: '' });
    }
  };

  const removeValidationRule = (index: number) => {
    setFieldConfig({
      ...fieldConfig,
      validationRules: fieldConfig.validationRules.filter((_, i) => i !== index),
    });
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldConfig.type);
  const availableParentFields = existingFields.filter(f => !f.isDerived && f.id !== field?.id);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      <DialogTitle sx={{ 
        p: 4, 
        bgcolor: 'primary.main', 
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 600
      }}>
        {field ? '✏️ Edit Field' : '➕ Add New Field'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '60vh',
          bgcolor: 'grey.50'
        }}>
          {/* Content Sections */}
          <Box sx={{ 
            flex: 1,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            
            {/* Basic Configuration */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                🔧 Basic Configuration
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <FormControl fullWidth>
                  <InputLabel>Field Type</InputLabel>
                  <Select
                    value={fieldConfig.type}
                    onChange={(e) => setFieldConfig({ ...fieldConfig, type: e.target.value as any })}
                  >
                    <MenuItem value="text">📝 Text Input</MenuItem>
                    <MenuItem value="number">🔢 Number</MenuItem>
                    <MenuItem value="textarea">📄 Textarea</MenuItem>
                    <MenuItem value="select">📋 Select Dropdown</MenuItem>
                    <MenuItem value="radio">🔘 Radio Buttons</MenuItem>
                    <MenuItem value="checkbox">☑️ Checkboxes</MenuItem>
                    <MenuItem value="date">📅 Date Picker</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Field Label"
                  value={fieldConfig.label}
                  onChange={(e) => setFieldConfig({ ...fieldConfig, label: e.target.value })}
                  fullWidth
                  placeholder="Enter field label"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={fieldConfig.required}
                      onChange={(e) => setFieldConfig({ ...fieldConfig, required: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Required Field"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={fieldConfig.isDerived}
                      onChange={(e) => {
                        const isDerived = e.target.checked;
                        setFieldConfig({ 
                          ...fieldConfig, 
                          isDerived,
                          derivedConfig: isDerived ? {
                            parentFields: [],
                            formula: '',
                            formulaType: 'custom',
                          } : undefined
                        });
                      }}
                      color="secondary"
                    />
                  }
                  label="Derived Field"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
              </Box>
            </Paper>

            {/* Derived Field Configuration */}
            {fieldConfig.isDerived && (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'secondary.50' }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main', fontWeight: 600 }}>
                  🧮 Derived Field Configuration
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Formula Type</InputLabel>
                    <Select
                      value={fieldConfig.derivedConfig?.formulaType || ''}
                      onChange={(e) =>
                        setFieldConfig({
                          ...fieldConfig,
                          derivedConfig: {
                            ...fieldConfig.derivedConfig!,
                            formulaType: e.target.value as any,
                          },
                        })
                      }
                    >
                      <MenuItem value="age_from_birthdate">🎂 Age from Birth Date</MenuItem>
                      <MenuItem value="sum">➕ Sum Fields</MenuItem>
                      <MenuItem value="concat">🔗 Concatenate Text</MenuItem>
                      <MenuItem value="custom">⚡ Custom Formula</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Parent Fields</InputLabel>
                    <Select
                      multiple
                      value={fieldConfig.derivedConfig?.parentFields || []}
                      onChange={(e) =>
                        setFieldConfig({
                          ...fieldConfig,
                          derivedConfig: {
                            ...fieldConfig.derivedConfig!,
                            parentFields: e.target.value as string[],
                          },
                        })
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {(selected as string[]).map((fieldId) => {
                            const parentField = availableParentFields.find(f => f.id === fieldId);
                            return (
                              <Chip 
                                key={fieldId} 
                                label={parentField?.label || fieldId}
                                size="medium"
                                color="secondary"
                                variant="filled"
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      disabled={availableParentFields.length === 0}
                    >
                      {availableParentFields.length === 0 ? (
                        <MenuItem disabled>
                          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No parent fields available. Add some regular fields first.
                          </Typography>
                        </MenuItem>
                      ) : (
                        availableParentFields.map((parentField) => (
                          <MenuItem key={parentField.id} value={parentField.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Typography sx={{ flex: 1 }}>{parentField.label}</Typography>
                              <Chip label={parentField.type} size="small" variant="outlined" />
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  
                  {availableParentFields.length === 0 && (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        ⚠️ No Parent Fields Available
                      </Typography>
                      <Typography variant="body2">
                        You need to create some regular (non-derived) fields first before you can create derived fields. 
                        Derived fields calculate their values based on other fields in the form.
                      </Typography>
                    </Alert>
                  )}

                  {fieldConfig.derivedConfig?.formulaType === 'custom' && (
                    <Box>
                      <TextField
                        label="Custom Formula"
                        value={fieldConfig.derivedConfig?.formula || ''}
                        onChange={(e) =>
                          setFieldConfig({
                            ...fieldConfig,
                            derivedConfig: {
                              ...fieldConfig.derivedConfig!,
                              formula: e.target.value,
                            },
                          })
                        }
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter your custom formula here..."
                        sx={{ mb: 3 }}
                      />
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          💡 Available Functions:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                          • <strong>sum(field1, field2, ...)</strong> - Adds numeric values<br/>
                          • <strong>multiply(field1, field2, ...)</strong> - Multiplies numeric values<br/>
                          • <strong>concat(field1, field2, ...)</strong> - Combines text values<br/>
                          • Use field IDs directly: <strong>field1 + field2 * 2</strong>
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}

            {/* Default Value */}
            {!fieldConfig.isDerived && (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'success.main', fontWeight: 600 }}>
                  💾 Default Value
                </Typography>
                
                <TextField
                  label="Default Value"
                  value={fieldConfig.defaultValue || ''}
                  onChange={(e) => setFieldConfig({ ...fieldConfig, defaultValue: e.target.value })}
                  fullWidth
                  placeholder="Enter initial value for this field"
                  helperText="This value will be pre-filled when the form loads"
                />
              </Paper>
            )}

            {/* Options Configuration */}
            {needsOptions && (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'warning.50' }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'warning.main', fontWeight: 600 }}>
                  📝 Options Configuration
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr auto' }, mb: 3, alignItems: 'end' }}>
                  <TextField
                    label="Option Label"
                    value={newOption.label}
                    onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                    placeholder="Display text"
                  />
                  <TextField
                    label="Option Value"
                    value={newOption.value}
                    onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                    placeholder="Stored value"
                  />
                  <Button 
                    variant="contained" 
                    onClick={addOption} 
                    startIcon={<AddIcon />}
                    color="warning"
                    sx={{ height: 56, px: 3 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {fieldConfig.options?.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.label} (${option.value})`}
                      onDelete={() => removeOption(index)}
                      deleteIcon={<DeleteIcon />}
                      color="warning"
                      variant="outlined"
                      sx={{ m: 0.5, fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Validation Rules */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'error.50' }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'error.main', fontWeight: 600 }}>
                ✅ Validation Rules
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'auto auto 1fr auto' }, mb: 3, alignItems: 'end' }}>
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Rule Type</InputLabel>
                  <Select
                    value={newRule.type || 'required'}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as ValidationRule['type'] })}
                  >
                    <MenuItem value="required">Required</MenuItem>
                    <MenuItem value="minLength">Min Length</MenuItem>
                    <MenuItem value="maxLength">Max Length</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="password">Password</MenuItem>
                    <MenuItem value="notEmpty">Not Empty</MenuItem>
                  </Select>
                </FormControl>
                
                {['minLength', 'maxLength'].includes(newRule.type || '') && (
                  <TextField
                    label="Value"
                    type="number"
                    value={newRule.value || ''}
                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    sx={{ width: 120 }}
                  />
                )}
                
                <TextField
                  label="Error Message"
                  value={newRule.message}
                  onChange={(e) => setNewRule({ ...newRule, message: e.target.value })}
                  placeholder="Custom error message"
                />
                
                <Button 
                  variant="contained" 
                  onClick={addValidationRule} 
                  startIcon={<AddIcon />}
                  color="error"
                  sx={{ height: 56, px: 3 }}
                >
                  Add Rule
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {fieldConfig.validationRules.map((rule, index) => (
                  <Chip
                    key={index}
                    label={`${rule.type}${rule.value ? `: ${rule.value}` : ''} - ${rule.message}`}
                    onDelete={() => removeValidationRule(index)}
                    deleteIcon={<DeleteIcon />}
                    color="error"
                    variant="outlined"
                    sx={{ m: 0.5, fontWeight: 500 }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 4, 
        bgcolor: 'grey.100', 
        borderTop: '1px solid', 
        borderColor: 'grey.300',
        gap: 2
      }}>
        <Button 
          onClick={onClose} 
          size="large"
          sx={{ px: 4 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          size="large"
          sx={{ px: 4 }}
        >
          {field ? '✏️ Update Field' : '➕ Add Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigDialog;
