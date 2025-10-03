import { useLogout } from '@/hooks/useLogout';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { logout, loading } = useLogout();

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Editar perfil',
      subtitle: 'Actualiza tu información personal',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notificaciones',
      subtitle: 'Configura tus preferencias',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacidad y seguridad',
      subtitle: 'Administra tu cuenta',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'card-outline',
      title: 'Métodos de pago',
      subtitle: 'Gestiona tus formas de pago',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Ayuda y soporte',
      subtitle: 'Obtén ayuda o contacta soporte',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'document-text-outline',
      title: 'Términos y condiciones',
      subtitle: 'Lee nuestros términos',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header con info del usuario */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="items-center">
          {/* Avatar */}
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-4xl">
              {user?.nombreCompleto?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>

          {/* Nombre */}
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {user?.nombreCompleto || 'Usuario'}
          </Text>

          {/* Email */}
          <Text className="text-gray-600 mb-2">
            {user?.email}
          </Text>

          {/* Rol badge */}
          {user?.rol && (
            <View className="bg-blue-100 px-4 py-1 rounded-full">
              <Text className="text-blue-700 font-semibold text-sm capitalize">
                {user.rol}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Menú de opciones */}
      <View className="mt-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white px-6 py-4 flex-row items-center border-b border-gray-100"
            onPress={item.onPress}
          >
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
              <Ionicons name={item.icon as any} size={20} color="#6b7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de cerrar sesión */}
      <View className="px-6 py-6">
        <TouchableOpacity
          className={`rounded-xl py-4 flex-row items-center justify-center ${
            loading ? 'bg-red-400' : 'bg-red-600'
          }`}
          onPress={logout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
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
        <Text className="text-gray-400 text-sm">
          Versión 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}