import { HeaderRightView } from "@/components/custom/HeaderRightView";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
    screenOptions={
      {
        headerBackTitle: 'Back',
        headerTitle(props) {
          return (
            <Text className="ios:font-medium android:mt-1.5 text-xl">
              {toOptions(props.children?.split('/').pop() ?? '')}
            </Text>
          );
        },
        headerRight: () => <HeaderRightView />,
      }
    }
    >
      <Stack.Screen name="login" options={{ title: "Buscar Trabajos" }}  />
      <Stack.Screen name="register" options={{ title: "Crear Perfil" }} />
      <Stack.Screen name="forgot" options={{ title: "Recuperar Contraseña" }} />
    </Stack>
  );
}

function toOptions(name: string) {
  const title = name
    .split('-')
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(' ');
  return title;
}
