import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSolicitarRecuperacion } from "@/hooks/auth/useSolicitarRecuperacion";
import { useState } from "react";
import { View } from "react-native";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { loading, error, success, solicitarRecuperacion, reset } =
    useSolicitarRecuperacion();

  const onSubmit = async () => {
    if (!email.trim()) {
      return;
    }
    await solicitarRecuperacion(email);
  };

  // Si la solicitud fue exitosa, muestra un mensaje diferente
  if (success) {
    return (
      <View className="gap-6">
        <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">
              Revisa tu correo
            </CardTitle>
            <CardDescription className="text-center sm:text-left">
              Te hemos enviado un enlace para restablecer tu contraseña a{" "}
              {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <Button
              className="w-full"
              variant="outline"
              onPress={() => {
                setEmail("");
                reset();
              }}
            >
              <Text>Volver a intentar</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu email para restablecer tu contraseña
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
                returnKeyType="send"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={onSubmit}
                editable={!loading}
              />
              {error && (
                <Text className="text-sm text-destructive mt-1">{error}</Text>
              )}
            </View>
            <Button
              className="w-full"
              onPress={onSubmit}
              disabled={loading || !email.trim()}
            >
              <Text>{loading ? "Enviando..." : "Restablecer contraseña"}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
