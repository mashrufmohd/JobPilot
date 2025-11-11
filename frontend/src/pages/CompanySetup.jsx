import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Person,
  BusinessCenter,
  Public,
  ContactMail,
  CloudUpload,
  ArrowForward,
  Work,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CompanySetup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [setupProgress] = useState(25); // 25% for first tab
  const [formData, setFormData] = useState({
    logo: null,
    banner: null,
    companyName: '',
    aboutUs: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = (type) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSaveAndNext = () => {
    if (!formData.companyName) {
      toast.error('Please enter company name');
      return;
    }
    // Save data and move to next tab
    toast.success('Company info saved!');
    setActiveTab(1); // Move to next tab
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f7fa',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Work sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
            Jobpilot
          </Typography>
        </Box>
<Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
              Setup Progress
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
              {setupProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={setupProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#1976d2',
                borderRadius: 4,
              },
            }}
          />
        </Box>
<Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
<Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #E5E7EB',
              px: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 64,
                fontWeight: 500,
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#1976d2',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<Person />}
              iconPosition="start"
              label="Company Info"
            />
            <Tab
              icon={<BusinessCenter />}
              iconPosition="start"
              label="Founding Info"
              disabled
            />
            <Tab
              icon={<Public />}
              iconPosition="start"
              label="Social Media Profile"
              disabled
            />
            <Tab
              icon={<ContactMail />}
              iconPosition="start"
              label="Contact"
              disabled
            />
          </Tabs>
<Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box>
<Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Logo & Banner Image
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
<Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Upload Logo
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #D1D5DB',
                        borderRadius: 2,
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: '#F9FAFB',
                        '&:hover': {
                          borderColor: '#1976d2',
                          bgcolor: '#EFF6FF',
                        },
                      }}
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      <input
                        id="logo-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload('logo')}
                      />
                      <CloudUpload sx={{ fontSize: 48, color: '#9CA3AF', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                        Browse photo
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        or drop here
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9CA3AF', mt: 1, textAlign: 'center' }}>
                        A photo larger than 400 pixels<br />work best. Max photo size 5 MB.
                      </Typography>
                    </Box>
                  </Box>
<Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Banner Image
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #D1D5DB',
                        borderRadius: 2,
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: '#F9FAFB',
                        '&:hover': {
                          borderColor: '#1976d2',
                          bgcolor: '#EFF6FF',
                        },
                      }}
                      onClick={() => document.getElementById('banner-upload').click()}
                    >
                      <input
                        id="banner-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload('banner')}
                      />
                      <CloudUpload sx={{ fontSize: 48, color: '#9CA3AF', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                        Browse photo
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        or drop here
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9CA3AF', mt: 1, textAlign: 'center' }}>
                        Banner images optical dimension 1520*400. Supported<br />format: JPEG, PNG. Max photo size 5 MB.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
<Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Company name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F9FAFB',
                        '& fieldset': {
                          borderColor: '#D1D5DB',
                        },
                      },
                    }}
                  />
                </Box>
<Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    About Us
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write down about your company here. Let the candidate know who we are..."
                    value={formData.aboutUs}
                    onChange={handleInputChange('aboutUs')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F9FAFB',
                        '& fieldset': {
                          borderColor: '#D1D5DB',
                        },
                      },
                    }}
                  />
<Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid #E5E7EB',
                    }}
                  >
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>B</Typography>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <Typography sx={{ fontStyle: 'italic', fontSize: '14px' }}>I</Typography>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <Typography sx={{ textDecoration: 'underline', fontSize: '14px' }}>U</Typography>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <Typography sx={{ textDecoration: 'line-through', fontSize: '14px' }}>S</Typography>
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      🔗
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      ≡
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }}>
                      ☰
                    </IconButton>
                  </Box>
                </Box>
<Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleSaveAndNext}
                  sx={{
                    bgcolor: '#1976d2',
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#1565c0',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Save & Next
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
<Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: '#9CA3AF',
            mt: 4,
          }}
        >
          © 2021 Jobpilot - Job Board. All rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default CompanySetup;
