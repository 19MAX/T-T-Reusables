import ProgressHeader from "@/components/custom/progressHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Controller, useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateOfertaFormData, MODALIDADES } from "../types";

interface StepLocationProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const StepLocation = ({ onSubmit, onBack, isSubmitting }: StepLocationProps) => {
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext<CreateOfertaFormData>();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  const handleSubmit = async () => {
    const isValid = await trigger("ubicacion");
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <View className="flex-1">
      {/* Header con Progress */}
      <ProgressHeader
        currentStep={5}
        totalSteps={5}
        title="Ubicación"
        subtitle="Finaliza tu oferta"
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
          {/* Ciudad */}
          <View className="mb-6">
            <Label nativeID="ciudad" className="mb-2">
              Ciudad *
            </Label>
            <Controller
              control={control}
              name="ubicacion.ciudad"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Ej: Quito"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  aria-labelledby="ciudad"
                  aria-errormessage="ciudad-error"
                  className={errors.ubicacion?.ciudad ? "border-destructive" : ""}
                />
              )}
            />
            {errors.ubicacion?.ciudad && (
              <Text
                nativeID="ciudad-error"
                className="text-destructive text-sm mt-1"
              >
                {errors.ubicacion.ciudad.message}
              </Text>
            )}
          </View>

          {/* Dirección */}
          <View className="mb-6">
            <Label nativeID="direccion" className="mb-2">
              Dirección (Opcional)
            </Label>
            <Controller
              control={control}
              name="ubicacion.direccion"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Ej: Av. América y República"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  aria-labelledby="direccion"
                  aria-errormessage="direccion-error"
                  className={
                    errors.ubicacion?.direccion ? "border-destructive" : ""
                  }
                />
              )}
            />
            {errors.ubicacion?.direccion && (
              <Text
                nativeID="direccion-error"
                className="text-destructive text-sm mt-1"
              >
                {errors.ubicacion.direccion.message}
              </Text>
            )}
          </View>

          {/* Modalidad con Select */}
          <View className="mb-6">
            <Label className="mb-2">Modalidad *</Label>
            <Controller
              control={control}
              name="ubicacion.modalidad"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={
                    value
                      ? {
                          value,
                          label:
                            MODALIDADES.find((m) => m.value === value)?.label ||
                            value,
                        }
                      : undefined
                  }
                  onValueChange={(option) => {
                    onChange(option?.value);
                  }}
                >
                  <SelectTrigger
                    className={
                      errors.ubicacion?.modalidad ? "border-destructive" : ""
                    }
                  >
                    <SelectValue
                      className="text-foreground text-sm native:text-lg"
                      placeholder="Selecciona una modalidad"
                    />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <SelectGroup>
                      {MODALIDADES.map((modalidad) => (
                        <SelectItem
                          key={modalidad.value}
                          label={modalidad.label}
                          value={modalidad.value}
                        >
                          {modalidad.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.ubicacion?.modalidad && (
              <Text className="text-destructive text-sm mt-2">
                {errors.ubicacion.modalidad.message}
              </Text>
            )}
          </View>

          {/* Info adicional */}
          <View className="bg-muted p-4 rounded-lg">
            <Text className="text-sm text-muted-foreground">
              💡 Revisa toda la información antes de crear tu oferta. Podrás
              editarla más tarde si es necesario.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="px-4 py-4 border-t border-border flex-row gap-3">
        <Button
          onPress={onBack}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        >
          <Text className="font-semibold">Atrás</Text>
        </Button>
        <Button
          onPress={handleSubmit}
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="font-semibold">Crear Oferta</Text>
          )}
        </Button>
      </View>
    </View>
  );
};

export default StepLocation;