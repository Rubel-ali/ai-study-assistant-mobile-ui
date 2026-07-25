import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegisterMutation } from '../../src/redux/services/authApi';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      // Routing logic handled by root layout
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-900"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerClassName="flex-grow justify-center p-6">
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</Text>
        <Text className="text-slate-400 text-base">Join us and start studying smarter</Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-slate-300 font-medium mb-1.5 ml-1">Full Name</Text>
          <TextInput
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 transition-colors"
            placeholder="John Doe"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View>
          <Text className="text-slate-300 font-medium mb-1.5 ml-1">Email Address</Text>
          <TextInput
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 transition-colors"
            placeholder="Enter your email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-slate-300 font-medium mb-1.5 ml-1">Password</Text>
          <TextInput
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 transition-colors"
            placeholder="Create a password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View>
          <Text className="text-slate-300 font-medium mb-1.5 ml-1">Confirm Password</Text>
          <TextInput
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 transition-colors"
            placeholder="Confirm your password"
            placeholderTextColor="#94a3b8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-full bg-indigo-600 rounded-xl py-4 flex-row justify-center items-center ${isLoading ? 'opacity-70' : 'active:bg-indigo-700'}`}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-white font-semibold text-lg text-center">
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-slate-400">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-indigo-400 font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
