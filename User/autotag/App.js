import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { io } from 'socket.io-client';
import * as Notifications from 'expo-notifications';

// Set the notification handler to show alerts and play sounds
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldPlaySound: true, // Use the system default sound
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [otp, setOtp] = useState('000000');
  const [status, setStatus] = useState('Waiting for scan...');
  const SERVER_IP = '192.168.137.112';

  // Function to ask for notification permissions
  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission needed', 'Please enable push notifications for the app to work.');
      return;
    }
  };

  // Function to send a notification
  const sendNotification = async (otpCode) => {
    const title = 'Login Attempt Detected!';
    const body = `Your one-time password is: ${otpCode}`;
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true, // This will use the system's default notification sound
      },
      trigger: { seconds: 1 },
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();

    const socket = io(`http://${SERVER_IP}:5000`, {
      transports: ['websocket'],
      upgrade: false,
    });

    socket.on('connect', () => {
      setStatus('Connected to server.');
      console.log('Socket.IO: Connected successfully!');
    });

    socket.on('generate_otp', () => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000);
      setOtp(randomOtp.toString());
      setStatus('New OTP generated locally!');
      console.log('Generated OTP locally:', randomOtp);
      
      // Trigger the notification with the system sound
      sendNotification(randomOtp.toString());
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected from server.');
      console.log('Socket.IO: Disconnected.');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setStatus(`Connection Error: ${error.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your One-Time Password</Text>
      <Text style={styles.otpText}>{otp}</Text>
      <Text style={styles.statusText}>Status: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#5d56f9',
    marginBottom: 30,
    letterSpacing: 5,
  },
  statusText: {
    marginTop: 20,
    color: '#888',
  },
});