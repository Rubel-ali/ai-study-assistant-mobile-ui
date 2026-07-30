import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPasswordMutation } from '../../src/redux/services/authApi';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
      Alert.alert('Failed', err?.data?.message || 'Something went wrong while sending the reset link');
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
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight text-center">Forgot Password</Text>
            <Text className="text-slate-400 text-base text-center">Enter your email address to receive a password reset link</Text>
          </View>

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-slate-300 font-medium mb-1.5 ml-1">Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 border transition-colors ${errors.email ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500 focus:bg-slate-800/80'}`}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1.5 ml-1">{errors.email.message}</Text>
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
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Remember your password? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-indigo-400 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
