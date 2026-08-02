import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppDispatch } from '../../src/redux/hooks';
import { setPreferences } from '../../src/redux/preferencesSlice';

const CATEGORIES = [
  { id: 'hsc', label: 'HSC' },
  { id: 'ssc', label: 'SSC' },
  { id: 'admission', label: 'Admission' },
  { id: 'national_university', label: 'National University' },
  { id: 'job_preparation', label: 'Job Preparation' },
];

const STREAMS = {
  hsc: [
    { id: 'science', label: 'Science' },
    { id: 'arts', label: 'Arts' },
    { id: 'commerce', label: 'Commerce' },
  ],
  ssc: [
    { id: 'science', label: 'Science' },
    { id: 'arts', label: 'Arts' },
    { id: 'commerce', label: 'Commerce' },
  ],
  admission: [
    { id: 'engineering', label: 'Engineering' },
    { id: 'medical', label: 'Medical' },
    { id: 'university', label: 'University' },
  ],
  national_university: [
    { id: 'honours', label: 'Honours' },
    { id: 'degree', label: 'Degree (Pass)' },
    { id: 'masters', label: 'Masters' },
  ],
  job_preparation: [
    { id: 'bcs', label: 'BCS' },
    { id: 'bank', label: 'Bank' },
    { id: 'primary', label: 'Primary Teacher' },
    { id: 'others', label: 'Other Govt Jobs' },
  ],
};

export default function CategorySelectScreen() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedStream(null); // Reset stream when category changes
  };

  const handleStreamSelect = (streamId: string) => {
    setSelectedStream(streamId);
  };

  const handleContinue = () => {
    if (selectedCategory && selectedStream) {
      dispatch(
        setPreferences({
          category: selectedCategory,
          stream: selectedStream,
        })
      );
    }
  };

  const handleSkip = () => {
    // Default fallback
    dispatch(
      setPreferences({
        category: 'hsc',
        stream: 'science',
      })
    );
  };

  const isContinueEnabled = selectedCategory && selectedStream;

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="mb-10 mt-8">
          <Text className="text-3xl font-bold text-white mb-2">Welcome!</Text>
          <Text className="text-slate-400 text-base">
            Let's personalize your study experience.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-semibold text-white mb-4">
            Step 1: Select your level
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleCategorySelect(cat.id)}
                  className={`px-6 py-3 rounded-full border ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-400'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-medium ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedCategory && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-white mb-4">
              Step 2: Select your stream
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {(STREAMS as any)[selectedCategory].map((stream: any) => {
                const isSelected = selectedStream === stream.id;
                return (
                  <TouchableOpacity
                    key={stream.id}
                    onPress={() => handleStreamSelect(stream.id)}
                    className={`px-6 py-3 rounded-full border ${
                      isSelected
                        ? 'bg-indigo-500 border-indigo-400'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {stream.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View className="flex-1" />

        <View className="mt-8 gap-4">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isContinueEnabled}
            className={`py-4 rounded-xl items-center ${
              isContinueEnabled ? 'bg-indigo-500 active:bg-indigo-600' : 'bg-slate-800 opacity-50'
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                isContinueEnabled ? 'text-white' : 'text-slate-500'
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSkip}
            className="py-4 rounded-xl items-center active:bg-slate-800"
          >
            <Text className="font-semibold text-slate-400">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
