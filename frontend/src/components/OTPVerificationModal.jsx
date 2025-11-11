import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
} from '@mui/material';
import { Close, Email, Sms } from '@mui/icons-material';

const OTPVerificationModal = ({ open, onClose, mobileNumber, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      return;
    }
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  };

  const handleResendOTP = () => {
    // Handle resend OTP logic
    console.log('Resending OTP...');
  };

  const maskedMobile = mobileNumber ? 
    `(+91 ${mobileNumber.slice(0, 5)}*****${mobileNumber.slice(-3)})` : 
    '(+91 92222*****442)';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
<Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px', mb: 0.5 }}>
            Great Almost done!
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px' }}>
            Please verify your mobile no
          </Typography>
        </Box>
<Box
          sx={{
            bgcolor: '#E8F5E9',
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Email sx={{ fontSize: 40, color: '#000' }} />
          <Typography variant="body2" sx={{ color: '#000', fontSize: '14px' }}>
            A verification link has been sent to your email. Please check your inbox and verify.
          </Typography>
        </Box>
<Box
          sx={{
            bgcolor: '#FCE4EC',
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Sms sx={{ fontSize: 40, color: '#000' }} />
          <Typography variant="body2" sx={{ color: '#000', fontSize: '14px' }}>
            Enter the One Time Password (OTP) which has been sent to {maskedMobile}
          </Typography>
        </Box>
<TextField
          fullWidth
          placeholder="Enter Your OTP Here"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          inputProps={{
            maxLength: 6,
            style: { textAlign: 'center', fontSize: '18px', letterSpacing: '8px' }
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#F5F5F5',
            },
          }}
        />
<Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#000', display: 'inline' }}>
            Didn't receive OTP ?{' '}
          </Typography>
          <Link
            component="button"
            onClick={handleResendOTP}
            sx={{
              color: '#5B8DEE',
              textDecoration: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Resend OTP
          </Link>
        </Box>
<Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#000', display: 'inline' }}>
            Having Trouble?{' '}
          </Typography>
          <Link
            href="#"
            sx={{
              color: '#9E9E9E',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Report Issue!
          </Link>
        </Box>
<Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              borderColor: '#E0E0E0',
              color: '#000',
              '&:hover': {
                borderColor: '#BDBDBD',
                bgcolor: '#F5F5F5',
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading || !otp || otp.length < 4}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              bgcolor: '#5B8DEE',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4F46E5',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Verifying...' : 'Verify Mobile'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
