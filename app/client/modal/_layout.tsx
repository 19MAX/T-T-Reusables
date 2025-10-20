import { Stack } from "expo-router";

const ModalsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: "modal",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="myOfferts/index"
        options={{
          title: "Mis Ofertas",
        }}
      />
      <Stack.Screen
        name="createOfferts/index"
        options={{
          title: "Crear ofertas",
        }}
      />
      <Stack.Screen
        name="creditos/index"
        options={{
          headerShown: true,
          // header: () => <CustomModalHeader title="Comprar Créditos" />,
        }}
      />

      <Stack.Screen
        name="ofertas/index"
        options={{
          headerShown: true,
          // header: () => <CustomModalHeader title="Publicar Oferta" />,
        }}
      />
      <Stack.Screen
        name="servicio/index"
        options={{
          headerShown: true,
          // header: () => <CustomModalHeader title="Publicar Oferta" />,
        }}
      />
    </Stack>
  );
};

export default ModalsLayout;
