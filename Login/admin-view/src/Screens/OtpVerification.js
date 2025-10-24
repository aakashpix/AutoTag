import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OtpVerification = ({ userId, onVerify }) => {
  const [searchParams] = useSearchParams();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');

  useEffect(() => {
    const otpFromUrl = searchParams.get('otp');
    if (otpFromUrl) {
      setServerOtp(otpFromUrl);
    }
  }, [searchParams]);

  const handleVerify = (e) => {
    e.preventDefault();
    // Compare the two strings directly to ensure they are the same
    if (enteredOtp.toString() === serverOtp.toString()) {
      alert('OTP is correct! Login successful!');
      onVerify(true);
    } else {
      alert('Incorrect OTP. Please try again.');
      onVerify(false);
    }
  };

  return (
    <div className="otp-container">
      <form className="otp-form" onSubmit={handleVerify}>
        <h2>Enter OTP</h2>
        <p>Please enter the OTP from your mobile app.</p>
        <div className="input-group">
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            required
            maxLength={6}
          />
        </div>
        <button type="submit" className="login-button">Verify</button>
      </form>
    </div>
  );
};

export default OtpVerification;