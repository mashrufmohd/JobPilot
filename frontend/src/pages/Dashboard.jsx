import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Business, Add, CheckCircle, Cancel } from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await axiosInstance.get('/company/my-profile');
      if (response.success) {
        setCompany(response.data.company);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No company profile found - this is expected for new users');
      } else {
        console.error('Error fetching company profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
<Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                    {user?.full_name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user?.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={user?.is_email_verified ? 'Email Verified' : 'Email Not Verified'}
                    color={user?.is_email_verified ? 'success' : 'default'}
                    size="small"
                    icon={user?.is_email_verified ? <CheckCircle /> : <Cancel />}
                  />
                  <Chip
                    label={user?.is_mobile_verified ? 'Mobile Verified' : 'Mobile Not Verified'}
                    color={user?.is_mobile_verified ? 'success' : 'default'}
                    size="small"
                    icon={user?.is_mobile_verified ? <CheckCircle /> : <Cancel />}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
<Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company Profile
                </Typography>
                
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : company ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {company.logo_url ? (
                        <img src={company.logo_url} alt="Logo" style={{ width: 64, height: 64, borderRadius: 8, marginRight: 16 }} />
                      ) : (
                        <Business sx={{ fontSize: 64, color: 'primary.main', mr: 2 }} />
                      )}
                      <Box>
                        <Typography variant="h5">{company.company_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {company.industry} • {company.city}, {company.state}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {company.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/settings')}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No Company Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Create your company profile to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/company/register')}
                    >
                      Create Company Profile
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
<Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Setup Progress</Typography>
                <Typography variant="h3" color="primary">{company ? '100%' : '25%'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {company ? 'Profile Complete!' : 'Complete your profile'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
