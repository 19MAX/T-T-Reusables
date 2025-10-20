import { Text } from "@/components/ui/text";
import {
    View
} from "react-native";

/**
 * StepHeader - Indicador visual del progreso
 */
interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="mb-6 px-4 pt-4">
      {/* Progress bar */}
      <View className="h-1 bg-muted rounded-full overflow-hidden mb-3">
        <View
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Step indicator */}
      <Text className="text-xs text-muted-foreground mb-2">
        Paso {currentStep} de {totalSteps}
      </Text>

      {/* Title and description */}
      <Text className="text-2xl font-bold text-foreground mb-1">
        {stepTitle}
      </Text>
      {stepDescription && (
        <Text className="text-sm text-muted-foreground">
          {stepDescription}
        </Text>
      )}
    </View>
  );
};