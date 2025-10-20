import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
}

const ProgressHeader = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
}: ProgressHeaderProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-4 py-6 border-b border-border">
      {/* Texto del paso */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm text-muted-foreground font-medium">
          Paso {currentStep} de {totalSteps}
        </Text>
        <Text className="text-sm text-muted-foreground font-medium">
          {Math.round(progress)}%
        </Text>
      </View>

      {/* Barra de progreso */}
      <Progress value={progress} className="h-2 mb-4" />

      {/* Título y subtítulo */}
      <Text className="text-2xl font-bold">{title}</Text>
      <Text className="text-muted-foreground mt-1">{subtitle}</Text>
    </View>
  );
};

export default ProgressHeader;