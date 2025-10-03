import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function SignInForm({email,password,onEmailChange,onPasswordChange,onSubmit,loading= false}: SignInFormProps) {
  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const goToRegister = () => {
    router.push('/auth/register/identification');
  };

  const goToForgotPassword = () => {
    router.push('/auth/forgot');
  };
  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@ejemplo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChangeText={onEmailChange}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                editable={!loading}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={goToForgotPassword}
                  disabled={loading}
                  >
                  <Text className="font-normal leading-4">¿Olvidaste tu contraseña?</Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                value={password}
                onChangeText={onPasswordChange}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                editable={!loading}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              <Text>{loading ? 'Cargando...' : 'Continuar'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            ¿No tienes cuenta?{'  '}
            <Pressable
              onPress={goToRegister}
              disabled={loading}
              >
              <Text className="text-sm underline underline-offset-4">Regístrate</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
