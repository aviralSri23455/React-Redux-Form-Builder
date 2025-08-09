import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Description as FormIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { loadSavedForms, loadFormForPreview } from '../store/formBuilderSlice';
import { loadFormsFromStorage, deleteFormFromStorage } from '../utils/localStorage';
import { addSampleForms, clearAllForms } from '../utils/debugForms';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Load forms from localStorage on component mount
    const forms = loadFormsFromStorage();
    console.log('Loaded forms from localStorage:', forms); // Debug log
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  // Also listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const forms = loadFormsFromStorage();
      dispatch(loadSavedForms(forms));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  const handlePreviewForm = (formId: string) => {
    dispatch(loadFormForPreview(formId));
    navigate('/preview');
  };

  const handleDeleteForm = (formId: string, formName: string) => {
    if (window.confirm(`Are you sure you want to delete "${formName}"?`)) {
      const updatedForms = deleteFormFromStorage(formId);
      dispatch(loadSavedForms(updatedForms));
    }
  };

  const handleRefreshForms = () => {
    const forms = loadFormsFromStorage();
    console.log('Manual refresh - loaded forms:', forms);
    dispatch(loadSavedForms(forms));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          My Forms
        </Typography>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <FormIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            You haven't created any forms yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Start building beautiful forms to collect responses from your audience. Forms are easy to create and customize.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/create')}
            sx={{ px: 4, py: 1.5 }}
          >
            Create your first form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Debug Section - Remove in production */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
        <Typography variant="body2" gutterBottom>
          Debug Info:
        </Typography>
        <Typography variant="body2">
          Forms in Redux: {savedForms.length}
        </Typography>
        <Typography variant="body2">
          Forms in localStorage: {loadFormsFromStorage().length}
        </Typography>
        <Typography variant="body2">
          localStorage key: formBuilder_savedForms
        </Typography>
        <Button size="small" onClick={() => console.log('Current localStorage:', localStorage.getItem('formBuilder_savedForms'))}>
          Log localStorage
        </Button>
        <Button size="small" onClick={() => { addSampleForms(); handleRefreshForms(); }} sx={{ ml: 1 }}>
          Add Sample Forms
        </Button>
        <Button size="small" onClick={() => { clearAllForms(); handleRefreshForms(); }} sx={{ ml: 1 }}>
          Clear All Forms
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            My Forms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {savedForms.length} form{savedForms.length !== 1 ? 's' : ''} created
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/create')}
            sx={{ px: 3, py: 1.5 }}
          >
            New form
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshForms}
            sx={{ px: 3, py: 1.5 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <AnimatePresence initial={false}>
      {savedForms.map((form, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
              <motion.div
                layout
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.985 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.14 } }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 34, mass: 0.6, delay: index * 0.02 }}
                style={{ height: '100%' }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handlePreviewForm(form.id)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                        <FormIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {form.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created {formatDate(form.createdAt)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteForm(form.id, form.name);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                          label={`${form.fields.length} question${form.fields.length !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        {form.fields.some(f => f.isDerived) && (
                          <Chip
                            label="Smart fields"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {form.fields.some(f => f.required) && (
                          <Chip
                            label="Required fields"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {form.fields.length > 0 
                        ? form.fields.map(f => f.label).join(', ')
                        : 'No questions added yet'
                      }
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ViewIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewForm(form.id);
                      }}
                      sx={{ borderRadius: 20 }}
                    >
                      Open form
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

export default MyFormsPage;
