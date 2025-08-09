import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Fab,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, Description as FormIcon, Restore as RestoreIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { store } from '../../store';
import {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadDraftForm,
  clearCurrentForm,
} from '../../store/formBuilderSlice';
import { saveFormsToStorage } from '../../utils/localStorage';
import { saveDraftForm, loadDraftForm as loadDraftFromStorage, clearDraftForm, hasDraftForm } from '../../utils/autoSave';
import FieldConfigDialog from './FieldConfigDialog';
import FieldItem from './FieldItem';
import type { FormField } from '../../types/form';

const FormBuilder: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [tempFormName, setTempFormName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ghostHeight, setGhostHeight] = useState<number>(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showDraftAlert, setShowDraftAlert] = useState(false);

  // Check for draft form on component mount
  useEffect(() => {
    if (hasDraftForm() && currentForm.fields.length === 0) {
      setShowDraftAlert(true);
    }
  }, [currentForm.fields.length]);

  // Auto-save current form whenever it changes
  useEffect(() => {
    if (currentForm.fields.length > 0 || currentForm.name.trim()) {
      const saveTimer = setTimeout(() => {
        saveDraftForm(currentForm);
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(saveTimer);
    }
  }, [currentForm]);

  const handleLoadDraft = () => {
    const draftForm = loadDraftFromStorage();
    if (draftForm) {
      dispatch(loadDraftForm(draftForm));
      setShowDraftAlert(false);
    }
  };

  const handleDismissDraft = () => {
    setShowDraftAlert(false);
  };

  const handleNewForm = () => {
    dispatch(clearCurrentForm());
    clearDraftForm();
    setShowDraftAlert(false);
  };

  const handleAddField = () => {
    setEditingField(undefined);
    setFieldDialogOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldDialogOpen(true);
  };

  const handleSaveField = (fieldData: Omit<FormField, 'id' | 'order'>) => {
    if (editingField) {
      dispatch(updateField({ id: editingField.id, updates: fieldData }));
    } else {
      dispatch(addField(fieldData));
    }
    setFieldDialogOpen(false);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const handleSaveForm = () => {
    if (!currentForm.name.trim()) {
      setTempFormName('');
      setSaveDialogOpen(true);
    } else {
      saveCurrentForm();
    }
  };

  const saveCurrentForm = () => {
    const formName = tempFormName || currentForm.name;
    if (formName.trim()) {
      dispatch(setFormName(formName));
      
      // Save to Redux store first (this creates the form)
      dispatch(saveForm());
      
      // Get the updated state and save to localStorage
      setTimeout(() => {
        const state = store.getState();
        const updatedForms = state.formBuilder.savedForms;
        saveFormsToStorage(updatedForms);
        console.log('Saved forms to localStorage:', updatedForms);
        
        // Clear the draft form since it's now saved
        clearDraftForm();
        
        alert('Form saved successfully!');
        setSaveDialogOpen(false);
        
        // Optionally clear the current form to start fresh
        // dispatch(clearCurrentForm());
      }, 100);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number, id: string) => {
    setDraggedIndex(index);
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    const card = (e.target as HTMLElement).closest('.fb-field-card') as HTMLElement | null;
    if (card) {
      card.classList.add('dragging');
      setGhostHeight(card.getBoundingClientRect().height);
      // improve drag image clarity
      const clone = card.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, 20, 20);
      setTimeout(() => document.body.removeChild(clone), 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      dispatch(reorderFields({ oldIndex: draggedIndex, newIndex: dropIndex }));
    }
  setDraggedIndex(null);
  setDraggedId(null);
      const container = document.querySelector('#form-builder-field-list');
      if (container) {
        container.querySelectorAll('.fb-field-card').forEach(el => el.classList.remove('fb-drop-animate'));
        requestAnimationFrame(() => {
          const movedEl = container.querySelector('.fb-field-card.dragging');
          if (movedEl) {
            movedEl.classList.remove('dragging');
      movedEl.classList.add('fb-drop-animate', 'fb-pulse');
      setTimeout(() => movedEl.classList.remove('fb-pulse'), 700);
          }
        });
      }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const card = (e.target as HTMLElement).closest('.fb-field-card');
    if (card) card.classList.remove('dragging');
    setDraggedIndex(null);
    setDraggedId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Draft Form Alert */}
      {showDraftAlert && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={handleLoadDraft}
                startIcon={<RestoreIcon />}
                variant="outlined"
                color="inherit"
              >
                Restore Draft
              </Button>
              <Button 
                size="small" 
                onClick={handleDismissDraft}
                color="inherit"
              >
                Dismiss
              </Button>
            </Box>
          }
        >
          <AlertTitle>Draft Form Found</AlertTitle>
          You have an unsaved form draft. Would you like to restore it and continue editing?
        </Alert>
      )}

      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Create a new form
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Build dynamic forms with customizable fields, validations, and derived calculations
        </Typography>
      </Paper>

      {/* Form Name */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <TextField
              label="Form Title"
              value={currentForm.name}
              onChange={(e) => dispatch(setFormName(e.target.value))}
              fullWidth
              variant="outlined"
              placeholder="Enter your form title"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.2rem',
                  fontWeight: 500,
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleNewForm}
              sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 2 }}
            >
              New Form
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Form Fields */}
      {currentForm.fields.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
          }}
        >
          <FormIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Start building your form
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Add questions, customize settings, and create a form that works for you. Click the button below to add your first question.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddIcon />} 
            onClick={handleAddField}
            sx={{ px: 4, py: 1.5 }}
          >
            Add first question
          </Button>
        </Paper>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Questions ({currentForm.fields.length})
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddField}
              >
                Add question
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveForm}
                disabled={currentForm.fields.length === 0}
              >
                Save form
              </Button>
            </Stack>
          </Box>

          <Stack spacing={2} id="form-builder-field-list">
            <AnimatePresence initial={false}>
              {[...currentForm.fields]
                .sort((a, b) => a.order - b.order)
                .map((field, index) => {
                  const isDragged = draggedId === field.id && draggedIndex !== null;
                  return (
                    <motion.div
                      key={field.id}
                      layout
                      layoutId={field.id}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32, mass: 0.65, delay: index * 0.015 }}
                      style={{ borderRadius: 12, position: 'relative' }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                    >
                      {isDragged && (
                        <div
                          className="fb-field-placeholder"
                          style={{ height: ghostHeight || 88 }}
                        />
                      )}
                      <motion.div
                        layout
                        style={isDragged ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, opacity: 0.85 } : {}}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.003 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.995 }}
                      >
                        <FieldItem
                          field={field}
                          onEdit={() => handleEditField(field)}
                          onDelete={() => handleDeleteField(field.id)}
                          onDragStart={(e) => handleDragStart(e, index, field.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </Stack>

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddField}
              sx={{ px: 4, py: 1.5 }}
            >
              Add another question
            </Button>
          </Box>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleAddField}
      >
        <AddIcon />
      </Fab>

      <FieldConfigDialog
        open={fieldDialogOpen}
        onClose={() => setFieldDialogOpen(false)}
        onSave={handleSaveField}
        field={editingField}
        existingFields={currentForm.fields}
      />

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save your form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form name"
            fullWidth
            variant="outlined"
            value={tempFormName}
            onChange={(e) => setTempFormName(e.target.value)}
            placeholder="Give your form a descriptive name"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={saveCurrentForm} 
            variant="contained" 
            disabled={!tempFormName.trim()}
          >
            Save form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder;
