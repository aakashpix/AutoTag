// src/LoginScreen.js
import React, { useState } from 'react';

// onScan prop added
const LoginScreen = ({ onScan }) => { 
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // This simulates a successful RFID scan on the website
    // In your case, the ESP8266 scan automatically opens the URL.
    // We'll use this to trigger the next screen.
    if (userId) {
      onScan(userId);
    }
  };

  return (
    // ... rest of your component remains the same
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="otp">OTP:</label>
          <input
            type="password"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
};

export default LoginScreen;