import { Text } from "@/components/ui/text";
import { useUserCredits } from "@/hooks/profile/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge } from "../ui/badge";
import { UserMenu } from "./userMenuCustom";

interface CustomHomeHeaderProps {
  onSearchChange?: (text: string) => void;
  onNotificationPress?: () => void;
  onCreditsPress?: () => void;
  onUserPress?: () => void;
}

export function CustomHomeHeader({
  onSearchChange,
  onNotificationPress,
  onCreditsPress,
  onUserPress,
}: CustomHomeHeaderProps) {
  const { colorScheme } = useColorScheme();
  const [searchText, setSearchText] = useState("");

  // Usar el hook de créditos
  const { credits, loading: isLoadingCredits } = useUserCredits();

  const isDark = colorScheme === "dark";

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  return (
    <View>
      <View className="bg-primary pb-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center px-4 pt-4 pb-6">
          {/* Componente de Usuario con Avatar y Chevron */}
          <UserMenu onPress={onUserPress} />

          {/* Notificaciones y Créditos */}
          <View className="flex-row items-center gap-3">
            {/* Botón de Notificaciones */}
            <TouchableOpacity
              onPress={onNotificationPress}
              className={`${
                colorScheme === "dark" ? "bg-black/20" : "bg-white/20"
              } rounded-full p-2 relative`}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colorScheme === "dark" ? "#000000" : "#ffffff"}
              />
              {/* Badge de notificaciones */}
              <View className="absolute -top-0 -right-0">
                <Badge
                  className="min-w-3 h-3 p-0 m-0 rounded-full bg-green-600"
                  variant="default"
                />
              </View>
            </TouchableOpacity>

            {/* Indicador de Créditos */}
            <TouchableOpacity
              onPress={onCreditsPress}
              disabled={isLoadingCredits}
              className={`${
                colorScheme === "dark" ? "bg-black/20" : "bg-white/20"
              } flex-row items-center rounded-full px-3 py-2 gap-1.5 min-w-[70px] justify-center`}
              activeOpacity={0.7}
            >
              {isLoadingCredits ? (
                <ActivityIndicator
                  size="small"
                  color={colorScheme === "dark" ? "#000000" : "#ffffff"}
                />
              ) : (
                <>
                  <Ionicons
                    name="diamond"
                    size={16}
                    color={colorScheme === "dark" ? "#000000" : "#ffffff"}
                  />
                  <Text
                    className={`${
                      colorScheme === "dark" ? "text-black" : "text-white"
                    } text-sm font-semibold`}
                  >
                    {credits.toLocaleString()}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Barra de Búsqueda - Mitad sobre el fondo primary, mitad fuera */}
      <View className="px-4 -mt-6">
        <View className="relative">
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#9CA3AF" : "#6B7280"}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: [{ translateY: -10 }],
              zIndex: 1,
            }}
          />

          <Pressable
            onPress={() => router.push("/client/(tabs)/search")}
          >
            <TextInput
              className={`w-full ${
                isDark ? "bg-card text-white" : "bg-white text-gray-900"
              } rounded-2xl py-3 pl-12 pr-4 shadow-lg border ${
                isDark ? "border-border" : "border-gray-200"
              }`}
              placeholder="Buscar una oferta..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
              value={searchText}
              onChangeText={handleSearchChange}
              editable={false}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
