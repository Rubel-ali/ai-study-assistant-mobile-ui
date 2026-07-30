import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks';
import { useLogoutMutation } from '../../src/redux/services/authApi';
import { clearPreferences } from '../../src/redux/preferencesSlice';

const SUBJECTS_DATA = {
  science: [
    { id: 'physics', name: 'Physics', icon: 'planet-outline', color: 'bg-blue-500' },
    { id: 'chemistry', name: 'Chemistry', icon: 'flask-outline', color: 'bg-emerald-500' },
    { id: 'hmath', name: 'Higher Math', icon: 'calculator-outline', color: 'bg-rose-500' },
    { id: 'biology', name: 'Biology', icon: 'leaf-outline', color: 'bg-amber-500' },
  ],
  arts: [
    { id: 'history', name: 'History', icon: 'book-outline', color: 'bg-amber-600' },
    { id: 'geography', name: 'Geography', icon: 'earth-outline', color: 'bg-emerald-600' },
    { id: 'civics', name: 'Civics', icon: 'people-outline', color: 'bg-blue-600' },
  ],
  commerce: [
    { id: 'accounting', name: 'Accounting', icon: 'briefcase-outline', color: 'bg-indigo-500' },
    { id: 'finance', name: 'Finance', icon: 'cash-outline', color: 'bg-emerald-500' },
    { id: 'management', name: 'Management', icon: 'business-outline', color: 'bg-rose-500' },
  ],
};

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { selectedCategory, selectedStream } = useAppSelector((state) => state.preferences);
  
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleChangeCategory = () => {
    dispatch(clearPreferences());
  };

  const handleSubjectPress = (subjectId: string, subjectName: string) => {
    // Navigate to topic/subject details in the future
    console.log(`Navigating to ${subjectName} (${subjectId})`);
  };

  const subjects = selectedStream && (SUBJECTS_DATA as any)[selectedStream]
    ? (SUBJECTS_DATA as any)[selectedStream]
    : SUBJECTS_DATA['science']; // Fallback

  const displayCategory = selectedCategory?.toUpperCase() || 'HSC';
  const displayStream = selectedStream ? selectedStream.charAt(0).toUpperCase() + selectedStream.slice(1) : 'Science';

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-slate-400 text-sm mb-1">Welcome back,</Text>
            <Text className="text-2xl font-bold text-white">
              {user?.name ? user.name : 'Student'}!
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut} className="p-2 bg-slate-800 rounded-full border border-slate-700">
            <Ionicons name="log-out-outline" size={24} color="#f87171" />
          </TouchableOpacity>
        </View>

        {/* Category Switcher Badge */}
        <TouchableOpacity 
          onPress={handleChangeCategory}
          activeOpacity={0.7}
          className="flex-row items-center self-start bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-full mb-8"
        >
          <Text className="text-indigo-400 font-semibold mr-2">
            {displayCategory} • {displayStream}
          </Text>
          <Ionicons name="swap-vertical" size={16} color="#818cf8" />
        </TouchableOpacity>

        {/* Quick Action Card */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg shadow-indigo-500/30"
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full">
              <Ionicons name="sparkles" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">AI Assistant</Text>
            </View>
          </View>
          <Text className="text-white text-xl font-bold mt-2">What do you want to learn today?</Text>
          <Text className="text-indigo-100 text-sm mt-1">Ask questions or search topics...</Text>
        </TouchableOpacity>

        {/* Subjects Grid */}
        <Text className="text-lg font-bold text-white mb-4">Your Subjects</Text>
        <View className="flex-row flex-wrap justify-between">
          {subjects.map((subject: any) => (
            <TouchableOpacity
              key={subject.id}
              onPress={() => handleSubjectPress(subject.id, subject.name)}
              activeOpacity={0.7}
              className="w-[48%] bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700"
            >
              <View className={`${subject.color} w-12 h-12 rounded-full items-center justify-center mb-3`}>
                <Ionicons name={subject.icon as any} size={24} color="#fff" />
              </View>
              <Text className="text-white font-semibold mb-1">{subject.name}</Text>
              <Text className="text-slate-400 text-xs">0 Topics</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
