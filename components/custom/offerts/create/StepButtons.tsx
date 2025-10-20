import { Text } from "@/components/ui/text";
import {
    TouchableOpacity,
    View
} from "react-native";

/**
 * StepButtons - Botones de navegación
 */
interface StepButtonsProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
}

export const StepButtons: React.FC<StepButtonsProps> = ({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastStep,
  isLoading = false,
  nextButtonText = isLastStep ? "Finalizar" : "Continuar",
  previousButtonText = "Atrás",
}) => {
  return (
    <View className="flex-row gap-3 px-4 py-4 mt-auto">
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-lg border border-border items-center justify-center ${
          !canGoPrevious ? "opacity-50" : ""
        }`}
        onPress={onPrevious}
        disabled={!canGoPrevious}
      >
        <Text className="text-foreground font-semibold">
          {previousButtonText}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-lg items-center justify-center ${
          canGoNext && !isLoading
            ? "bg-primary"
            : "bg-primary opacity-50"
        }`}
        onPress={onNext}
        disabled={!canGoNext || isLoading}
      >
        <Text className="text-primary-foreground font-semibold">
          {isLoading ? "Procesando..." : nextButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
