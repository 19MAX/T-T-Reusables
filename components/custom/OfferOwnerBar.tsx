import AlertCustom from "@/components/custom/dialog/alertCustom";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OfferOwnerBarProps = {
  onEdit: () => void;
  onPause: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  loadingPause?: boolean;
  loadingDelete?: boolean;
  estado?: "activa" | "pausada" | string;
};

export default function OfferOwnerBar({
  onEdit,
  onPause,
  onDelete,
  loadingPause = false,
  loadingDelete = false,
  estado = "activa",
}: OfferOwnerBarProps) {
  const insets = useSafeAreaInsets();

  const isActiva = estado === "activa";
  const pauseText = isActiva ? "Pausar" : "Reanudar";
  const pauseDescription = isActiva
    ? "¿Deseas pausar esta oferta? No será visible para otros usuarios hasta que la reanudes."
    : "¿Deseas reanudar esta oferta? Volverá a estar visible para otros usuarios.";

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-border bg-background"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-row gap-3">
        {/* Editar */}
        <AlertCustom
          title="Editar"
          description="¿Deseas editar la información de esta oferta?"
          titleConfirmation="Ir a editar"
          titleCancel="Cancelar"
          titleButton="Editar"
          onpressConfirmation={onEdit}
          variantButton="secondary"
          iconName="create"
        />

        {/* Pausar / Reanudar */}
        <AlertCustom
          title={pauseText}
          description={pauseDescription}
          titleConfirmation={loadingPause ? "Procesando..." : "Confirmar"}
          titleCancel="Cancelar"
          titleButton={pauseText}
          onpressConfirmation={onPause}
          variantButton="default"
          iconName={isActiva ? "pause" : "play"}
          loading={loadingPause}
        />

        {/* Eliminar */}
        <AlertCustom
          title="Eliminar"
          description="¿Seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer."
          titleConfirmation={loadingDelete ? "Eliminando..." : "Confirmar"}
          titleCancel="Cancelar"
          titleButton="Eliminar"
          onpressConfirmation={onDelete}
          variantButton="destructive"
          iconName="trash"
          loading={loadingDelete}
        />
      </View>
    </View>
  );
}
