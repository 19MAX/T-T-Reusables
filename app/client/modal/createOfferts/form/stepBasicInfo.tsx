import ProgressHeader from "@/components/custom/progressHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { CreateOfertaFormData } from "../types";

interface StepBasicInfoProps {
  onNext: () => void;
  onBack: () => void;
}

const StepBasicInfo = ({ onNext, onBack }: StepBasicInfoProps) => {
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext<CreateOfertaFormData>();

  const handleContinue = async () => {
    const isValid = await trigger(["titulo", "descripcionPersonalizada"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <View className="flex-1">
      {/* Header con Progress */}
      <ProgressHeader
        currentStep={2}
        totalSteps={5}
        title="Información básica"
        subtitle="Describe tu oferta"
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
          {/* Título */}
          <View className="mb-6">
            <Label nativeID="titulo" className="mb-2">
              Título de la oferta *
            </Label>
            <Controller
              control={control}
              name="titulo"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Ej: Clases de piano para principiantes"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  aria-labelledby="titulo"
                  aria-errormessage="titulo-error"
                  className={errors.titulo ? "border-destructive" : ""}
                />
              )}
            />
            {errors.titulo && (
              <Text
                nativeID="titulo-error"
                className="text-destructive text-sm mt-1"
              >
                {errors.titulo.message}
              </Text>
            )}
          </View>

          {/* Descripción */}
          <View className="mb-6">
            <Label nativeID="descripcion" className="mb-2">
              Descripción personalizada (Opcional)
            </Label>
            <Controller
              control={control}
              name="descripcionPersonalizada"
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  placeholder="Agrega detalles adicionales sobre tu servicio..."
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  aria-labelledby="descripcion"
                  aria-errormessage="descripcion-error"
                  className={
                    errors.descripcionPersonalizada
                      ? "border-destructive min-h-[120px]"
                      : "min-h-[120px]"
                  }
                  numberOfLines={5}
                  multiline
                />
              )}
            />
            {errors.descripcionPersonalizada && (
              <Text
                nativeID="descripcion-error"
                className="text-destructive text-sm mt-1"
              >
                {errors.descripcionPersonalizada.message}
              </Text>
            )}
            <Text className="text-muted-foreground text-xs mt-1">
              Máximo 500 caracteres
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
        >
          <Text className="font-semibold">Atrás</Text>
        </Button>
        <Button onPress={handleContinue} className="flex-1">
          <Text className="font-semibold">Continuar</Text>
        </Button>
      </View>
    </View>
  );
};

export default StepBasicInfo;