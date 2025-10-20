import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


/**
 * FormField - Componente reutilizable de input
 */
interface FormFieldProps {
  label: string;
  value: string | number;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  multiline?: boolean;
  maxLength?: number;
  editable?: boolean;
  required?: boolean;
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  multiline = false,
  maxLength,
  editable = true,
  required = false,
  helperText,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <Text className="text-destructive">*</Text>}
      </Text>

      <TextInput
        className={`border rounded-lg px-3 py-2 text-foreground ${
          error
            ? "border-destructive bg-destructive/5"
            : "border-border bg-card"
        } ${!editable ? "bg-muted text-muted-foreground" : ""}`}
        value={String(value)}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
        editable={editable}
        placeholderTextColor="#999"
        numberOfLines={multiline ? 4 : 1}
      />

      {error && (
        <Text className="text-xs text-destructive mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="text-xs text-muted-foreground mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};

/**
 * SelectButton - Botón de selección personalizado
 */
interface SelectButtonProps {
  label: string;
  value?: string;
  onPress: () => void;
  error?: string;
  required?: boolean;
  icon?: string;
}

export const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  value,
  onPress,
  error,
  required = false,
  icon = "chevron-down-outline",
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <Text className="text-destructive">*</Text>}
      </Text>

      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 ${
          error
            ? "border-destructive bg-destructive/5"
            : "border-border bg-card"
        }`}
        onPress={onPress}
      >
        <Text className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || "Seleccionar..."}
        </Text>
        <Ionicons name={icon} size={20} color="#999" />
      </TouchableOpacity>

      {error && (
        <Text className="text-xs text-destructive mt-1">{error}</Text>
      )}
    </View>
  );
};

/**
 * TimePickerField - Selector de tiempo
 */
interface TimePickerFieldProps {
  label: string;
  value: string;
  onChangeText: (time: string) => void;
  error?: string;
  required?: boolean;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <Text className="text-destructive">*</Text>}
      </Text>

      <TextInput
        className={`border rounded-lg px-3 py-3 text-foreground text-center font-mono ${
          error
            ? "border-destructive bg-destructive/5"
            : "border-border bg-card"
        }`}
        value={value}
        onChangeText={onChangeText}
        placeholder="HH:mm"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />

      {error && (
        <Text className="text-xs text-destructive mt-1">{error}</Text>
      )}
    </View>
  );
};

/**
 * DaySelector - Selector de días de la semana
 */
interface DaySelectorProps {
  selectedDays: string[];
  onToggleDay: (day: string) => void;
  error?: string;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onToggleDay,
  error,
}) => {
  const days = [
    { label: "L", value: "lunes" },
    { label: "M", value: "martes" },
    { label: "X", value: "miércoles" },
    { label: "J", value: "jueves" },
    { label: "V", value: "viernes" },
    { label: "S", value: "sábado" },
    { label: "D", value: "domingo" },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-3">
        Días disponibles <Text className="text-destructive">*</Text>
      </Text>

      <View className="flex-row justify-between gap-1">
        {days.map((day) => (
          <TouchableOpacity
            key={day.value}
            className={`flex-1 py-2 rounded-lg border items-center justify-center ${
              selectedDays.includes(day.value)
                ? "bg-primary border-primary"
                : "border-border bg-card"
            }`}
            onPress={() => onToggleDay(day.value)}
          >
            <Text
              className={`font-semibold ${
                selectedDays.includes(day.value)
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <Text className="text-xs text-destructive mt-2">{error}</Text>
      )}
    </View>
  );
};

/**
 * ModalidadSelector - Selector de modalidad (presencial, virtual, ambas)
 */
interface ModalidadSelectorProps {
  value: "presencial" | "virtual" | "ambas";
  onChange: (modalidad: "presencial" | "virtual" | "ambas") => void;
  error?: string;
}

export const ModalidadSelector: React.FC<ModalidadSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const modalidades = [
    { label: "Presencial", value: "presencial" as const, icon: "location" },
    { label: "Virtual", value: "virtual" as const, icon: "videocam" },
    { label: "Ambas", value: "ambas" as const, icon: "layers" },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-3">
        Modalidad <Text className="text-destructive">*</Text>
      </Text>

      <View className="gap-2">
        {modalidades.map((modalidad) => (
          <TouchableOpacity
            key={modalidad.value}
            className={`flex-row items-center border rounded-lg px-3 py-3 ${
              value === modalidad.value
                ? "bg-primary border-primary"
                : "border-border bg-card"
            }`}
            onPress={() => onChange(modalidad.value)}
          >
            <Ionicons
              name={modalidad.icon}
              size={20}
              color={value === modalidad.value ? "#fff" : "#666"}
              style={{ marginRight: 12 }}
            />
            <Text
              className={`flex-1 font-semibold ${
                value === modalidad.value
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {modalidad.label}
            </Text>
            {value === modalidad.value && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <Text className="text-xs text-destructive mt-2">{error}</Text>
      )}
    </View>
  );
};