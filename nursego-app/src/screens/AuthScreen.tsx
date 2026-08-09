import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet, Image, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '216302655182-ivbhglknpjah09vbk2sg09aginpj4p34.apps.googleusercontent.com',
  iosClientId: '216302655182-ivbhglknpjah09vbk2sg09aginpj4p34.apps.googleusercontent.com',
});

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/auth`;

export default function AuthScreen({ navigation }: any) {
  const [role, setRole] = useState<'PATIENT' | 'NURSE'>('PATIENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result: any = await GoogleSignin.signIn();
      const userInfo = result.data || result;
      const user = userInfo?.user;
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Send to backend
      const res = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: user.id,
          email: user.email,
          name: user.name,
          role: role
        })
      });

      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'PATIENT') {
          navigation.replace('Patient');
        } else {
          navigation.replace('Nurse');
        }
      } else {
        showAlert('Error', data.message || 'Google Login Failed');
      }
    } catch (e: any) {
      if (e.code !== 'IN_PROGRESS' && e.code !== 'SIGN_IN_CANCELLED') {
        showAlert('Error', e.message || 'Cannot connect to server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (identifier.length < 5 || password.length < 6) {
      showAlert('Error', 'Please enter a valid Email/Phone and Password (min 6 chars)');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      
      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'PATIENT') {
          navigation.replace('Patient');
        } else {
          navigation.replace('Nurse');
        }
      } else {
        showAlert('Error', data.message);
      }
    } catch (e) {
      showAlert('Network Error', 'Cannot connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      showToast('Please enter your phone number');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        showToast('OTP sent securely via SMS');
      } else {
        showAlert('Error', data.message || 'Failed to send OTP');
      }
    } catch (e: any) {
      showAlert('Network Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      showToast('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode, role })
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
        showToast('Login Successful!');
        navigation.replace(data.user.role === 'PATIENT' ? 'Patient' : 'Nurse');
      } else {
        showAlert('Error', data.message || 'Invalid OTP');
      }
    } catch (e: any) {
      showAlert('Network Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Full Screen Premium Gradient */}
      <LinearGradient
        colors={role === 'NURSE' ? ['transparent', 'rgba(6,78,59,0.9)', '#022c22'] : ['transparent', 'rgba(15,23,42,0.9)', '#0f172a']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Header with Logo */}
            <View style={styles.headerContainer}>
              <View style={styles.logoGlow}>
                <Image source={require('../../assets/nursego_logo.png')} style={styles.logo} resizeMode="contain" />
              </View>
              <Text style={styles.brandName}>NurseGo</Text>
              <Text style={styles.subtitle}>Elevating Healthcare Standards</Text>
            </View>

            {/* Glassmorphism Card */}
            <View style={styles.glassCard}>
            
            {/* Global CSS injection for Web Autofill */}
            {Platform.OS === 'web' && (
              <style type="text/css">{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px rgba(255,255,255,0) inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                    background-color: transparent !important;
                }
                input:focus {
                    outline: none !important;
                    background-color: transparent !important;
                }
              `}</style>
            )}

              <View style={styles.roleToggleContainer}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.roleButton, role === 'PATIENT' && styles.roleButtonActive]}
                  onPress={() => { setRole('PATIENT'); setIdentifier(''); setPassword(''); }}
                >
                  <Ionicons name="person" size={18} color={role === 'PATIENT' ? '#fff' : '#94a3b8'} style={{ marginRight: 6 }} />
                  <Text style={[styles.roleText, role === 'PATIENT' && styles.roleTextActive]}>Patient</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.roleButton, role === 'NURSE' && { backgroundColor: '#059669', borderColor: '#10b981' }]}
                  onPress={() => { setRole('NURSE'); setIdentifier(''); setPassword(''); }}
                >
                  <Ionicons name="medkit" size={18} color={role === 'NURSE' ? '#fff' : '#94a3b8'} style={{ marginRight: 6 }} />
                  <Text style={[styles.roleText, role === 'NURSE' && styles.roleTextActive]}>Nurse / Staff</Text>
                </TouchableOpacity>
              </View>

            {isOtpMode ? (
              <View style={styles.formContainer}>
                <Text style={styles.cardTitle}>Phone Login</Text>
                
                {!otpSent ? (
                  <>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput 
                          style={styles.input} 
                          placeholder="9999999999" 
                          keyboardType="phone-pad"
                          value={phone} 
                          onChangeText={setPhone} 
                          editable={!isLoading}
                        />
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.primaryButton, 
                        { backgroundColor: role === 'NURSE' ? '#059669' : '#1d4ed8' },
                        isLoading && { opacity: 0.7 }
                      ]} 
                      onPress={handleSendOtp}
                      disabled={isLoading}
                    >
                      <Text style={styles.primaryButtonText}>{isLoading ? 'Sending...' : 'Send Secure OTP'}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput 
                          style={styles.input} 
                          placeholder="1234" 
                          keyboardType="number-pad"
                          value={otpCode} 
                          onChangeText={setOtpCode} 
                          editable={!isLoading}
                        />
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.primaryButton, 
                        { backgroundColor: role === 'NURSE' ? '#059669' : '#1d4ed8' },
                        isLoading && { opacity: 0.7 }
                      ]} 
                      onPress={handleVerifyOtp}
                      disabled={isLoading}
                    >
                      <Text style={styles.primaryButtonText}>{isLoading ? 'Verifying...' : 'Verify & Login'}</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity onPress={() => setIsOtpMode(!isOtpMode)}>
                  <Text style={[
                    styles.bottomLinkText,
                    { color: role === 'NURSE' ? '#34d399' : '#60a5fa' }
                  ]}>{isOtpMode ? 'Use Email / Password instead' : 'Continue with Phone (OTP)'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>
                  Sign in to your {role === 'PATIENT' ? 'Patient' : 'Nurse'} account
                </Text>

                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email or Mobile Number"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    value={identifier}
                    onChangeText={setIdentifier}
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                    returnKeyType="send"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.primaryButton, 
                    { backgroundColor: role === 'NURSE' ? '#059669' : '#1d4ed8' },
                    isLoading && { opacity: 0.7 }
                  ]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.primaryButtonText}>{isLoading ? 'Signing in...' : 'Sign In securely'}</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity 
                  style={[styles.otpButton, { backgroundColor: role === 'NURSE' ? '#059669' : '#1d4ed8' }]} 
                  onPress={() => setIsOtpMode(true)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.googleButtonText}>Continue with Phone (OTP)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.navigate('Register', { role })} 
                  style={[
                    styles.secondaryButton,
                    { borderColor: role === 'NURSE' ? 'rgba(5, 150, 105, 0.5)' : 'rgba(59, 130, 246, 0.5)' }
                  ]}
                >
                  <Text style={[
                    styles.secondaryButtonText,
                    { color: role === 'NURSE' ? '#34d399' : '#60a5fa' }
                  ]}>Create New Account</Text>
                </TouchableOpacity>
              </View>
            )}

            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoGlow: {
    backgroundColor: '#fff',
    borderRadius: 75,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 16,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  logo: {
    width: 125,
    height: 125,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
    width: Platform.OS === 'web' ? 400 : '100%',
    maxWidth: '100%',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 8,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  roleButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roleTextActive: {
    color: '#fff',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#94a3b8',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  otpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d4ed8',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  }
});
