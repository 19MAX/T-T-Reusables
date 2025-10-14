import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

import { Oferta } from "@/hooks/useOffers";
import { convertFirestoreDate } from "@/utils/dateUtils";
import { getInitials } from "@/utils/stringUtils";

type FirestoreDate =
  | string
  | {
      _seconds: number;
      _nanoseconds: number;
    }
  | undefined;

// type Oferta = {
//   titulo: string;
//   precioPersonalizado?: number | string;
//   descripcionPersonalizada?: string;

//   imagenUrl?: string;

//   usuario?: {
//     nombreCompleto?: string;
//     email?: string;
//     fotoPerfil?: string;
//   };

//   servicio?: {
//     categoria?: string;
//   };

//   ubicacion?: {
//     ciudad?: string;
//     direccion?: string;
//     modalidad?: "presencial" | "remoto" | "ambas";
//   };

//   disponibilidad?: {
//     diasSemana?: string[];
//     horaInicio?: string;
//     horaFin?: string;
//   };

//   fechaInicioOferta?: FirestoreDate;
//   fechaFinOferta?: FirestoreDate;
// };

export function OfferDetailContent({
  oferta,
  modalidadText,
  colorScheme,
  onPressChat,
}: {
  oferta: Oferta;
  modalidadText: string;
  colorScheme: "light" | "dark" | string | undefined;
  onPressChat?: () => void;
}) {
  return (
    <View className="px-4 py-6 bg-background" style={{ paddingBottom: 120 }}>
      {/* Título y precio */}
      <View className="mb-6">
        <Text className="font-bold mb-2" variant="small">
          {oferta.titulo}
        </Text>
        {oferta.precioPersonalizado !== undefined && (
          <Text className="text-3xl font-bold text-primary">
            ${oferta.precioPersonalizado}
          </Text>
        )}
      </View>

      {/* Descripción */}
      {oferta.descripcionPersonalizada ? (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Descripción</Text>
          <Text className="text-muted-foreground leading-6">
            {oferta.descripcionPersonalizada}
          </Text>
        </View>
      ) : null}

      {/* Ofertante */}
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-lg font-semibold">Ofertante</Text>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center">
            <Avatar alt={oferta.usuario?.nombreCompleto || "Usuario"}>
              <AvatarImage
                source={{ uri: oferta.usuario?.fotoPerfil || undefined }}
              />
              <AvatarFallback>
                <Text>{getInitials(oferta.usuario?.nombreCompleto)}</Text>
              </AvatarFallback>
            </Avatar>

            <View className="ml-3 flex-1">
              <Text className="font-semibold text-base">
                {oferta.usuario?.nombreCompleto || "Sin nombre"}
              </Text>
              {!!oferta.usuario?.email && (
                <Text className="text-sm text-muted-foreground">
                  {oferta.usuario.email}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={onPressChat}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Detalles del Servicio */}
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-lg font-semibold">Detalles del Servicio</Text>
        </CardHeader>
        <CardContent className="gap-4">
          {/* Categoría */}
          <View className="flex-row items-center">
            <Ionicons
              name="folder-outline"
              size={20}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-muted-foreground">Categoría</Text>
              <Text className="font-medium">
                {oferta.servicio?.categoria || "No especificada"}
              </Text>
            </View>
          </View>

          <Separator />

          {/* Ubicación */}
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={20}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-muted-foreground">Ubicación</Text>
              <Text className="font-medium">
                {oferta.ubicacion?.ciudad || "—"}
                {oferta.ubicacion?.direccion
                  ? ` - ${oferta.ubicacion.direccion}`
                  : ""}
              </Text>
            </View>
          </View>

          <Separator />

          {/* Modalidad */}
          <View className="flex-row items-center">
            <Ionicons
              name="business-outline"
              size={20}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-muted-foreground">Modalidad</Text>
              <Text className="font-medium">{modalidadText}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Disponibilidad */}
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-lg font-semibold">Disponibilidad</Text>
        </CardHeader>
        <CardContent className="gap-4">
          {/* Días */}
          <View>
            <Text className="text-sm text-muted-foreground mb-2">
              Días disponibles
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {oferta.disponibilidad?.diasSemana?.length
                ? oferta.disponibilidad.diasSemana.map((dia) => (
                    <Badge key={dia} variant="secondary">
                      <Text className="capitalize">{dia}</Text>
                    </Badge>
                  ))
                : (
                  <Text className="text-muted-foreground">No especificado</Text>
                )}
            </View>
          </View>

          <Separator />

          {/* Horario */}
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={20}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
            <View className="ml-3">
              <Text className="text-sm text-muted-foreground">Horario</Text>
              <Text className="font-medium">
                {oferta.disponibilidad?.horaInicio && oferta.disponibilidad?.horaFin
                  ? `${oferta.disponibilidad.horaInicio} - ${oferta.disponibilidad.horaFin}`
                  : "No especificado"}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Vigencia */}
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-lg font-semibold">Vigencia de la Oferta</Text>
        </CardHeader>
        <CardContent className="gap-3">
          <View>
            <Text className="text-sm text-muted-foreground">Fecha de inicio</Text>
            <Text className="font-medium">
              {convertFirestoreDate(oferta.fechaInicioOferta)}
            </Text>
          </View>

          <View>
            <Text className="text-sm text-muted-foreground">
              Fecha de finalización
            </Text>
            <Text className="font-medium">
              {convertFirestoreDate(oferta.fechaFinOferta)}
            </Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

export default OfferDetailContent;
