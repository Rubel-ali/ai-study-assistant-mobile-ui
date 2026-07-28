import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useResetPasswordMutation } from '../../src/redux/services/authApi';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is available in Expo

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await resetPassword({ 
        email: email || '', // Handle edge case where email might be missing
        token, 
        newPassword 
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
              <TextInput
                className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80 transition-colors"
                placeholder="Enter reset code"
                placeholderTextColor="#94a3b8"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">New Password</Text>
              <View className="relative w-full">
                <TextInput
                  className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-3.5 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80 transition-colors"
                  placeholder="Enter new password"
                  placeholderTextColor="#94a3b8"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">Confirm Password</Text>
              <View className="relative w-full">
                <TextInput
                  className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-3.5 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80 transition-colors"
                  placeholder="Confirm new password"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className={`w-full bg-indigo-600 rounded-xl py-4 flex-row justify-center items-center ${isLoading ? 'opacity-70' : 'active:bg-indigo-700'}`}
            onPress={handleResetPassword}
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
