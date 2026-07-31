import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useLoginMutation, useRegisterMutation } from '../src/redux/services/authApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../src/redux/authSlice';
import { saveToken } from '../src/services/storage';

WebBrowser.maybeCompleteAuthSession();

type AuthMode = 'login' | 'signup';

interface AuthUIProps {
  initialMode: AuthMode;
}

const { width } = Dimensions.get('window');

export default function AuthUI({ initialMode }: AuthUIProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // API hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const isLoading = isLoginLoading || isRegisterLoading;

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/v1';
    const authUrl = `${backendUrl}/auth/${provider}`;
    const redirectUrl = Linking.createURL('/');

    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        
        if (queryParams?.token) {
          const token = queryParams.token as string;
          const userId = (queryParams.userId as string) || 'unknown';
          
          dispatch(
            setCredentials({
              user: { id: userId, name: 'Student', email: '' }, 
              token: token,
            })
          );
          
          await saveToken(token);
          router.replace('/(app)/');
        }
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      Alert.alert('Login Error', `Failed to authenticate with ${provider}`);
    }
  };

  const formatErrorMsg = (err: any) => {
    const msg = err?.data?.message || err?.error || 'Something went wrong';
    if (Array.isArray(msg)) return msg.join('\n');
    if (typeof msg === 'string') return msg;
    return JSON.stringify(msg);
  };

  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      try {
        await login({ email, password }).unwrap();
      } catch (err: any) {
        Alert.alert('Login Failed', formatErrorMsg(err));
      }
    } else {
      if (!email || !password || !firstName || !lastName) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      try {
        await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password }).unwrap();
        Alert.alert('Success', 'Account created successfully! Please sign in.');
        setMode('login');
      } catch (err: any) {
        Alert.alert('Registration Failed', formatErrorMsg(err));
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#2E7DFA', '#8F3FFA', '#E8458A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.card}>
              
              {/* Top User Icon */}
              <LinearGradient
                colors={['#538AF7', '#DD54BA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <FontAwesome name="user" size={30} color="#FFFFFF" />
              </LinearGradient>

              {/* Title */}
              <Text style={styles.title}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>

              <View style={styles.formContainer}>
                
                {/* Name Inputs (Sign Up Only) */}
                {mode === 'signup' && (
                  <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>First Name</Text>
                      </View>
                      <View style={styles.inputWrapper}>
                        <FontAwesome name="user-o" size={16} color="#B0B5C1" />
                        <TextInput
                          style={styles.input}
                          placeholder="First"
                          placeholderTextColor="#B0B5C1"
                          value={firstName}
                          onChangeText={setFirstName}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Last Name</Text>
                      </View>
                      <View style={styles.inputWrapper}>
                        <FontAwesome name="user-o" size={16} color="#B0B5C1" />
                        <TextInput
                          style={styles.input}
                          placeholder="Last"
                          placeholderTextColor="#B0B5C1"
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Email Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Email</Text>
                    {mode === 'login' && (
                      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <FontAwesome name="envelope-o" size={16} color="#B0B5C1" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#B0B5C1"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <FontAwesome name="lock" size={18} color="#B0B5C1" />
                    <TextInput
                      style={[styles.input, { paddingRight: 40 }]}
                      placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
                      placeholderTextColor="#B0B5C1"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      style={{ position: 'absolute', right: 16 }}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitBtnWrapper} onPress={handleSubmit} disabled={isLoading}>
                  <LinearGradient
                    colors={mode === 'login' ? ['#9C55FF', '#446BFB'] : ['#EC5C9B', '#AA4DF9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isLoading && <ActivityIndicator color="#FFF" size="small" style={{ marginRight: 8 }} />}
                    <Text style={styles.submitBtnText}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.line} />
              </View>

              {/* Social Logins */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('google')}>
                  <Image source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('facebook')}>
                  <Image source={{ uri: 'https://img.icons8.com/color/48/000000/facebook-new.png' }} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
              </View>

              {/* Bottom Text */}
              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                  {mode === 'login' ? 'Not registered yet? ' : 'Already have an account? '}
                </Text>
                <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                  <Text style={styles.bottomTextLink}>
                    {mode === 'login' ? 'Sign Up >' : 'Log In >'}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 28,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    alignItems: 'center',
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2643',
    marginBottom: 28,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  inputBlock: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34304D',
  },
  forgotText: {
    fontSize: 12,
    color: '#7681F7',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F0F1F5',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: '#2A2643',
    fontSize: 14,
  },
  submitBtnWrapper: {
    width: '100%',
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#446BFB', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E9EC',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#A1A4B2',
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  bottomText: {
    color: '#656276',
    fontSize: 14,
  },
  bottomTextLink: {
    color: '#5569FE',
    fontSize: 14,
    fontWeight: '700',
  },
});
