import { HelpHoverCard } from "@/components/custom/HelpHoverCard";
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
      <Stack.Screen
        name="profile/index"
        options={{
          title: "Opciones de edición",
          headerShown: true,

          headerRight: () => (
            <HelpHoverCard
              icono="Info"
              titulo="¿Necesitas Ayuda?"
              descripcion="Los cambios que realices se guardarán inmediatamente y se reflejarán en tu perfil. Si tienes dudas, contacta a soporte."
            />
          ),
          // header: () => <CustomModalHeader title="Comprar Créditos" />,
        }}
      />

      <Stack.Screen
        name="profile/edit/personal-info"
        options={{
          title: "Editar Información Personal",
          headerShown: true,

          headerRight: () => (
            <HelpHoverCard
              icono="ShieldCheck"
              titulo="Tu información esta segura"
              descripcion="Estos datos solo serán visibles para ti y los administradores de la plataforma. No se compartirán públicamente"
            />
          ),
          // header: () => <CustomModalHeader title="Comprar Créditos" />,
        }}
      />
      <Stack.Screen
        name="profile/edit/additional-info"
        options={{
          title: "Información Adicional",
          headerShown: true,

          headerRight: () => (
            <HelpHoverCard
              icono="Info"
              titulo="Información opcional"
              descripcion="Completa esta información para mejorar tu perfil y ayudarnos a conectarte con las mejores oportunidades laborales."
            />
          ),
          // header: () => <CustomModalHeader title="Comprar Créditos" />,
        }}
      />
    </Stack>
  );
};

export default ModalsLayout;
