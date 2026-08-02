import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
  id: string;
  name: string;
  iconName?: string;
  onPress: (id: string, name: string) => void;
  containerStyle?: ViewStyle | string;
}

/**
 * Reusable card component for rendering categories, subcategories, or subjects.
 * Uses soft background colors, rounded corners, and subtle elevation/shadows.
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  iconName,
  onPress,
  containerStyle,
}) => {
  const safeIconName = (iconName || 'folder-outline') as keyof typeof Ionicons.glyphMap;

  // Mix of Tailwind (className) and native styles for exact shadows & colors
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(id, name)}
      className={`p-4 bg-[#EEF2FF] justify-center items-center ${
        typeof containerStyle === 'string' ? containerStyle : ''
      }`}
      style={[
        styles.card,
        typeof containerStyle === 'object' ? containerStyle : undefined,
      ]}
    >
      <View className="bg-indigo-500/10 w-14 h-14 rounded-full items-center justify-center mb-3">
        <Ionicons name={safeIconName} size={28} color="#4F46E5" />
      </View>
      <Text 
        className="text-slate-800 font-bold text-center mb-1 text-[15px]" 
        numberOfLines={2}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
