import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSuccess } from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', data);
      
      if (response.success) {
        dispatch(loginSuccess({
          token: response.data.token,
          user: response.data.user
        }));
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fa',
        p: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          maxWidth: 1200,
          width: '100%',
          minHeight: 600,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            p: 6,
          }}
        >
          <Box
            component="img"
            src="/src/public/card.png"
            alt="Welcome"
            sx={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            px: 4,
          }}
        >
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: '#000',
                fontSize: '28px',
              }}
            >
              Login as a Company
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: '#000', fontWeight: 500 }}
              >
                Email ID
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8f9fa',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                  },
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 2 }}>
                <Link
                  href="#"
                  sx={{
                    color: '#4F46E5',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Login with OTP
                </Link>
              </Box>

              <Typography
                variant="body2"
                sx={{ mb: 1, color: '#000', fontWeight: 500 }}
              >
                Enter your password
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required'
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8f9fa',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                  },
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link
                  href="#"
                  sx={{
                    color: '#6B7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: '#4F46E5',
                    },
                  }}
                >
                   Forgot Password ?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  borderRadius: '50px',
                  bgcolor: '#5B8DEE',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#4F46E5',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ color: '#6B7280' }}
              >
                Don't have an account ?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#4F46E5',
                    textDecoration: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
