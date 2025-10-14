import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";

interface AlertProps {
  title?: string;
  description?: string | null;
  titleConfirmation?: string;
  titleCancel?: string;
  titleButton?: string;
  variantButton?: ButtonProps["variant"];
  iconName?: keyof typeof Ionicons.glyphMap;
  onpressConfirmation: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

const AlertCustom = ({
  title,
  description,
  titleConfirmation,
  titleCancel,
  titleButton,
  variantButton,
  iconName,
  onpressConfirmation,
  loading = false,
  disabled = false,
}: AlertProps) => {
  const { colorScheme } = useColorScheme();
  const isDisabled = disabled || loading;

  return (
    <AlertDialog className="flex-1">
      <AlertDialogTrigger asChild>
        <Button
          className="flex-1"
          variant={variantButton}
          disabled={isDisabled}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={colorScheme === "dark" ? "#000000" : "#ffffff"}
            />
          ) : (
            <Ionicons
              name={iconName}
              size={18}
              color={colorScheme === "dark" ? "#000000" : "#ffffff"}
            />
          )}
          <Text>{titleButton}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {titleCancel && (
            <AlertDialogCancel disabled={isDisabled}>
              <Text>{titleCancel}</Text>
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onPress={onpressConfirmation}
            disabled={isDisabled}
          >
            <View className="flex-row items-center gap-2">
              {loading && (
                <ActivityIndicator
                  size="small"
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
              )}
              <Text>{titleConfirmation}</Text>
            </View>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertCustom;
