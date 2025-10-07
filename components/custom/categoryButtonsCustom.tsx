import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

interface CategoryButtonsProps {
  categories?: Category[];
  onCategoryPress?: (category: Category) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Hogar', icon: 'home', active: true },
  { id: '2', name: 'Mascotas', icon: 'paw', active: false },
  { id: '3', name: 'Eventos', icon: 'balloon', active: false },
  { id: '4', name: 'Ver más', icon: 'ellipsis-horizontal', active: false },
];

export function CategoryButtons({
  categories = defaultCategories,
  onCategoryPress,
}: CategoryButtonsProps) {
  return (
    <View className="px-6 -mt-8 mb-6">
      <View className="bg-card rounded-lg shadow-lg p-4 flex-row justify-around">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryPress?.(category)}
            className="flex-col items-center space-y-1"
          >
            <View
              className={`p-3 rounded-full ${
                category.active
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={category.active ? '#14B8A6' : '#6B7280'}
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                category.active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}