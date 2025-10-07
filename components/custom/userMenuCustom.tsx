import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { useUserProfile } from '@/hooks/profile/useUserProfile';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

interface UserMenuProps {
  onPress?: () => void;
}

export function UserMenu({ onPress }: UserMenuProps) {
  const { colorScheme } = useColorScheme();
  const { profile, loading } = useUserProfile();

  const getUserInitials = (name: string) => {
    if (!name) return 'US';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navegar al perfil usando expo-router
      router.push('/client/(tabs)/profile');
    }
  };

  // Mostrar un skeleton loader mientras carga
  if (loading) {
    return (
      <View
        className={`${
          colorScheme === 'dark' ? 'bg-black/20' : 'bg-white/20'
        } flex-row items-center rounded-full pl-1 pr-3 py-1 gap-2`}
      >
        <View className="size-10 rounded-full bg-white/20 items-center justify-center">
          <ActivityIndicator 
            size="small" 
            color={colorScheme === 'dark' ? '#000000' : '#ffffff'} 
          />
        </View>
        <Ionicons
          name="chevron-down"
          size={18}
          color={colorScheme === 'dark' ? '#000000' : '#ffffff'}
        />
      </View>
    );
  }

  const userName = profile?.nombreCompleto || 'Usuario';
  const userAvatar = profile?.urlFoto;

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        colorScheme === 'dark' ? 'bg-black/20' : 'bg-white/20'
      } flex-row items-center rounded-full pl-1 pr-3 py-1 gap-2`}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <Avatar alt={`${userName}'s avatar`} className="size-10">
        {userAvatar ? (
          <AvatarImage source={{ uri: userAvatar }} />
        ) : null}
        <AvatarFallback>
          <View className="bg-primary w-full h-full items-center justify-center">
            <Text className="text-primary-foreground text-base font-bold">
              {getUserInitials(userName)}
            </Text>
          </View>
        </AvatarFallback>
      </Avatar>

      {/* Icono de Chevron */}
      <Ionicons
        name="chevron-down"
        size={18}
        color={colorScheme === 'dark' ? '#000000' : '#ffffff'}
      />
    </TouchableOpacity>
  );
}