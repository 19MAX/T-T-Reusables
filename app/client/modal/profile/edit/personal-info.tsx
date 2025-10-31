import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useProfileUpdate } from '@/hooks/profile/useProfileUpdates';
import { useUserProfile } from '@/hooks/profile/useUserProfile';
import { useToast } from '@/providers/ToastProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    View
} from 'react-native';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  nombreCompleto: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  numeroContacto: Yup.string()
    .required('El número de contacto es obligatorio')
    .matches(/^[0-9+]{10,15}$/, 'Número de contacto inválido (10-15 dígitos)'),
});

export default function EditPersonalInfoScreen() {
  const { profile, loading: profileLoading } = useUserProfile();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { promise } = useToast();
  const { updatePersonalInfo, loading } = useProfileUpdate();
  
  const nombreInputRef = useRef<TextInput>(null);
  const telefonoInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombreCompleto: '',
      numeroContacto: '',
    },
  });

  // Actualizar valores cuando el perfil cargue
  useEffect(() => {
    if (profile) {
      setValue('nombreCompleto', profile.nombreCompleto || '');
      setValue('numeroContacto', profile.numeroContacto || '');
    }
  }, [profile, setValue]);

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.back();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    try {
      await promise(
        updatePersonalInfo({
          nombreCompleto: data.nombreCompleto.trim(),
          numeroContacto: data.numeroContacto.trim(),
        }),
        {
          loading: 'Actualizando información...',
          success: 'Información actualizada correctamente',
          error: (err: any) => err.message || 'Error al actualizar información',
        }
      );

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
    }
  });

  if (profileLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-4 gap-6">
            {/* Avatar actual */}
            {/* <View className="items-center py-4">
              <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border-4 border-primary/30">
                <Text className="text-4xl font-bold text-primary">
                  {profile?.nombreCompleto?.charAt(0).toUpperCase() || '👤'}
                </Text>
              </View>
            </View> */}

            {/* Formulario */}
            <View className="bg-card rounded-2xl p-5 border border-border gap-5">
              {/* Nombre completo */}
              <View className="gap-2">
                <Label htmlFor="nombreCompleto">
                  Nombre completo *
                </Label>
                <Controller
                  control={control}
                  name="nombreCompleto"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      ref={nombreInputRef}
                      id="nombreCompleto"
                      placeholder="Ej: Juan Pérez González"
                      value={value}
                      onChangeText={onChange}
                      editable={!loading}
                      returnKeyType="next"
                      autoCapitalize="words"
                      onSubmitEditing={() => telefonoInputRef.current?.focus()}
                    />
                  )}
                />
                {errors.nombreCompleto && (
                  <Text className="text-destructive text-xs">
                    {errors.nombreCompleto.message}
                  </Text>
                )}
              </View>

              {/* Número de contacto */}
              <View className="gap-2">
                <Label htmlFor="numeroContacto">
                  Número de contacto *
                </Label>
                <Controller
                  control={control}
                  name="numeroContacto"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      ref={telefonoInputRef}
                      id="numeroContacto"
                      placeholder="Ej: 0987654321"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      editable={!loading}
                      returnKeyType="done"
                      maxLength={15}
                    />
                  )}
                />
                {errors.numeroContacto && (
                  <Text className="text-destructive text-xs">
                    {errors.numeroContacto.message}
                  </Text>
                )}
                <Text className="text-xs text-muted-foreground">
                  Incluye código de país si es internacional (Ej: +593987654321)
                </Text>
              </View>
            </View>

            {/* Botones */}
            <View className="gap-3 pb-6">
              <Button
                onPress={onSubmit}
                disabled={loading || !isDirty}
                className="w-full"
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="font-semibold">Guardar cambios</Text>
                )}
              </Button>

              {isDirty && (
                <Text className="text-xs text-center text-muted-foreground">
                  Tienes cambios sin guardar
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}