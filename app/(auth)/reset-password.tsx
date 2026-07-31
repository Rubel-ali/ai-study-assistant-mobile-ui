import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useResetPasswordMutation } from '../../src/redux/services/authApi';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const schema = z.object({
  otp: z.string().min(1, 'Reset code is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const formatErrorMsg = (err: any) => {
    const msg = err?.data?.message || err?.error || 'Something went wrong while resetting the password';
    if (Array.isArray(msg)) return msg.join('\n');
    if (typeof msg === 'string') return msg;
    return JSON.stringify(msg);
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({ 
        email: email || '', // Handle edge case where email might be missing
        otp: data.otp, 
        newPassword: data.newPassword 
      }).unwrap();
      
      Alert.alert('Success', 'Your password has been reset successfully', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Reset Failed', formatErrorMsg(err));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#2E7DFA', '#8F3FFA', '#E8458A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.card}>
              
              {/* Title & Subtitle */}
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                {email ? `Enter the reset code sent to ${email}` : 'Enter your reset code and new password'}
              </Text>

              <View style={styles.formContainer}>
                
                {/* Reset Code Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Reset Code</Text>
                  </View>
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputWrapper, errors.otp && { borderColor: '#ef4444' }]}>
                        <Ionicons name="key-outline" size={18} color="#B0B5C1" />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter reset code"
                          placeholderTextColor="#B0B5C1"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="none"
                        />
                      </View>
                    )}
                  />
                  {errors.otp && (
                    <Text style={styles.errorText}>{errors.otp.message}</Text>
                  )}
                </View>

                {/* New Password Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>New Password</Text>
                  </View>
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputWrapper, errors.newPassword && { borderColor: '#ef4444' }]}>
                        <Ionicons name="lock-closed-outline" size={18} color="#B0B5C1" />
                        <TextInput
                          style={[styles.input, { paddingRight: 40 }]}
                          placeholder="Enter new password"
                          placeholderTextColor="#B0B5C1"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                          style={styles.eyeIcon}
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.newPassword && (
                    <Text style={styles.errorText}>{errors.newPassword.message}</Text>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Confirm Password</Text>
                  </View>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputWrapper, errors.confirmPassword && { borderColor: '#ef4444' }]}>
                        <Ionicons name="lock-closed-outline" size={18} color="#B0B5C1" />
                        <TextInput
                          style={[styles.input, { paddingRight: 40 }]}
                          placeholder="Confirm new password"
                          placeholderTextColor="#B0B5C1"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity 
                          style={styles.eyeIcon}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitBtnWrapper} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                  <LinearGradient
                    colors={['#9C55FF', '#446BFB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isLoading && <ActivityIndicator color="#FFF" size="small" style={{ marginRight: 8 }} />}
                    <Text style={styles.submitBtnText}>
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>

              {/* Bottom Text */}
              <View style={styles.bottomTextContainer}>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                  <Text style={styles.bottomTextLink}>Back to Sign In</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2643',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#656276',
    textAlign: 'center',
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
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34304D',
    marginLeft: 4,
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
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
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
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  bottomTextLink: {
    color: '#5569FE',
    fontSize: 14,
    fontWeight: '700',
  },
});
