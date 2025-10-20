import { useCreateOferta } from "@/hooks/useOffers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateOfertaFormData } from "../types";
import { fullOfertaSchema } from "../validations/ofertaSchema";
import StepAvailability from "./stepAvailability";
import StepBasicInfo from "./stepBasicInfo";
import StepLocation from "./stepLocation";
import StepPriceImage from "./stepPriceImage";
import StepServices from "./stepServices";

interface CreateOfertaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TOTAL_STEPS = 5;

const CreateOfertaForm = ({ onSuccess, onCancel }: CreateOfertaFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { createOferta, loading } = useCreateOferta();

  // Valores por defecto del formulario
  const methods = useForm<CreateOfertaFormData>({
    resolver: yupResolver(fullOfertaSchema) as any,
    mode: "onChange",
    defaultValues: {
      servicioId: "",
      titulo: "",
      descripcionPersonalizada: "",
      precioPersonalizado: undefined,
      imagen: undefined,
      disponibilidad: {
        diasSemana: [],
        horaInicio: "",
        horaFin: "",
      },
      ubicacion: {
        ciudad: "",
        direccion: "",
        modalidad: "presencial",
      },
    },
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel?.();
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = methods.getValues();
      
      const ofertaData = {
        servicioId: formData.servicioId,
        titulo: formData.titulo,
        descripcionPersonalizada: formData.descripcionPersonalizada,
        precioPersonalizado: formData.precioPersonalizado,
        imagen: formData.imagen,
        disponibilidad: formData.disponibilidad,
        ubicacion: formData.ubicacion,
      };

      await createOferta(ofertaData);
      
      Alert.alert(
        "¡Éxito!",
        "Tu oferta ha sido creada correctamente",
        [
          {
            text: "OK",
            onPress: () => {
              methods.reset();
              onSuccess?.();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo crear la oferta. Inténtalo de nuevo."
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepServices onNext={handleNext} />;
      case 2:
        return <StepBasicInfo onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepPriceImage onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepAvailability onNext={handleNext} onBack={handleBack} />;
      case 5:
        return (
          <StepLocation
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        {renderStep()}
      </SafeAreaView>
    </FormProvider>
  );
};

export default CreateOfertaForm;