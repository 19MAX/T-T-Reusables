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
import { View } from 'react-native';

export function IdentificationForm() {
  function onSubmit() {

    router.push('/auth/register/register-data');
    // TODO: Submit form and navigate to reset password screen if successful
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Empecemos</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu número de cedula
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Número de cédula</Label>
              <Input
                id="email"
                placeholder="1700000000"
                inputMode="numeric"
                maxLength={10}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <Button className="w-full" onPress={onSubmit}>
              <Text>Continuar</Text>
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              <Text>Volver al inicio de sesión</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
