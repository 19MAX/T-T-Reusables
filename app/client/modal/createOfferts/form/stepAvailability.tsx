import ProgressHeader from "@/components/custom/progressHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Controller, useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { CreateOfertaFormData, DIAS_SEMANA } from "../types";

interface StepAvailabilityProps {
  onNext: () => void;
  onBack: () => void;
}

const StepAvailability = ({ onNext, onBack }: StepAvailabilityProps) => {
  const {
    control,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<CreateOfertaFormData>();

  const selectedDays = watch("disponibilidad.diasSemana") || [];

  const handleContinue = async () => {
    const isValid = await trigger("disponibilidad");
    if (isValid) {
      onNext();
    }
  };

  // Función para formatear la hora mientras se escribe
  const formatTimeInput = (text: string, currentValue: string): string => {
    // Remover todo lo que no sea número
    const numbers = text.replace(/[^\d]/g, "");

    // Si está borrando, permitir
    if (text.length < currentValue.length) {
      return text;
    }

    // Formatear automáticamente
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      const hours = numbers.slice(0, 2);
      const minutes = numbers.slice(2);
      return `${hours}:${minutes}`;
    }

    // Limitar a 4 dígitos (HH:mm)
    const hours = numbers.slice(0, 2);
    const minutes = numbers.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  // Función para manejar haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View className="flex-1">
      {/* Header con Progress */}
      <ProgressHeader
        currentStep={4}
        totalSteps={5}
        title="Disponibilidad"
        subtitle="Define tu horario"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Días de la semana */}
          <View className="mb-6">
            <Label className="mb-3">Días disponibles *</Label>
            <Controller
              control={control}
              name="disponibilidad.diasSemana"
              render={({ field: { onChange, value = [] } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {DIAS_SEMANA.map((dia) => {
                    const isSelected = value.includes(dia.value);
                    return (
                      <Label
                        key={dia.value}
                        onPress={Platform.select({
                          native: () => {
                            triggerHaptic();
                            const newValue = isSelected
                              ? value.filter((d) => d !== dia.value)
                              : [...value, dia.value];
                            onChange(newValue);
                          },
                        })}
                        className={cn(
                          "web:hover:bg-accent/50 border-border flex flex-row rounded-lg border p-2",
                          // Cada elemento ocupa casi la mitad del ancho (50% - gap)
                          "w-18",
                          isSelected &&
                            "web:hover:bg-blue-50 border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            triggerHaptic();
                            const newValue = checked
                              ? [...value, dia.value]
                              : value.filter((d) => d !== dia.value);
                            onChange(newValue);
                          }}
                          checkedClassName="border-blue-600 bg-blue-600 dark:border-blue-700"
                          indicatorClassName="bg-blue-600 dark:bg-blue-700"
                          iconClassName="text-white"
                        />

                        <View className="flex-1">
                          <Text variant="small">{dia.label}</Text>
                        </View>
                      </Label>
                    );
                  })}
                </View>
              )}
            />
            {errors.disponibilidad?.diasSemana && (
              <Text className="text-destructive text-sm mt-2">
                {errors.disponibilidad.diasSemana.message}
              </Text>
            )}
          </View>

          {/* Horarios */}
          <View className="gap-6">
            {/* Hora de inicio */}
            <View>
              <Label nativeID="hora-inicio" className="mb-2">
                Hora de inicio *
              </Label>
              <Controller
                control={control}
                name="disponibilidad.horaInicio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="09:00"
                    value={value}
                    onChangeText={(text) => {
                      const formatted = formatTimeInput(text, value);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={5}
                    aria-labelledby="hora-inicio"
                    aria-errormessage="hora-inicio-error"
                    className={
                      errors.disponibilidad?.horaInicio
                        ? "border-destructive"
                        : ""
                    }
                  />
                )}
              />
              {errors.disponibilidad?.horaInicio && (
                <Text
                  nativeID="hora-inicio-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.disponibilidad.horaInicio.message}
                </Text>
              )}
              <Text className="text-muted-foreground text-xs mt-1">
                Formato de 24 horas (Ej: 09:00)
              </Text>
            </View>

            {/* Hora de fin */}
            <View>
              <Label nativeID="hora-fin" className="mb-2">
                Hora de fin *
              </Label>
              <Controller
                control={control}
                name="disponibilidad.horaFin"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="18:00"
                    value={value}
                    onChangeText={(text) => {
                      const formatted = formatTimeInput(text, value);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={5}
                    aria-labelledby="hora-fin"
                    aria-errormessage="hora-fin-error"
                    className={
                      errors.disponibilidad?.horaFin ? "border-destructive" : ""
                    }
                  />
                )}
              />
              {errors.disponibilidad?.horaFin && (
                <Text
                  nativeID="hora-fin-error"
                  className="text-destructive text-sm mt-1"
                >
                  {errors.disponibilidad.horaFin.message}
                </Text>
              )}
              <Text className="text-muted-foreground text-xs mt-1">
                Formato de 24 horas (Ej: 18:00)
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="px-4 py-4 border-t border-border flex-row gap-3">
        <Button onPress={onBack} variant="outline" className="flex-1">
          <Text className="font-semibold">Atrás</Text>
        </Button>
        <Button onPress={handleContinue} className="flex-1">
          <Text className="font-semibold">Continuar</Text>
        </Button>
      </View>
    </View>
  );
};

export default StepAvailability;
