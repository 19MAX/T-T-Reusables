import { Text } from '@/components/ui/text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  showViewAll?: boolean;
  onViewAllPress?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  showViewAll = true,
  onViewAllPress,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`flex-row justify-between items-center px-4 ${className}`}>
      <Text className="text-lg font-semibold">{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAllPress}>
          <Text className="text-primary font-medium text-sm">Ver todos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}