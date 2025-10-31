import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { View } from "react-native";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
}) => {
  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-3 px-4">
        {icon && (
          <View className="bg-primary/10 p-2 rounded-lg">
            <Ionicons name={icon} size={20} className="text-primary" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold">{title}</Text>
          {description && (
            <Text className="text-sm text-muted-foreground">{description}</Text>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="bg-card rounded-2xl border border-border p-4">
        {children}
      </View>
    </View>
  );
};