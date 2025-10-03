import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
// import { Calendar } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  disabled = false,
  mode = "date",
  minimumDate,
  maximumDate,
  id,
}: DatePickerProps) {
  const [show, setShow] = useState(false);
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    value
  );
  const { colorScheme } = useColorScheme();

  // Solo actualizar si el valor externo es diferente
  useEffect(() => {
    if (value !== internalDate) {
      setInternalDate(value);
    }
  }, [value]); // Elimina internalDate de las dependencias

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android, el picker se cierra automáticamente
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      setInternalDate(selectedDate);
      onChange?.(selectedDate);
    } else if (event.type === "dismissed") {
      setShow(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";

    if (mode === "time") {
      return date.toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (mode === "datetime") {
      return date.toLocaleString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // mode === 'date'
    return date.toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePress = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  // En iOS, el picker se muestra inline debajo del input
  // En Android, se muestra como modal
  const showPicker = show || (Platform.OS === "ios" && show);

  return (
    <View>
      <Pressable onPress={handlePress} disabled={disabled}>
        <View pointerEvents="none">
          <Input
            id={id}
            value={formatDate(internalDate)}
            placeholder={placeholder}
            editable={false}
            // className={cn(disabled && "opacity-50")}
          />
        </View>
        <View className="absolute right-3 top-0 bottom-0 justify-center pointer-events-none">
          <Ionicons
            name="calendar"
            size={20}
            color={colorScheme === "dark" ? "#fff" : "#161616"}
          />
        </View>
      </Pressable>

      {showPicker && (
        <View className={cn(Platform.OS === "ios" && "mt-2")}>
          <DateTimePicker
            value={internalDate || new Date()}
            mode={mode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            themeVariant={colorScheme === "dark" ? "light" : "dark"}
            locale="es-EC"
          />
          {Platform.OS === "ios" && (
            <View className="flex-row justify-end gap-2 mt-2">
              <Pressable
                onPress={() => setShow(false)}
                className="bg-secondary px-4 py-2 rounded-md active:opacity-70"
              >
                <Text className="text-secondary-foreground">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => setShow(false)}
                className="bg-primary px-4 py-2 rounded-md active:opacity-70"
              >
                <Text className="text-primary-foreground">Confirmar</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
