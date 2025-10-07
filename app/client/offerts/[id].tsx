import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useOfferDetail } from "@/hooks/useOffers";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
    Alert,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Utilidad para convertir Firestore timestamp
const convertFirestoreDate = (
  date: string | { _seconds: number; _nanoseconds: number } | undefined
): string => {
  if (!date) return "No disponible";

  if (typeof date === "object" && "_seconds" in date) {
    return new Date(date._seconds * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Utilidad para obtener iniciales
const getInitials = (name: string = "U"): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Skeleton de la pantalla
function OfferDetailSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <ScrollView className="flex-1">
        <View className="relative">
          <Skeleton className="w-full h-80" />
          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: insets.top + 8 }}
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </View>
        </View>

        <View className="px-4 py-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-20 mb-6" />

          <View className="mb-6">
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </View>

          <Skeleton className="h-32 w-full rounded-lg mb-6" />
          <Skeleton className="h-32 w-full rounded-lg mb-6" />
        </View>
      </ScrollView>

      <View
        className="px-4 py-4 border-t border-border bg-background"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row gap-3">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </View>
      </View>
    </View>
  );
}

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { oferta, loading, error } = useOfferDetail(id);

  const [showTraditionalHeader, setShowTraditionalHeader] = useState(false);
  const IMAGE_HEIGHT = 320;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = IMAGE_HEIGHT - 80;
    setShowTraditionalHeader(scrollY > threshold);
  };

  const handleContact = () => {
    if (oferta?.usuario?.email) {
      Alert.alert(
        "Contactar",
        `¿Deseas contactar a ${oferta.usuario.nombreCompleto}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Contactar",
            onPress: () => console.log("Contactar usuario"),
          },
        ]
      );
    }
  };

  const handleApply = () => {
    Alert.alert("Aplicar a oferta", "¿Deseas aplicar a esta oferta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aplicar",
        onPress: () => console.log("Aplicar a oferta"),
      },
    ]);
  };

  if (loading) {
    return <OfferDetailSkeleton />;
  }

  if (error || !oferta) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
        <Text className="text-lg font-semibold mt-4 text-center">
          {error || "Oferta no encontrada"}
        </Text>
        <Button
          onPress={() => router.back()}
          className="mt-6"
          variant="outline"
        >
          <Text>Volver</Text>
        </Button>
      </View>
    );
  }

  const modalidadText =
    {
      presencial: "Presencial",
      remoto: "Remoto",
      ambas: "Presencial y Remoto",
    }[oferta.ubicacion?.modalidad || ""] || "No especificado";

  return (
    <View className="flex-1 bg-background">
      {/* Status bar dinámico */}
      <StatusBar
        style={
          showTraditionalHeader
            ? colorScheme === "dark"
              ? "light"
              : "dark"
            : "light"
        }
        animated
      />

      {/* Header tradicional animado (aparece al scrollear) */}
      {showTraditionalHeader && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            paddingTop: insets.top,
          }}
          className="bg-background border-b border-border"
        >
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons
                name="arrow-back"
                size={24}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>

            <Text className="flex-1 font-semibold text-lg" numberOfLines={1}>
              {oferta.titulo}
            </Text>

            <TouchableOpacity>
              <Ionicons
                name="heart-outline"
                size={24}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botones flotantes fijos (desaparecen al scrollear) */}
      {!showTraditionalHeader && (
        <View
          style={{
            position: "absolute",
            top: insets.top + 8,
            left: 16,
            right: 16,
            zIndex: 5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black/50 backdrop-blur-sm rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Ionicons name="heart-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {/* Imagen principal con degradado superior */}
        <View style={{ height: IMAGE_HEIGHT }}>
          <Image
            source={{ uri: oferta.imagenUrl }}
            style={{ width: "100%", height: IMAGE_HEIGHT }}
            resizeMode="cover"
          />

          {/* Degradado superior solamente */}
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
        </View>

        {/* Contenido principal */}
        <View
          className="px-4 py-6 bg-background"
          style={{ paddingBottom: 120 }}
        >
          {/* Título y precio */}
          <View className="mb-6">
            <Text className="text-2xl font-bold mb-2">{oferta.titulo}</Text>
            <Text className="text-3xl font-bold text-primary">
              ${oferta.precioPersonalizado}
            </Text>
          </View>

          {/* Descripción */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3">Descripción</Text>
            <Text className="text-muted-foreground leading-6">
              {oferta.descripcionPersonalizada}
            </Text>
          </View>

          {/* Información del usuario */}
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
                    {oferta.usuario?.nombreCompleto}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {oferta.usuario?.email}
                  </Text>
                </View>

                <TouchableOpacity>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                  />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>

          {/* Detalles del servicio */}
          <Card className="mb-6">
            <CardHeader>
              <Text className="text-lg font-semibold">
                Detalles del Servicio
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="folder-outline"
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Categoría
                  </Text>
                  <Text className="font-medium">
                    {oferta.servicio?.categoria}
                  </Text>
                </View>
              </View>

              <Separator />

              <View className="flex-row items-center">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Ubicación
                  </Text>
                  <Text className="font-medium">
                    {oferta.ubicacion?.ciudad} - {oferta.ubicacion?.direccion}
                  </Text>
                </View>
              </View>

              <Separator />

              <View className="flex-row items-center">
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Modalidad
                  </Text>
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
              <View>
                <Text className="text-sm text-muted-foreground mb-2">
                  Días disponibles
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {oferta.disponibilidad?.diasSemana?.map((dia) => (
                    <Badge key={dia} variant="secondary">
                      <Text className="capitalize">{dia}</Text>
                    </Badge>
                  ))}
                </View>
              </View>

              <Separator />

              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
                <View className="ml-3">
                  <Text className="text-sm text-muted-foreground">Horario</Text>
                  <Text className="font-medium">
                    {oferta.disponibilidad?.horaInicio} -{" "}
                    {oferta.disponibilidad?.horaFin}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Fechas de la oferta */}
          <Card className="mb-6">
            <CardHeader>
              <Text className="text-lg font-semibold">
                Vigencia de la Oferta
              </Text>
            </CardHeader>
            <CardContent className="gap-3">
              <View>
                <Text className="text-sm text-muted-foreground">
                  Fecha de inicio
                </Text>
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

          {/* Estado */}
          <View className="mb-6">
            <Badge
              variant={oferta.estado === "activa" ? "default" : "secondary"}
              className="self-start"
            >
              <Text className="capitalize">{oferta.estado}</Text>
            </Badge>
          </View>
        </View>
      </ScrollView>

      {/* Botones de acción fijos en la parte inferior */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-border bg-background"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={handleContact}>
            <Ionicons name="chatbubble-outline" size={18} />
            <Text className="ml-2">Contactar</Text>
          </Button>

          <Button className="flex-1" onPress={handleApply}>
            <Text>Aplicar Ahora</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
