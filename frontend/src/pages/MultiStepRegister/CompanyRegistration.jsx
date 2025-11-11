import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  MenuItem,
  Grid,
  LinearProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Business,
  Info,
  LocationOn,
  Contacts,
  ArrowBack,
  ArrowForward,
  Link as LinkIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const steps = ['Company Info', 'Founding Info', 'Social Media Info', 'Contact'];

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    company_name: '',
    logo_url: '',
    banner_url: '',
    
    // Step 2: Founding Info
    organization_type: '',
    industry: '',
    team_size: '',
    founded_date: '',
    website: '',
    description: '',
    
    // Step 4: Contact
    address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
  });

  // Step 3: Social Media Links - Dynamic array
  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: 'Facebook', url: '' },
    { id: 2, platform: 'Twitter', url: '' },
    { id: 3, platform: 'Instagram', url: '' },
    { id: 4, platform: 'Youtube', url: '' },
  ]);

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  // Social Links Handlers
  const handleSocialLinkPlatformChange = (id, newPlatform) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, platform: newPlatform } : link
    ));
  };

  const handleSocialLinkUrlChange = (id, newUrl) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, url: newUrl } : link
    ));
  };

  const addSocialLink = () => {
    const newId = Math.max(...socialLinks.map(l => l.id), 0) + 1;
    setSocialLinks([...socialLinks, { id: newId, platform: 'Facebook', url: '' }]);
  };

  const removeSocialLink = (id) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter(link => link.id !== id));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.company_name.trim()) {
        newErrors.company_name = 'Company name is required';
      }
    }

    if (step === 1) {
      if (!formData.organization_type) {
        newErrors.organization_type = 'Organization type is required';
      }
      if (!formData.industry) {
        newErrors.industry = 'Industry type is required';
      }
      if (!formData.team_size) {
        newErrors.team_size = 'Team size is required';
      }
      if (!formData.founded_date) {
        newErrors.founded_date = 'Year of establishment is required';
      }
      if (formData.website && !isValidUrl(formData.website)) {
        newErrors.website = 'Please enter a valid URL';
      }
    }

    if (step === 3) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!formData.postal_code.trim()) {
        newErrors.postal_code = 'Postal code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const social_links = {};
      socialLinks.forEach(link => {
        if (link.url) {
          social_links[link.platform.toLowerCase()] = link.url;
        }
      });

      const submitData = {
        ...formData,
        social_links
      };

      const response = await axios.post('/company', submitData);
      toast.success('Company profile created successfully!');
      setIsCompleted(true);
      setActiveStep(steps.length); // Move to completion step
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <Business />;
      case 1:
        return <Info />;
      case 2:
        return <LinkIcon />;
      case 3:
        return <LocationOn />;
      default:
        return <Business />;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CompanyInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 1:
        return <FoundingInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return (
          <SocialMediaStep
            socialLinks={socialLinks}
            handleSocialLinkPlatformChange={handleSocialLinkPlatformChange}
            handleSocialLinkUrlChange={handleSocialLinkUrlChange}
            addSocialLink={addSocialLink}
            removeSocialLink={removeSocialLink}
            errors={errors}
          />
        );
      case 3:
        return <ContactStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return <CompletionStep navigate={navigate} />;
      default:
        return null;
    }
  };

  const progress = isCompleted ? 100 : ((activeStep + 1) / steps.length) * 100;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
<Box sx={{ textAlign: 'center', mb: 4 }}>
            <Business sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Jobpilot
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isCompleted ? '' : 'Complete your company profile in multiple steps'}
            </Typography>
          </Box>
{!isCompleted && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Setup Progress
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {Math.round(progress)}% Completed
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}
{!isCompleted && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={() => getStepIcon(index)}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
<Box sx={{ minHeight: isCompleted ? 300 : 400 }}>{renderStepContent(activeStep)}</Box>
{!isCompleted && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Previous
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={!isSubmitting && <ArrowForward />}
                  >
                    {isSubmitting ? 'Submitting...' : 'Save & Next'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    disabled={isSubmitting}
                  >
                    Save & Next
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

// Step 1: Company Info
const CompanyInfoStep = ({ formData, handleChange, errors }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Company Info
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide basic information about your company
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Name"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={handleChange('company_name')}
            error={!!errors.company_name}
            helperText={errors.company_name}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Logo URL"
            placeholder="https://example.com/logo.png"
            value={formData.logo_url}
            onChange={handleChange('logo_url')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Banner URL"
            placeholder="https://example.com/banner.png"
            value={formData.banner_url}
            onChange={handleChange('banner_url')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// Step 2: Founding Info
const FoundingInfoStep = ({ formData, handleChange, errors }) => {
  const organizationTypes = [
    'Private Limited',
    'Public Limited',
    'Partnership',
    'Sole Proprietorship',
    'LLP',
    'Non-Profit',
    'Startup',
    'Other',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Manufacturing',
    'Real Estate',
    'Consulting',
    'Media & Entertainment',
    'Food & Beverage',
    'Transportation',
    'Retail',
    'Other',
  ];

  const teamSizes = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '501-1000',
    '1000+',
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Founding Info
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share details about your company's foundation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.organization_type} required>
            <InputLabel>Organization Type</InputLabel>
            <Select
              value={formData.organization_type}
              onChange={handleChange('organization_type')}
              label="Organization Type"
            >
              <MenuItem value="">
                <em>Select...</em>
              </MenuItem>
              {organizationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.organization_type && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.organization_type}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.industry} required>
            <InputLabel>Industry Types</InputLabel>
            <Select
              value={formData.industry}
              onChange={handleChange('industry')}
              label="Industry Types"
            >
              <MenuItem value="">
                <em>Select...</em>
              </MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
            {errors.industry && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.industry}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.team_size} required>
            <InputLabel>Team Size</InputLabel>
            <Select
              value={formData.team_size}
              onChange={handleChange('team_size')}
              label="Team Size"
            >
              <MenuItem value="">
                <em>Select...</em>
              </MenuItem>
              {teamSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
            {errors.team_size && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.team_size}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Year of Establishment"
            type="date"
            value={formData.founded_date}
            onChange={handleChange('founded_date')}
            error={!!errors.founded_date}
            helperText={errors.founded_date}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Website"
            placeholder="Website url..."
            value={formData.website}
            onChange={handleChange('website')}
            error={!!errors.website}
            helperText={errors.website}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Vision"
            placeholder="Tell us about your company vision..."
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// Step 3: Social Media Info
const SocialMediaStep = ({ 
  socialLinks, 
  handleSocialLinkPlatformChange, 
  handleSocialLinkUrlChange, 
  addSocialLink, 
  removeSocialLink, 
  errors 
}) => {
  const socialPlatforms = [
    { value: 'Facebook', icon: '📘', color: '#1877F2' },
    { value: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { value: 'Instagram', icon: '📷', color: '#E4405F' },
    { value: 'Youtube', icon: '▶️', color: '#FF0000' },
    { value: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { value: 'Pinterest', icon: '📌', color: '#E60023' },
    { value: 'TikTok', icon: '🎵', color: '#000000' },
    { value: 'GitHub', icon: '🐙', color: '#181717' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Social Media Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your company's social media profiles (optional)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {socialLinks.map((link, index) => (
          <Box key={link.id}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Social Link {index + 1}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <FormControl sx={{ minWidth: 180 }}>
                <Select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkPlatformChange(link.id, e.target.value)}
                  size="medium"
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }
                  }}
                >
                  {socialPlatforms.map((platform) => (
                    <MenuItem key={platform.value} value={platform.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{platform.icon}</span>
                        <span>{platform.value}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                placeholder="Profile link/url..."
                value={link.url}
                onChange={(e) => handleSocialLinkUrlChange(link.id, e.target.value)}
                size="medium"
              />
              
              <IconButton 
                onClick={() => removeSocialLink(link.id)}
                sx={{ 
                  color: 'error.main',
                  '&:hover': { bgcolor: 'error.lighter' }
                }}
                disabled={socialLinks.length === 1}
              >
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: '2px solid currentColor',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </Box>
              </IconButton>
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={
            <Box 
              sx={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%', 
                border: '2px solid currentColor',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              +
            </Box>
          }
          onClick={addSocialLink}
          sx={{ 
            alignSelf: 'flex-start',
            textTransform: 'none',
            borderStyle: 'dashed',
            borderWidth: 2,
            py: 1.5,
            px: 3,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            }
          }}
        >
          Add New Social Link
        </Button>
      </Box>
    </Box>
  );
};

// Step 4: Contact
const ContactStep = ({ formData, handleChange, errors }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Contact
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide your company's contact information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange('address')}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange('city')}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            placeholder="Enter state"
            value={formData.state}
            onChange={handleChange('state')}
            error={!!errors.state}
            helperText={errors.state}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={handleChange('country')}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Postal Code"
            placeholder="Enter postal code"
            value={formData.postal_code}
            onChange={handleChange('postal_code')}
            error={!!errors.postal_code}
            helperText={errors.postal_code}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// Step 5: Completion
const CompletionStep = ({ navigate }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
<Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'primary.lighter',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 3rem',
          position: 'relative',
        }}
      >
        <CheckCircle sx={{ fontSize: 80, color: 'primary.main' }} />
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle sx={{ fontSize: 24, color: 'white' }} />
        </Box>
      </Box>
<Typography variant="h4" fontWeight={700} gutterBottom>
        🎉 Congratulations, Your profile is 100% complete!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.8 }}
      >
        Donec hendrerit, ante quis mollis posuere, ligula felis ulna
        malesuada ante, eget aliquam nulla augue hendrerit ligula. Nunc
        mauris arcu, mattis sed sem vitae.
      </Typography>
<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          View Dashboard
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/settings')}
          sx={{
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          View Profile
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyRegistration;
