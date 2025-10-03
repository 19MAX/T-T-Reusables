import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo o imagen */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-center text-foreground">
            Bienvenido
          </Text>
          <Text className="text-lg text-center text-muted-foreground mt-2">
            Tu aplicación increíble
          </Text>
        </View>

        {/* Botones */}
        <View className="w-full max-w-sm space-y-4">
          <Link href="/auth/login" asChild>
            <Button size="lg" className="w-full">
              <Text>Buscar Trabajos</Text>
            </Button>
          </Link>

          <Link href="/auth/register/identification" asChild>
            <Button size="lg" variant="outline" className="w-full">
              <Text>Crear Perfil</Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}