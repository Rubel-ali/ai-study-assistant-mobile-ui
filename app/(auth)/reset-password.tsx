import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useResetPasswordMutation } from '../../src/redux/services/authApi';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1, 'Reset code is required'),
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
      token: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({ 
        email: email || '', // Handle edge case where email might be missing
        token: data.token, 
        newPassword: data.newPassword 
      }).unwrap();
      
      Alert.alert('Success', 'Your password has been reset successfully', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Reset Failed', err?.data?.message || 'Something went wrong while resetting the password');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-900"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerClassName="flex-grow justify-center p-6" keyboardShouldPersistTaps="handled">
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight text-center">Reset Password</Text>
            <Text className="text-slate-400 text-base text-center">
              {email ? `Enter the reset code sent to ${email}` : 'Enter your reset code and new password'}
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">Reset Code</Text>
              <Controller
                control={control}
                name="token"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border transition-colors ${errors.token ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80'}`}
                    placeholder="Enter reset code"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.token && (
                <Text className="text-red-500 text-sm mt-1.5 ml-1">{errors.token.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">New Password</Text>
              <View className="relative w-full">
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-3.5 border transition-colors ${errors.newPassword ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80'}`}
                      placeholder="Enter new password"
                      placeholderTextColor="#94a3b8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                    />
                  )}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mt-1.5 ml-1">{errors.newPassword.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">Confirm Password</Text>
              <View className="relative w-full">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-3.5 border transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80'}`}
                      placeholder="Confirm new password"
                      placeholderTextColor="#94a3b8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showConfirmPassword}
                    />
                  )}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1.5 ml-1">{errors.confirmPassword.message}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            className={`w-full bg-indigo-600 rounded-xl py-4 flex-row justify-center items-center ${isLoading ? 'opacity-70' : 'active:bg-indigo-700'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" className="mr-2" />
            ) : null}
            <Text className="text-white font-semibold text-lg text-center">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-indigo-400 font-semibold">Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
