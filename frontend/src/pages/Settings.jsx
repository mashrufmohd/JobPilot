import React from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const Settings = () => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" fontWeight={600}>
            Settings
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Company Info" />
            <Tab label="Founding Info" />
            <Tab label="Social Media Profile" />
            <Tab label="Account Setting" />
          </Tabs>

          <Box sx={{ py: 3 }}>
            {tabValue === 0 && (
              <Typography>Company information settings will be displayed here.</Typography>
            )}
            {tabValue === 1 && (
              <Typography>Founding information will be displayed here.</Typography>
            )}
            {tabValue === 2 && (
              <Typography>Social media profile settings will be displayed here.</Typography>
            )}
            {tabValue === 3 && (
              <Typography>Account settings will be displayed here.</Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
