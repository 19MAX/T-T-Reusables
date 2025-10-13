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

interface AlertProps {
  title?: string;
  description?: string;
  titleConfirmation?: string;
  titleCancel?: string;
  titleButton?: string;
  variantButton?: ButtonProps["variant"];
  iconName?: keyof typeof Ionicons.glyphMap; // 👈 nombre del icono
  onpressConfirmation: () => void;
  // onpressCancel?: () => void;
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
  // onpressCancel,
}: AlertProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <AlertDialog className="flex-1">
      <AlertDialogTrigger asChild>
        <Button className="flex-1" variant={variantButton}>
          <Ionicons
            name={iconName}
            size={18}
            color={colorScheme === "dark" ? "#000000" : "#ffffff"}
          />
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
            <AlertDialogCancel>
              <Text>{titleCancel}</Text>
            </AlertDialogCancel>
          )}
          <AlertDialogAction onPress={onpressConfirmation}>
            <Text>{titleConfirmation}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertCustom;
