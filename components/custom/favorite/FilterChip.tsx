import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Platform, View } from "react-native";

interface FilterChipProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  checked?: boolean;
}

const FilterChip = ({
  label,
  icon,
  onPress,
  checked = false,
}: FilterChipProps) => {
  const handleCheckedChange = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore en web o si no está disponible
    }
    onPress?.();
  };

  return (
    <Label
      onPress={Platform.select({
        native: handleCheckedChange as any,
        default: undefined,
      })}
      htmlFor={`filter-${label}`}
      className={cn(
        "web:hover:bg-accent/50 border-border flex flex-row items-center rounded-xl border px-4 py-2.5 min-w-fit",
        checked &&
          "web:hover:bg-primary/90 border-primary bg-primary dark:border-primary dark:bg-primary"
      )}
    >
      <View className="flex flex-row items-center gap-2">
        {/* <Checkbox
          id={`filter-${label}`}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          className="h-5 w-5"
          checkedClassName="border-white bg-white dark:border-white dark:bg-white"
          indicatorClassName="bg-white dark:bg-white"
          iconClassName="text-primary"
        /> */}
        {icon && <View>{icon}</View>}
        <Text
          className={cn(
            "text-sm font-medium whitespace-nowrap",
            checked
              ? "text-primary-foreground"
              : "text-foreground"
          )}
        >
          {label}
        </Text>
      </View>
    </Label>
  );
};

export default FilterChip;