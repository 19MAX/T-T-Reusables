import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Platform, View } from "react-native";

interface CardServicesProps {
  title?: string;
  description?: string;
  precio?: string | number;
  onPress?: () => void;
  checked?: boolean;
}

const CardServices = ({
  title,
  description,
  precio,
  onPress,
  checked = false,
}: CardServicesProps) => {
  const handleCheckedChange = (isChecked: boolean) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore en web o si no está disponible
    }
    onPress?.();
  };

  return (
    <View className="flex flex-col gap-6 px-4">
      <Label
        onPress={Platform.select({
          native: handleCheckedChange as any,
          default: undefined,
        })}
        htmlFor="toggle-2"
        className={cn(
          "web:hover:bg-accent/50 border-border flex flex-row rounded-lg border p-3",
          checked &&
            "web:hover:bg-blue-50 border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
        )}
      >
        <View className="flex flex-1 flex-row items-start gap-3">
          <Checkbox
            className="my-auto"
            id="toggle-2"
            checked={checked}
            onCheckedChange={handleCheckedChange}
            checkedClassName="border-blue-600 bg-blue-600 dark:border-blue-700"
            indicatorClassName="bg-blue-600 dark:bg-blue-700"
            iconClassName="text-white"
          />
          <View className="flex-1">
            <Text className="text-sm font-medium leading-none">{title}</Text>
            {description ? (
              <Text className="text-muted-foreground text-sm">
                {description}
              </Text>
            ) : null}
            {precio ? (
              <Text className="text-blue-600 font-semibold mt-1">{precio}</Text>
            ) : null}
          </View>
        </View>
      </Label>
    </View>
  );
};

export default CardServices;