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
        name="buyCredits/index"
        options={{
          title: "Comprar Créditos",
          headerShown: true,
          // header: () => <CustomModalHeader title="Comprar Créditos" />,
        }}
      />

    </Stack>
  );
};

export default ModalsLayout;
