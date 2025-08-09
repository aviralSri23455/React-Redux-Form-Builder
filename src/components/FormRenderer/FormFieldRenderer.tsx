import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { FormField } from '../../types/form';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const textFieldProps = {
    fullWidth: true,
    error: !!error,
    helperText: error,
    disabled: disabled || field.isDerived,
  };

  const formControlProps = {
    fullWidth: true,
    error: !!error,
    disabled: disabled || field.isDerived,
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...textFieldProps}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <TextField
            {...textFieldProps}
            label={field.label}
            type="number"
            value={typeof value === 'number' ? value.toString() : value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...textFieldProps}
            label={field.label}
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl {...formControlProps} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...formControlProps} required={field.required}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <FormControl {...formControlProps} required={field.required}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={checkboxValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...checkboxValues, option.value]
                          : checkboxValues.filter((v) => v !== option.value);
                        onChange(newValues);
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
              slotProps={{
                textField: {
                  ...textFieldProps,
                  required: field.required,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {field.isDerived && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" color="info.main">
            Derived Field (Auto-calculated)
          </Typography>
        </Box>
      )}
      {renderField()}
    </Box>
  );
};

export default FormFieldRenderer;
