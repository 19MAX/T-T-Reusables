import { Text } from "@/components/ui/text";
import { Paquete } from "@/hooks/credits/paquetes";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { TouchableOpacity, View } from "react-native";

interface CardPaqueteProps {
  paquete: Paquete;
  onPress?: () => void;
  checked?: boolean;
}

const CardPaquete = ({
  paquete,
  onPress,
  checked = false,
}: CardPaqueteProps) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore en web o si no está disponible
    }
    onPress?.();
  };

  const formatPrecio = () => {
    const precio =
      paquete.descuento && paquete.descuento > 0
        ? paquete.precio! - (paquete.precio! * paquete.descuento) / 100
        : paquete.precio;

    return `$${precio?.toFixed(2)}`;
  };

  const calcularPrecioPorCredito = () => {
    const precio =
      paquete.descuento && paquete.descuento > 0
        ? paquete.precio! - (paquete.precio! * paquete.descuento) / 100
        : paquete.precio;

    const precioPorCredito = precio! / paquete.cantidadCreditos!;
    return `$${precioPorCredito.toFixed(2)} por crédito`;
  };

  const tienDescuento = paquete.descuento && paquete.descuento > 0;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="px-4 mb-3"
    >
      <View
        className={cn(
          "border rounded-2xl p-4 flex-row items-center justify-between relative",
          checked
            ? "border-green-500 bg-green-50 dark:bg-green-950/30"
            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        )}
      >
        {/* Columna izquierda: Icono y nombre del paquete */}
        <View className="flex-row items-center gap-3 flex-1">
          <Ionicons
            name="diamond"
            size={25}
            color={checked ? "#10b981" : "#6b7280"}
          />
          <View className="flex-1">
            <Text className="font-bold">
              {paquete.cantidadCreditos} Créditos
            </Text>
            <Text className="text-sm text-muted-foreground mt-0">
              {paquete.nombre || "Perfecto para empezar"}
            </Text>
          </View>
        </View>

        {/* Columna derecha: Precio y check */}
        <View className="items-end">
          <View className="flex-row items-center gap-2">
            <View className="items-end">
              {/* {tienDescuento && (
                <Text className="text-xs text-muted-foreground line-through">
                  ${paquete.precio?.toFixed(2)}
                </Text>
              )} */}
              <Text className="font-bold text-green-600 dark:text-green-400">
              ${paquete.precio?.toFixed(2)}
              </Text>
            </View>
            {checked && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
        </View>

        {/* Badge "Más Popular" */}
        {paquete.etiqueta && (
          <View className="absolute -top-2 left-48 bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              {paquete.etiqueta}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CardPaquete;
