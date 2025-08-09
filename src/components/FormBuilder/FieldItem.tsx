import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import type { FormField } from '../../types/form';

interface FieldItemProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const FieldItem: React.FC<FieldItemProps> = ({
  field,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const getFieldTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      text: '📝',
      number: '🔢',
      textarea: '📄',
      select: '📋',
      radio: '🔘',
      checkbox: '☑️',
      date: '📅',
    };
    return icons[type] || '📝';
  };

  return (
    <Card
      className="fb-field-card"
      sx={{
        mb: 2,
        cursor: 'move',
        position: 'relative',
        transition: 'transform .25s ease, box-shadow .25s ease, background-color .3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)'
        },
        '&.dragging': {
          opacity: 0.6,
          transform: 'scale(.985)'
        }
      }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
  onDragEnd={onDragEnd}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <DragIcon sx={{ color: 'grey.500', mt: 0.5 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                {getFieldTypeIcon(field.type)}
              </Typography>
              <Typography variant="h6" component="div">
                {field.label}
              </Typography>
              {field.required && (
                <Chip label="Required" size="small" color="error" />
              )}
              {field.isDerived && (
                <Chip label="Derived" size="small" color="info" />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Type: {field.type}
            </Typography>

            {field.defaultValue && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Default: {field.defaultValue}
              </Typography>
            )}

            {field.isDerived && field.derivedConfig && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  Formula: {field.derivedConfig.formulaType}
                </Typography>
                <Typography variant="body2" color="info.contrastText">
                  Parent Fields: {field.derivedConfig.parentFields.length}
                </Typography>
              </Box>
            )}

            {field.options && field.options.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Options:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {field.options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option.label}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {field.validationRules && field.validationRules.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Validation Rules:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {field.validationRules.map((rule, index) => (
                    <Chip
                      key={index}
                      label={`${rule.type}${rule.value ? `: ${rule.value}` : ''}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton onClick={onEdit} size="small" color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FieldItem;
