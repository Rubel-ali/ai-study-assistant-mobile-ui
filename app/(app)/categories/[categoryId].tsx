import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetSubCategoriesQuery } from '../../../src/redux/services/categoriesApi';
import { CategoryCard } from '../../../src/components/CategoryCard';

export default function SubCategoriesScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string; categoryName?: string }>();

  const { data: subCategories, isLoading, isError, refetch } = useGetSubCategoriesQuery(categoryId, {
    skip: !categoryId,
  });

  const handleSubCategoryPress = (id: string, name: string) => {
    router.push({
      pathname: '/(app)/subjects/[subCategoryId]',
      params: { subCategoryId: id, subCategoryName: name },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="text-slate-500 mt-4 font-medium">Loading subcategories...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-slate-600 mt-4 text-center font-medium">Failed to load subcategories.</Text>
          <TouchableOpacity 
            onPress={refetch} 
            className="mt-6 px-6 py-3 bg-[#4F46E5] rounded-full shadow-sm"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={subCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <CategoryCard
            id={item.id}
            name={item.name}
            iconName={item.iconName}
            onPress={handleSubCategoryPress}
            containerStyle="w-[48%] mb-4"
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
            <Text className="text-slate-500 mt-4 font-medium">No subcategories found.</Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-slate-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 p-2 bg-slate-50 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 flex-1" numberOfLines={1}>
          {categoryName || 'Subcategories'}
        </Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
