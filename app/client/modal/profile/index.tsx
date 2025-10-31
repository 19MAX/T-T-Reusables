import { ProfilePhotoEditor } from "@/components/custom/profile/ProfilePhotoEditor";
import { Text } from "@/components/ui/text";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface EditOption {
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  iconBg: string;
  iconColor: string;
}

export default function EditProfileMenuScreen() {
  const { profile, loading } = useUserProfile();
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const editOptions: EditOption[] = [
    {
      icon: "person-outline",
      title: "Información personal",
      subtitle: "Actualiza tu nombre y número de contacto",
      route: "/client/modal/profile/edit/personal-info",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "#3b82f6",
    },
    {
      icon: "document-text-outline",
      title: "Información adicional",
      subtitle: "Educación, ciudadanía y trabajo deseado",
      route: "/client/modal/profile/edit/additional-info",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "#9333ea",
    },
  ];

  const handleOptionPress = (route: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push(route as any);
  };

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Información del usuario actual */}
        <View className="bg-card border-b border-border p-4">
          <View className="items-center">
            <ProfilePhotoEditor
              camera={true}
              showName={true}
              size="lg"
              onPhotoUpdated={(newUrl) => {
                // aquí puedes refrescar el perfil si quieres
                console.log("Nueva foto:", newUrl);
              }}
            />
            {/* <Text className="text-lg font-semibold text-center">
              {profile?.nombreCompleto || "Usuario"}
            </Text> */}
          </View>
        </View>

        {/* Opciones de edición */}
        <View className="mt-6">
          <View className="px-4 mb-3">
            <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Opciones de edición
            </Text>
          </View>

          <View className="bg-card border-y border-border">
            {editOptions.map((option, index) => (
              <TouchableOpacity
                key={option.route}
                activeOpacity={0.7}
                className={cn(
                  "flex-row items-center px-4 py-5 bg-card",
                  index !== editOptions.length - 1 && "border-b border-border"
                )}
                onPress={() => handleOptionPress(option.route)}
              >
                <View
                  className={cn(
                    "w-10 h-10 rounded-full items-center justify-center mr-4",
                    option.iconBg
                  )}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={option.iconColor}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-semibold mb-0.5">
                    {option.title}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {option.subtitle}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
