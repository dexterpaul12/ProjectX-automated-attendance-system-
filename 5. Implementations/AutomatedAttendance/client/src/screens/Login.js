import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { ADMIN_CREDENTIALS } from '../config/auth';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import { colors, typography, shadows, spacing, borderRadius } from '../config/theme';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error'
  });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if credentials match admin
      if (username === ADMIN_CREDENTIALS.ADMIN_ID && password === ADMIN_CREDENTIALS.ADMIN_PASSWORD) {
        // Set admin as logged in
        login('admin', { id: username });
        
        showAlert('Success', 'Admin login successful!', 'success');
        
        // Navigate to Dashboard after showing success message
        setTimeout(() => {
          navigation.replace('Dashboard');
        }, 1500);
        return;
      }
      
      // Determine user type based on username format or prefix
      // This approach avoids sequential API calls
      const isLikelyStudent = /^[0-9]/.test(username.trim()) || username.toLowerCase().includes('stud');
      
      // Configure axios with a timeout
      const axiosConfig = {
        timeout: 8000 // 8 second timeout
      };
      
      // Try appropriate login endpoint directly instead of trying both
      try {
        const endpoint = isLikelyStudent 
          ? `${API_URL}/api/students/login`
          : `${API_URL}/api/instructors/login`;
        
        const payload = isLikelyStudent
          ? { studentId: username.trim(), password: password.trim() }
          : { instructorId: username.trim(), password: password.trim() };
        
        console.log(`Attempting login at: ${endpoint} with payload:`, { ...payload, password: '***' });
        const response = await axios.post(endpoint, payload, axiosConfig);
        
        console.log('Login response:', response.data);
        
        if (response.data.success) {
          const userData = isLikelyStudent 
            ? {
                idNumber: response.data.student.idNumber,
                fullName: response.data.student.fullName
              }
            : {
                idNumber: response.data.instructor.idNumber,
                fullName: response.data.instructor.fullName
              };
          
          console.log(`${isLikelyStudent ? 'Student' : 'Instructor'} login successful, setting user data:`, userData);
          
          // Store user data in AsyncStorage
          const storageItems = isLikelyStudent
            ? [
                ['studentId', userData.idNumber],
                ['studentName', userData.fullName],
                ['userType', 'student'],
                ['idNumber', userData.idNumber]
              ]
            : [
                ['instructorId', userData.idNumber],
                ['instructorName', userData.fullName],
                ['userType', 'instructor'],
                ['idNumber', userData.idNumber]
              ];
          
          await AsyncStorage.multiSet(storageItems);
          
          // Update auth context
          login(isLikelyStudent ? 'student' : 'instructor', userData);
          console.log('Auth context updated with user data');
          
          const userType = isLikelyStudent ? 'Student' : 'Instructor';
          showAlert('Success', `${userType} login successful!`, 'success');
          
          setTimeout(() => {
            const targetScreen = isLikelyStudent ? 'StudentDashboard' : 'InstructorDashboard';
            console.log(`Navigating to ${targetScreen} with user data:`, userData);
            navigation.replace(targetScreen, { [isLikelyStudent ? 'studentData' : 'instructorData']: userData });
          }, 1500);
          return;
        }
      } catch (error) {
        console.log('Login error:', error);
        
        // If first attempt fails, try the other user type
        try {
          const fallbackEndpoint = !isLikelyStudent 
            ? `${API_URL}/api/students/login`
            : `${API_URL}/api/instructors/login`;
          
          const fallbackPayload = !isLikelyStudent
            ? { studentId: username.trim(), password: password.trim() }
            : { instructorId: username.trim(), password: password.trim() };
          
          console.log(`Attempting fallback login at: ${fallbackEndpoint}`);
          const fallbackResponse = await axios.post(fallbackEndpoint, fallbackPayload, axiosConfig);
          
          if (fallbackResponse.data.success) {
            const userData = !isLikelyStudent 
              ? {
                  idNumber: fallbackResponse.data.student.idNumber,
                  fullName: fallbackResponse.data.student.fullName
                }
              : {
                  idNumber: fallbackResponse.data.instructor.idNumber,
                  fullName: fallbackResponse.data.instructor.fullName
                };
            
            // Store user data
            const storageItems = !isLikelyStudent
              ? [
                  ['studentId', userData.idNumber],
                  ['studentName', userData.fullName],
                  ['userType', 'student']
                ]
              : [
                  ['instructorId', userData.idNumber],
                  ['instructorName', userData.fullName],
                  ['userType', 'instructor'],
                  ['idNumber', userData.idNumber]
                ];
            
            await AsyncStorage.multiSet(storageItems);
            
            // Update auth context
            login(!isLikelyStudent ? 'student' : 'instructor', userData);
            
            const userType = !isLikelyStudent ? 'Student' : 'Instructor';
            showAlert('Success', `${userType} login successful!`, 'success');
            
            setTimeout(() => {
              const targetScreen = !isLikelyStudent ? 'StudentDashboard' : 'InstructorDashboard';
              navigation.replace(targetScreen, { [!isLikelyStudent ? 'studentData' : 'instructorData']: userData });
            }, 1500);
            return;
          }
        } catch (fallbackError) {
          // Both attempts failed, show invalid credentials error
          console.log('Fallback login error:', fallbackError);
          setError('Invalid username or password');
        }
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to connect to server');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.background} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Automated Attendance</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username / ID</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, Platform.OS === 'web' && styles.webInput]}
                    placeholder="Enter your username or ID"
                    value={username}
                    onChangeText={(text) => {
                      setError('');
                      setUsername(text);
                    }}
                    keyboardType="default"
                    autoCapitalize="none"
                    editable={!isLoading}
                    enterKeyHint="next"
                    autoComplete="username"
                    spellCheck={false}
                    placeholderTextColor={colors.text.disabled}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, Platform.OS === 'web' && styles.webInput]}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(text) => {
                      setError('');
                      setPassword(text);
                    }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    enterKeyHint="done"
                    autoComplete="current-password"
                    spellCheck={false}
                    placeholderTextColor={colors.text.disabled}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.loginIcon} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={hideAlert}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 1,
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -height * 0.05,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    height: 50,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text.primary,
  },
  webInput: {
    outlineStyle: 'none',
  },
  eyeIcon: {
    padding: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.small,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  loginIcon: {
    marginLeft: spacing.sm,
  },
});

export default Login; 