import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPasswordMutation } from '../../src/redux/services/authApi';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  });

  const formatErrorMsg = (err: any) => {
    const msg = err?.data?.message || err?.error || 'Something went wrong while sending the reset link';
    if (Array.isArray(msg)) return msg.join('\n');
    if (typeof msg === 'string') return msg;
    return JSON.stringify(msg);
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      Alert.alert('Success', 'Reset code sent to your email');
      // Pass the email as a route param so the next screen can use it
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: data.email }
      });
    } catch (err: any) {
      Alert.alert('Failed', formatErrorMsg(err));
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
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>Enter your email address to receive a password reset link</Text>

              <View style={styles.formContainer}>
                {/* Email Input */}
                <View style={styles.inputBlock}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Email Address</Text>
                  </View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputWrapper, errors.email && { borderColor: '#ef4444' }]}>
                        <FontAwesome name="envelope-o" size={16} color="#B0B5C1" />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor="#B0B5C1"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
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
                      {isLoading ? 'Sending...' : 'Send Reset Code'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Bottom Text */}
              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.bottomTextLink}>Sign In</Text>
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
