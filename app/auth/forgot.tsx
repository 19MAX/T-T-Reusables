import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Aquí iría tu lógica de reset password
      // await authService.resetPassword(email);
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-background justify-center px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Email Enviado</CardTitle>
            <CardDescription>
              Revisa tu bandeja de entrada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground">
              Hemos enviado un enlace de recuperación a {email}. 
              Por favor revisa tu correo y sigue las instrucciones.
            </Text>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onPress={() => router.push('/auth/login')}
            >
              <Text>Volver al Login</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-background"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary mb-4">← Volver</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-foreground">
              Recuperar Contraseña
            </Text>
            <Text className="text-muted-foreground mt-2">
              Ingresa tu email para recibir instrucciones
            </Text>
          </View>

          {/* Card con formulario */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Restablecer Contraseña</CardTitle>
              <CardDescription>
                Te enviaremos un enlace de recuperación
              </CardDescription>
            </CardHeader>
            
            <CardContent className="gap-4">
              {/* Email */}
              <View className="gap-2">
                <Label nativeID="email">Email</Label>
                <Input
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  aria-labelledby="email"
                  editable={!isLoading}
                />
              </View>

              {/* Error message */}
              {error ? (
                <View className="bg-destructive/10 p-3 rounded-md">
                  <Text className="text-destructive text-sm">{error}</Text>
                </View>
              ) : null}
            </CardContent>

            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text>{isLoading ? 'Enviando...' : 'Enviar Instrucciones'}</Text>
              </Button>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}