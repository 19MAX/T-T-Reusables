import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SelectorBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: string[];
  selectedValue?: string;
  title: string;
  searchable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SelectorBottomSheet: React.FC<SelectorBottomSheetProps> = ({
  visible,
  onClose,
  onSelect,
  options,
  selectedValue,
  title,
  searchable = true,
  icon = "list",
}) => {
  const { colorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleSelect = async (value: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onSelect(value);
    onClose();
  };

  const handleClose = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1"
        />

        <View
          className="bg-card rounded-t-3xl border-t border-border"
          style={{ maxHeight: SCREEN_HEIGHT * 0.7 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="bg-primary/10 p-2 rounded-lg">
                <Ionicons
                  name={icon}
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
              </View>
              <Text className="text-lg font-bold">{title}</Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2 -mr-2"
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={24}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          {searchable && (
            <View className="p-4 border-b border-border">
              <View className="relative">
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
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="pl-12"
                />
              </View>
            </View>
          )}

          {/* Options List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {filteredOptions.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
                />
                <Text className="text-muted-foreground mt-4">
                  No se encontraron resultados
                </Text>
              </View>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValue === option;
                const isLast = index === filteredOptions.length - 1;

                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                    className={cn(
                      "flex-row items-center justify-between py-4 px-4",
                      !isLast && "border-b border-border",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base",
                        isSelected && "font-semibold text-primary"
                      )}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <View className="bg-primary p-1.5 rounded-full">
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="white"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};