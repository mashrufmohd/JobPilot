import { createSlice } from '@reduxjs/toolkit';

const loadCompanyState = () => {
  try {
    const company = localStorage.getItem('company_data');
    if (company) {
      return JSON.parse(company);
    }
  } catch (error) {
    console.error('Error loading company state:', error);
  }
  return null;
};

const initialState = {
  company: loadCompanyState(),
  loading: false,
  error: null,
  registrationStep: 1,
  formData: {
    // Step 1: Company Basic
    company_name: '',
    industry: '',
    founded_date: '',
    
    // Step 2: Address & Industry
    address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    website: '',
    description: '',
    
    // Step 3: Uploads
    logo_url: '',
    banner_url: '',
    social_links: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
    },
  },
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCompany: (state, action) => {
      state.company = action.payload;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage
      if (action.payload) {
        localStorage.setItem('company_data', JSON.stringify(action.payload));
      }
    },
    updateCompany: (state, action) => {
      state.company = { ...state.company, ...action.payload };
      localStorage.setItem('company_data', JSON.stringify(state.company));
    },
    clearCompany: (state) => {
      state.company = null;
      localStorage.removeItem('company_data');
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.registrationStep = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCompany,
  updateCompany,
  clearCompany,
  setRegistrationStep,
  updateFormData,
  resetFormData,
  clearError,
} = companySlice.actions;

export default companySlice.reducer;
