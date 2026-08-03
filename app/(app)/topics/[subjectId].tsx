import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetTopicsQuery } from '../../../src/redux/services/categoriesApi';

export default function TopicsListScreen() {
  const router = useRouter();
  const { subjectId, subjectName } = useLocalSearchParams<{ subjectId: string; subjectName?: string }>();

  const { data: topics, isLoading, isError, refetch } = useGetTopicsQuery(subjectId, {
    skip: !subjectId,
  });

  const handleTopicPress = (id: string, name: string) => {
    // Navigate to topic details or AI chat, passing the topic context
    router.push({
      pathname: '/(app)/topic-details',
      params: { topicId: id, topicName: name },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="text-slate-500 mt-4 font-medium">Loading topics...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-slate-600 mt-4 text-center font-medium">
            Failed to load topics. Please check your connection and try again.
          </Text>
          <TouchableOpacity 
            onPress={refetch} 
            className="mt-6 px-8 py-3 bg-[#4F46E5] rounded-full shadow-sm"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const safeIconName = (item.iconName || 'document-text-outline') as keyof typeof Ionicons.glyphMap;
          
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleTopicPress(item.id, item.name)}
              className="bg-white p-4 mb-4 rounded-2xl flex-row items-center border border-slate-100"
              style={styles.card}
            >
              <View className="bg-indigo-50/80 w-12 h-12 rounded-full items-center justify-center mr-4">
                <Ionicons name={safeIconName} size={24} color="#4F46E5" />
              </View>
              
              <View className="flex-1 pr-2">
                <Text className="text-slate-800 font-bold text-base mb-1" numberOfLines={1}>
                  {item.name}
                </Text>
                {item.description ? (
                  <Text className="text-slate-500 text-sm" numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>

              <View className="bg-indigo-500 w-8 h-8 rounded-full items-center justify-center ml-2">
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-24">
            <View className="bg-slate-50 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons name="list-outline" size={40} color="#94A3B8" />
            </View>
            <Text className="text-slate-700 font-bold text-lg">No topics found</Text>
            <Text className="text-slate-500 mt-2 text-center px-8">
              We couldn't find any topics for this subject right now.
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center p-4 bg-white border-b border-slate-100 z-10" style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-3 p-2 bg-slate-50 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 flex-1" numberOfLines={1}>
          {subjectName || 'Topics'}
        </Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
