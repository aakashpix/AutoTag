import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginScreen from './Screens/LoginScreen';
import OtpVerification from './Screens/OtpVerification';
import './App.css';

function App() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
    }
  }, [searchParams]);

  const handleUserScan = (scannedUserId) => {
    setUserId(scannedUserId);
  };

  const handleOtpVerification = (success) => {
    if (success) {
      setIsVerified(true);
      alert('Login Successful!');
      // Redirect or perform other actions for successful login
    } else {
      alert('OTP verification failed!');
    }
  };

  // Show the OTP screen if a User ID is present
  if (userId && !isVerified) {
    return <OtpVerification userId={userId} onVerify={handleOtpVerification} />;
  }

  // Otherwise, show the initial login screen
  return (
    <div className="App">
      <header className="App-header">
        <LoginScreen onScan={handleUserScan} />
      </header>
    </div>
  );
}

export default App;