import { ProfilePhotoEditor } from "@/components/custom/profile/ProfilePhotoEditor";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

// Tipos para los items del menú
interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string | number;
  variant?: "default" | "danger";
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const { colorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí puedes agregar lógica para recargar datos del perfil
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleMenuPress = (title: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Alert.alert("Próximamente", `${title} estará disponible pronto`);
  };

  const handleLogout = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}

    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
        onPress: () => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {}
        },
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          await logout();
        },
      },
    ]);
  };

  // Secciones del menú
  const menuSections: MenuSection[] = [
    {
      title: "Cuenta",
      items: [
        {
          icon: "person-outline",
          title: "Editar perfil",
          subtitle: "Actualiza tu información personal",
          onPress: () => router.push("/client/modal/profile"),
        },
        {
          icon: "shield-checkmark-outline",
          title: "Privacidad y seguridad",
          subtitle: "Administra tu cuenta y seguridad",
          onPress: () => handleMenuPress("Privacidad y seguridad"),
        },
        {
          icon: "notifications-outline",
          title: "Notificaciones",
          subtitle: "Configura tus preferencias",
          onPress: () => handleMenuPress("Notificaciones"),
          badge: "3",
        },
      ],
    },
    {
      title: "Pagos",
      items: [
        {
          icon: "card-outline",
          title: "Métodos de pago",
          subtitle: "Gestiona tus formas de pago",
          onPress: () => handleMenuPress("Métodos de pago"),
        },
        {
          icon: "receipt-outline",
          title: "Historial de pagos",
          subtitle: "Revisa tus transacciones",
          onPress: () => handleMenuPress("Historial de pagos"),
        },
      ],
    },
    {
      title: "Soporte",
      items: [
        {
          icon: "help-circle-outline",
          title: "Ayuda y soporte",
          subtitle: "Obtén ayuda o contacta soporte",
          onPress: () => handleMenuPress("Ayuda y soporte"),
        },
        {
          icon: "document-text-outline",
          title: "Términos y condiciones",
          subtitle: "Lee nuestros términos",
          onPress: () => handleMenuPress("Términos y condiciones"),
        },
        {
          icon: "information-circle-outline",
          title: "Acerca de",
          subtitle: "Información de la aplicación",
          onPress: () => handleMenuPress("Acerca de"),
        },
      ],
    },
  ];

  // Función para renderizar un item del menú
  const renderMenuItem = (item: MenuItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.title}
      activeOpacity={0.7}
      className={cn(
        "flex-row items-center px-4 py-4 bg-card",
        !isLast && "border-b border-border"
      )}
      onPress={item.onPress}
    >
      <View className="w-10 h-10 rounded-full bg-muted items-center justify-center mr-3">
        <Ionicons
          name={item.icon as any}
          size={20}
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-semibold">{item.title}</Text>
          {item.badge && (
            <View className="bg-primary px-2 py-0.5 rounded-full">
              <Text className="text-xs font-bold text-primary-foreground">
                {item.badge}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-muted-foreground mt-0.5">
          {item.subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header con info del usuario */}
      <View className="bg-card border-border">
        <View className="items-center px-6 pt-4">
          {/* Avatar */}
          <View className="mb-2">
            <ProfilePhotoEditor
            showName={true}
              camera={false}
              size="lg"
              onPhotoUpdated={(newUrl) => {
                // aquí puedes refrescar el perfil si quieres
                console.log("Nueva foto:", newUrl);
              }}
            />
          </View>

          {/* Nombre */}
          {/* <Text className="text-2xl font-bold text-center mb-1">
            {user?.nombreCompleto || "Usuario"}
          </Text> */}

          {/* Email */}
          {/* <Text className="text-base text-muted-foreground text-center mb-3">
            {user?.email || "email@ejemplo.com"}
          </Text> */}
        </View>
      </View>

      {/* Secciones del menú */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="mt-6">
          {section.title && (
            <View className="px-4 mb-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </Text>
            </View>
          )}
          <View className="bg-card border-y border-border">
            {section.items.map((item, itemIndex) =>
              renderMenuItem(item, itemIndex === section.items.length - 1)
            )}
          </View>
        </View>
      ))}

      {/* Botón de cerrar sesión */}
      <View className="px-4 py-6 mt-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className={cn(
            "rounded-2xl py-4 flex-row items-center justify-center border",
            logoutLoading
              ? "bg-destructive/70 border-destructive/70"
              : "bg-destructive border-destructive"
          )}
          onPress={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Cerrar sesión
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Versión de la app */}
      <View className="items-center pb-8">
        <Text className="text-muted-foreground text-sm">Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
