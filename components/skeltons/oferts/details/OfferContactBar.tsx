import AlertCustom from "@/components/custom/dialog/alertCustom";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OfferContactBarProps = {
  creditLoading: boolean;
  creditError?: string | null;
  creditSuccess?: boolean;
  creditMessage?: string | null;
  onConfirm: () => Promise<void> | void; // función que se ejecuta al confirmar
  disabled?: boolean;
};

export default function OfferContactBar({
  creditLoading,
  creditError,
  creditSuccess,
  creditMessage,
  onConfirm,
  disabled = false,
}: OfferContactBarProps) {
  const insets = useSafeAreaInsets();

  // Mensaje que se muestra en el AlertCustom (prioridad: success -> error -> default)
  const getDescription = () => {
    if (creditSuccess && creditMessage) return creditMessage;
    if (creditError) return creditError;
    return "¿Deseas contactar a este profesional? Se descontará un crédito de tu cuenta.";
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-border bg-background"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-row gap-3">
        <AlertCustom
          title="Contactar"
          description={getDescription()}
          titleConfirmation={creditLoading ? "Procesando..." : "Confirmar"}
          titleCancel="Cancelar"
          titleButton={creditLoading ? "Cargando..." : "Contactar"}
          onpressConfirmation={onConfirm}
          variantButton="default"
          iconName="diamond"
          loading={creditLoading}
          disabled={disabled || creditLoading}
        />
      </View>
    </View>
  );
}
