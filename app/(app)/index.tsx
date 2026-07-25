import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks';
import { useLogoutMutation } from '../../src/redux/services/authApi';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-6">
      <Text className="text-3xl font-bold text-white mb-2">
        Hello, {user?.name || 'Student'}!
      </Text>
      <Text className="text-slate-400 mb-8 text-center">
        Welcome to your AI Study Assistant
      </Text>
      
      <TouchableOpacity
        className="bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 active:bg-slate-700"
        onPress={handleLogout}
        disabled={isLoading}
      >
        <Text className="text-red-400 font-semibold">
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
