import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Apps as AppsIcon } from '@mui/icons-material';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: '#ffffff',
          color: 'text.primary',
          borderBottom: '1px solid #edebe9'
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
              <AppsIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Microsoft Forms
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={{
                color: isActive('/create') ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive('/create') ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
                borderRadius: 20,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 120, 212, 0.1)',
                },
              }}
            >
              New Form
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/preview"
              sx={{
                color: isActive('/preview') ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive('/preview') ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
                borderRadius: 20,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 120, 212, 0.1)',
                },
              }}
            >
              Preview
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/myforms"
              sx={{
                color: isActive('/myforms') ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive('/myforms') ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
                borderRadius: 20,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 120, 212, 0.1)',
                },
              }}
            >
              My Forms
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
