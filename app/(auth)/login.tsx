import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useLoginMutation } from '../../src/redux/services/authApi';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await login({ email, password }).unwrap();
      // the routing logic will be handled by the root layout redirect based on auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err?.data?.message || 'Something went wrong');
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
        <Text className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</Text>
        <Text className="text-slate-400 text-base">Sign in to continue your journey</Text>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-slate-300 font-medium mb-1.5 ml-1">Email Address</Text>
          <TextInput
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80 transition-colors"
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
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80 transition-colors"
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-full bg-indigo-600 rounded-xl py-4 flex-row justify-center items-center ${isLoading ? 'opacity-70' : 'active:bg-indigo-700'}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-white font-semibold text-lg text-center">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-slate-400">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text className="text-indigo-400 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
