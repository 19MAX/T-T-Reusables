import ProgressHeader from "@/components/custom/progressHeader";
import CardServices from "@/components/custom/services/cardServices";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useServices } from "@/hooks/services/useServices";
import { Controller, useFormContext } from "react-hook-form";
import { FlatList, View } from "react-native";
import { CreateOfertaFormData } from "../types";

interface Servicio {
  id?: string;
  titulo?: string;
  descripcion?: string;
  precio?: string | number;
}

interface StepServicesProps {
  onNext: () => void;
}

const StepServices = ({ onNext }: StepServicesProps) => {
  const { servicios, loading, error: serviceError } = useServices();
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext<CreateOfertaFormData>();

  const handleContinue = async () => {
    const isValid = await trigger("servicioId");
    if (isValid) {
      onNext();
    }
  };

  const renderItem = ({ item }: { item: Servicio }) => {
    const id = item.id ?? "";
    return (
      <Controller
        control={control}
        name="servicioId"
        render={({ field: { onChange, value } }) => (
          <CardServices
            title={item.titulo}
            description={item.descripcion}
            precio={item.precio}
            checked={value === id}
            onPress={() => onChange(id)}
          />
        )}
      />
    );
  };

  const keyExtractor = (item: Servicio, index: number) =>
    item.id || `servicio-${index}`;

  // Skeleton mejorado que muestra múltiples items
  if (loading) {
    return (
      <View className="flex-1">
        {/* Header Skeleton */}
        <View className="px-4 py-6 border-b border-border">
          <View className="flex-row items-center justify-between mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </View>
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-full" />
        </View>

        {/* Lista de Skeleton Cards */}
        <View className="px-4 py-4">
          {[1, 2, 3].map((index) => (
            <View
              key={index}
              className="border-border border rounded-xl px-4 py-4 flex-row items-center mb-4"
            >
              <Skeleton className="w-16 h-16 rounded-lg" />
              <View className="flex-1 ml-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-5 w-24" />
              </View>
              <Skeleton className="w-6 h-6 rounded-full" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (serviceError) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-destructive">{serviceError}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header con Progress */}
      <ProgressHeader
        currentStep={1}
        totalSteps={5}
        title="Selecciona un servicio"
        subtitle="Elige el servicio que deseas ofrecer"
      />

      {/* Lista de servicios */}
      <FlatList
        data={servicios}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-muted-foreground">
              No hay servicios disponibles
            </Text>
          </View>
        }
      />

      {/* Error message */}
      {errors.servicioId && (
        <View className="px-4 py-2 bg-destructive/10">
          <Text className="text-destructive text-sm">
            {errors.servicioId.message}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View className="px-4 py-4 border-t border-border">
        <Button onPress={handleContinue} className="w-full">
          <Text className="font-semibold">Continuar</Text>
        </Button>
      </View>
    </View>
  );
};

export default StepServices;