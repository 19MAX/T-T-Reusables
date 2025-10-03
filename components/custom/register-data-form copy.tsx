import { DatePicker } from "@/components/custom/date-picker";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import * as React from "react";
import { Platform, Pressable, TextInput, View } from "react-native";

export function RegisterDataForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(undefined);
  const [gender, setGender] = React.useState<string>("");

  const contentInsets = {
    top: 10,
    bottom: Platform.select({ ios: 10, android: 10 + 24 }),
    left: 12,
    right: 12,
  };

  // Calcular la fecha máxima (18 años atrás desde hoy)
  const maxDate = React.useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }, []);

  // Calcular la fecha mínima (100 años atrás desde hoy)
  const minDate = React.useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100);
    return date;
  }, []);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit() {
    // TODO: Submit form and navigate to protected screen if successful
    console.log("Birth Date:", birthDate);
    console.log("Gender:", gender);
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Completa los datos
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Bienvenido! Por favor completa los datos para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              </View>
              <Input
                id="confirm-password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="phone">Teléfono</Label>
              </View>
              <Input
                id="phone"
                placeholder="0900000000"
                inputMode="numeric"
                maxLength={10}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="address">Dirección</Label>
              </View>
              <Input
                id="address"
                placeholder="Ingresa tu dirección"
                inputMode="text"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="gender">Género</Label>
              </View>
              <Select
              // value={gender} onValueChange={setGender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent insets={contentInsets}>
                  <SelectGroup>
                    <SelectLabel>Género</SelectLabel>
                    <SelectItem label="MASCULINO" value="MASCULINO">
                      MASCULINO
                    </SelectItem>
                    <SelectItem label="FEMENINO" value="FEMENINO">
                      FEMENINO
                    </SelectItem>
                    <SelectItem label="OTRO" value="OTRO">
                      OTRO
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              </View>
              <DatePicker
                id="birthDate"
                value={birthDate}
                onChange={setBirthDate}
                placeholder="Selecciona tu fecha de nacimiento"
                mode="date"
                maximumDate={maxDate}
                minimumDate={minDate}
              />
            </View>

            <Button className="w-full" onPress={onSubmit}>
              <Text>Continuar</Text>
            </Button>
          </View>
          <Text className="text-center text-sm mb-5">
            Ya tienes una cuenta?{" "}
            <Pressable
              onPress={() => {
                // TODO: Navigate to sign in screen
              }}
            >
              <Text className="text-sm underline underline-offset-4">
                Iniciar sesión
              </Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
