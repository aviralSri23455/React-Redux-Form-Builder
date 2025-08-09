import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo, useState, Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';

// Lazy load pages for code splitting
const CreatePage = lazy(() => import('./pages/CreatePage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const MyFormsPage = lazy(() => import('./pages/MyFormsPage'));

// Factory to create theme in light/dark + density variants
const buildTheme = (mode: 'light' | 'dark', dense: boolean) => createTheme({
  palette: {
  mode,
    primary: {
      main: '#0078d4', // Microsoft blue
      light: '#3aa0f3',
      dark: '#005a9e',
    },
    secondary: {
      main: '#8764b8', // Microsoft purple
      light: '#a489d4',
      dark: '#61448a',
    },
    success: { main: '#107c10' },
    warning: { main: '#ffb900' },
    error: { main: '#d13438' },
    background: mode === 'light'
      ? { default: '#f5f7fa', paper: '#ffffff' }
      : { default: '#1e1f21', paper: '#26282b' },
    text: mode === 'light'
      ? { primary: '#1f1f1f', secondary: '#5a5a5a' }
      : { primary: '#f3f4f6', secondary: '#c2c6cc' },
    divider: 'rgba(0,0,0,0.08)'
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: '#1f1f1f', letterSpacing: '-0.5px' },
    h5: { fontWeight: 600, color: '#1f1f1f', letterSpacing: '-0.25px' },
    h6: { fontWeight: 600, color: '#1f1f1f' },
    button: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #f5f7fa 0%, #eef2f7 60%, #e6edf5 100%)'
            : 'linear-gradient(135deg, #1e1f21 0%, #222427 50%, #272a2e 100%)',
          WebkitFontSmoothing: 'antialiased',
          scrollbarColor: '#c2c6cc transparent',
        },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          background: mode === 'light' ? '#c2c6cc' : '#44484d',
          borderRadius: 20,
          border: `2px solid ${mode === 'light' ? '#f5f7fa' : '#2a2d31'}`
        },
        '*::-webkit-scrollbar-thumb:hover': { background: mode === 'light' ? '#b0b4ba' : '#565b60' }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.9) !important',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 10px -2px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)',
          transition: 'box-shadow .25s, transform .25s',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(145deg, rgba(255,255,255,0) 20%, rgba(0,120,212,0.04))',
            pointerEvents: 'none'
          },
          '&:hover': {
            boxShadow: '0 10px 24px -4px rgba(0,0,0,0.18), 0 4px 8px -2px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: 'none',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: 0.2,
          boxShadow: 'none',
          transition: 'background-color .25s, box-shadow .25s, transform .2s',
          '&:active': { transform: 'scale(.97)' }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
          '&:hover': {
            boxShadow: '0 4px 10px rgba(0,0,0,0.16)',
          }
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 }
        }
      }
    },
  MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
      backgroundColor: mode === 'light' ? '#ffffff' : '#2d3034',
          transition: 'box-shadow .25s, background-color .25s',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0078d4'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0078d4',
            borderWidth: 2
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(0,120,212,0.2)'
          }
        },
        input: {
          paddingTop: dense ? 6 : 12,
          paddingBottom: dense ? 6 : 12,
          fontSize: dense ? '0.85rem' : '1rem'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    },
  MuiChip: {
      styleOverrides: {
        root: {
      fontWeight: 500,
      borderRadius: 8,
      height: dense ? 22 : undefined,
      fontSize: dense ? '0.70rem' : undefined,
      '& .MuiChip-label': { px: dense ? 1 : 2 }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          paddingBottom: 4
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: 12,
          padding: '8px 10px'
        }
      }
    }
  }
});

// UI preference context (simple internal state)
function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [dense, setDense] = useState(false);
  const theme = useMemo(() => buildTheme(mode, dense), [mode, dense]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            {/* Quick settings floating panel */}
            <div style={{position:'fixed', bottom:16, left:16, zIndex:1300, display:'flex', flexDirection:'column', gap:8}}>
              <button
                onClick={() => setMode(m => m==='light' ? 'dark' : 'light')}
                style={{
                  background: mode==='light' ? '#1f1f1f' : '#ffffff',
                  color: mode==='light' ? '#ffffff' : '#1f1f1f',
                  border:'1px solid rgba(0,0,0,0.15)',
                  borderRadius: 30,
                  padding: '6px 14px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight:600,
                  boxShadow:'0 2px 6px rgba(0,0,0,0.2)',
                  backdropFilter:'blur(6px)'
                }}
                aria-label="Toggle dark mode"
              >
                {mode==='light' ? '🌙 Dark' : '☀️ Light'}
              </button>
              <button
                onClick={() => setDense(d => !d)}
                style={{
                  background: dense ? '#0078d4' : 'linear-gradient(90deg,#0078d4,#3aa0f3)',
                  color:'#fff',
                  border:'none',
                  borderRadius: 30,
                  padding: '6px 14px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight:600,
                  boxShadow:'0 2px 6px rgba(0,0,0,0.25)'
                }}
                aria-label="Toggle compact density"
              >
                {dense ? '🧩 Comfortable' : '📏 Compact'}
              </button>
            </div>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={
                <Suspense fallback={<div style={{padding: 20, textAlign: 'center'}}>Loading...</div>}>
                  <CreatePage />
                </Suspense>
              } />
              <Route path="/preview" element={
                <Suspense fallback={<div style={{padding: 20, textAlign: 'center'}}>Loading...</div>}>
                  <PreviewPage />
                </Suspense>
              } />
              <Route path="/myforms" element={
                <Suspense fallback={<div style={{padding: 20, textAlign: 'center'}}>Loading...</div>}>
                  <MyFormsPage />
                </Suspense>
              } />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
