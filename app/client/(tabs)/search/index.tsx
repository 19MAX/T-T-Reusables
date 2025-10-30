import { OfertaCardList } from "@/components/custom/OfertaCard";
import FilterChip from "@/components/custom/favorite/FilterChip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Oferta, useOffers } from "@/hooks/useOffers";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  const { ofertas, loading, refetch } = useOffers();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [modalityOpen, setModalityOpen] = useState(false);

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = ofertas
      .map((o) => o.servicio?.categoria)
      .filter((c): c is string => !!c);
    return Array.from(new Set(cats));
  }, [ofertas]);

  // Filtrar ofertas
  const filteredOfertas = useMemo(() => {
    let filtered = [...ofertas];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (oferta) =>
          oferta.titulo?.toLowerCase().includes(query) ||
          oferta.descripcionPersonalizada?.toLowerCase().includes(query) ||
          oferta.servicio?.titulo?.toLowerCase().includes(query) ||
          oferta.servicio?.descripcion?.toLowerCase().includes(query) ||
          oferta.servicio?.categoria?.toLowerCase().includes(query) ||
          oferta.ubicacion?.ciudad?.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(
        (oferta) => oferta.servicio?.categoria === selectedCategory
      );
    }

    // Filtro por modalidad
    if (selectedModality) {
      filtered = filtered.filter(
        (oferta) => oferta.ubicacion?.modalidad === selectedModality
      );
    }

    return filtered;
  }, [ofertas, searchQuery, selectedCategory, selectedModality]);

  const handleOfertaPress = (oferta: Oferta) => {
    if (oferta.id) {
      router.push(`/client/offerts/${oferta.id}`);
    }
  };

  const handleCategorySelect = (category: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleModalitySelect = (modality: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    
    if (selectedModality === modality) {
      setSelectedModality(null);
    } else {
      setSelectedModality(modality);
    }
  };

  const clearFilters = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedModality(null);
    setCategoryOpen(false);
    setModalityOpen(false);
  };

  const hasActiveFilters =
    searchQuery.trim() || selectedCategory || selectedModality;

  const renderEmptyState = () => {
    if (loading) return null;
    return (
      <View className="flex-1 items-center justify-center px-8 py-4">
        <View className="bg-muted rounded-full p-8 mb-6">
          <Ionicons
            name={hasActiveFilters ? "search-outline" : "compass-outline"}
            size={54}
            color={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
        </View>
        <Text className="text-2xl font-bold text-center mb-2">
          {hasActiveFilters ? "Sin resultados" : "Explora ofertas"}
        </Text>
        <Text className="text-base text-muted-foreground text-center">
          {hasActiveFilters
            ? "No encontramos ofertas que coincidan con tu búsqueda. Intenta con otros términos."
            : "Busca servicios por nombre, categoría o ubicación"}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={clearFilters}
            className="mt-6 bg-primary px-6 py-3 rounded-full"
          >
            <Text className="text-primary-foreground font-semibold">
              Limpiar filtros
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header con Search Input - Estático */}
      <View className="bg-background border-b border-border">
        <View className="px-4 pt-4 pb-3">
          {/* Search Input */}
          <View className="relative mb-3">
            <Ionicons
              name="search"
              size={20}
              color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              style={{
                position: "absolute",
                left: 16,
                top: 14,
                zIndex: 1,
              }}
            />
            <Input
              placeholder="Buscar una oferta..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-12 pr-12 h-12 rounded-2xl"
            />
            {searchQuery.trim() && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 16,
                  top: 14,
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Buttons - ScrollView Horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            className="flex-row"
          >
            {/* Category Collapsible Trigger */}
            <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
              <CollapsibleTrigger asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className={cn(
                    "flex-row items-center gap-1.5 px-4 py-2 rounded-xl border",
                    selectedCategory || categoryOpen
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  )}
                >
                  {/* <Ionicons
                    name="pricetag"
                    size={16}
                    color={
                      selectedCategory || categoryOpen
                        ? "white"
                        : colorScheme === "dark"
                        ? "#ffffff"
                        : "#000000"
                    }
                  /> */}
                  <Text
                    className={cn(
                      "text-sm font-medium",
                      selectedCategory || categoryOpen
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {selectedCategory || "Categoría"}
                  </Text>
                  {/* {selectedCategory && (
                    <View className="ml-1 h-5 w-5 rounded-full items-center justify-center bg-white/20">
                      <Text className="text-xs text-white font-semibold">
                        1
                      </Text>
                    </View>
                  )} */}
                  <Ionicons
                    name={categoryOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={
                      selectedCategory || categoryOpen
                        ? "white"
                        : colorScheme === "dark"
                        ? "#ffffff"
                        : "#000000"
                    }
                  />
                </TouchableOpacity>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Modality Collapsible Trigger */}
            <Collapsible open={modalityOpen} onOpenChange={setModalityOpen}>
              <CollapsibleTrigger asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className={cn(
                    "flex-row items-center gap-1.5 px-4 py-2 rounded-xl border",
                    selectedModality || modalityOpen
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  )}
                >
                  {/* <Ionicons
                    name={
                      selectedModality === "presencial"
                        ? "business"
                        : selectedModality === "virtual"
                        ? "videocam"
                        : selectedModality === "ambas"
                        ? "git-merge"
                        : "location"
                    }
                    size={16}
                    color={
                      selectedModality || modalityOpen
                        ? "white"
                        : colorScheme === "dark"
                        ? "#ffffff"
                        : "#000000"
                    }
                  /> */}
                  <Text
                    className={cn(
                      "text-sm font-medium",
                      selectedModality || modalityOpen
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {selectedModality
                      ? selectedModality.charAt(0).toUpperCase() +
                        selectedModality.slice(1)
                      : "Modalidad"}
                  </Text>
                  {/* {selectedModality && (
                    <View className="ml-1 h-5 w-5 rounded-full items-center justify-center bg-white/20">
                      <Text className="text-xs text-white font-semibold">
                        1
                      </Text>
                    </View>
                  )} */}
                  <Ionicons
                    name={modalityOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={
                      selectedModality || modalityOpen
                        ? "white"
                        : colorScheme === "dark"
                        ? "#ffffff"
                        : "#000000"
                    }
                  />
                </TouchableOpacity>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearFilters}
                activeOpacity={0.7}
                className="flex-row items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive bg-destructive/10"
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colorScheme === "dark" ? "#ef4444" : "#dc2626"}
                />
                <Text className="text-sm font-medium text-destructive">
                  Limpiar
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Active Filters Summary with Badges */}
          {hasActiveFilters && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              className="mt-3"
            >
              {/* {searchQuery.trim() && (
                <Badge className="flex-row items-center gap-1.5 px-2.5 py-1.5">
                  <Ionicons name="search" size={12} color="white" />
                  <Text className="text-xs font-medium">
                    {searchQuery.length > 20
                      ? searchQuery.substring(0, 20) + "..."
                      : searchQuery}
                  </Text>
                </Badge>
              )} */}
              {/* {selectedCategory && (
                <Badge className="flex-row items-center gap-1.5 px-2.5 py-1.5">
                  <Ionicons name="pricetag" size={12} color="white" />
                  <Text className="text-xs font-medium">{selectedCategory}</Text>
                </Badge>
              )}
              {selectedModality && (
                <Badge className="flex-row items-center gap-1.5 px-2.5 py-1.5">
                  <Ionicons
                    name={
                      selectedModality === "presencial"
                        ? "business"
                        : selectedModality === "virtual"
                        ? "videocam"
                        : "git-merge"
                    }
                    size={12}
                    color="white"
                  />
                  <Text className="text-xs font-medium">
                    {selectedModality.charAt(0).toUpperCase() +
                      selectedModality.slice(1)}
                  </Text>
                </Badge>
              )} */}
            </ScrollView>
          )}
        </View>

        {/* Category Filter - Collapsible Content */}
        <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
          <CollapsibleContent>
            <View className="px-4 py-3 bg-muted/30 border-t border-border">
              <Text className="text-xs font-semibold text-muted-foreground mb-3">
                Selecciona una categoría
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 16 }}
              >
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    label={category}
                    // icon={
                    //   <Ionicons
                    //     name="pricetag"
                    //     size={14}
                    //     color={
                    //       selectedCategory === category
                    //         ? "white"
                    //         : colorScheme === "dark"
                    //         ? "#ffffff"
                    //         : "#000000"
                    //     }
                    //   />
                    // }
                    checked={selectedCategory === category}
                    onPress={() => handleCategorySelect(category)}
                  />
                ))}
              </ScrollView>
            </View>
          </CollapsibleContent>
        </Collapsible>

        {/* Modality Filter - Collapsible Content */}
        <Collapsible open={modalityOpen} onOpenChange={setModalityOpen}>
          <CollapsibleContent>
            <View className="px-4 py-3 bg-muted/30 border-t border-border">
              <Text className="text-xs font-semibold text-muted-foreground mb-3">
                Selecciona modalidad
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 16 }}
              >
                {[
                  { value: "presencial", icon: "business" },
                  { value: "virtual", icon: "videocam" },
                  { value: "ambas", icon: "git-merge" },
                ].map((modality) => (
                  <FilterChip
                    key={modality.value}
                    label={
                      modality.value.charAt(0).toUpperCase() +
                      modality.value.slice(1)
                    }
                    // icon={
                    //   <Ionicons
                    //     name={modality.icon as any}
                    //     size={14}
                    //     color={
                    //       selectedModality === modality.value
                    //         ? "white"
                    //         : colorScheme === "dark"
                    //         ? "#ffffff"
                    //         : "#000000"
                    //     }
                    //   />
                    // }
                    checked={selectedModality === modality.value}
                    onPress={() => handleModalitySelect(modality.value)}
                  />
                ))}
              </ScrollView>
            </View>
          </CollapsibleContent>
        </Collapsible>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Results Count */}
        {/* {(hasActiveFilters || ofertas.length > 0) && (
          <View className="px-4 py-3 bg-muted/30">
            <View className="flex-row items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1">
                <Text className="text-sm font-bold">
                  {filteredOfertas.length}
                </Text>
              </Badge>
              <Text className="text-sm text-muted-foreground">
                {filteredOfertas.length === 1
                  ? "oferta disponible"
                  : "ofertas disponibles"}
              </Text>
            </View>
          </View>
        )} */}

        {/* Results */}
        {filteredOfertas.length === 0 ? (
          renderEmptyState()
        ) : (
          <View className="py-4">
            <OfertaCardList
              ofertas={filteredOfertas}
              variant="horizontal"
              onOfertaPress={handleOfertaPress}
              isLoading={loading && ofertas.length === 0}
              skeletonCount={5}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;