import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Platform, View } from "react-native";

export function CheckboxPreview() {
  const [state, setState] = useState({
    termsChecked: true,
    terms2Checked: true,
    toggleChecked: false,
    toggle2Checked: false,
  });

  function toggleCheckedState(key: keyof typeof state) {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setState((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };
  }

  return (
    <View className="flex flex-col gap-6">
      <Label
        onPress={Platform.select({
          native: toggleCheckedState("toggle2Checked"),
        })}
        htmlFor="toggle-2"
        className={cn(
          "web:hover:bg-accent/50 border-border flex flex-row rounded-lg border p-3",
          state.toggle2Checked &&
            "web:hover:bg-blue-50 border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
        )}
      >
        <View className="flex flex-1 flex-row items-start gap-3">
          <Checkbox
            className="my-auto"
            id="toggle-2"
            checked={state.toggle2Checked}
            onCheckedChange={toggleCheckedState("toggle2Checked")}
            checkedClassName="border-blue-600 bg-blue-600 dark:border-blue-700"
            indicatorClassName="bg-blue-600 dark:bg-blue-700"
            iconClassName="text-white"
          />
          <View className="flex-1">
            <Text className="text-sm font-medium leading-none">
              Enable notifications
            </Text>
            <Text className="text-muted-foreground text-sm">
              You can enable or disable notifications at any time.
            </Text>
          </View>
        </View>
      </Label>
    </View>
  );
}
