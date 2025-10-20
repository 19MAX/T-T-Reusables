import { useRouter } from "expo-router";
import { View } from "react-native";
import CreateOfertaForm from "./form";

const CreateOffertScreen = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Navegar a la pantalla de ofertas o donde necesites
    console.log("Oferta creada exitosamente");
    router.back(); // o router.push("/ofertas")
  };

  const handleCancel = () => {
    // Volver a la pantalla anterior
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <CreateOfertaForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </View>
  );
};

export default CreateOffertScreen;