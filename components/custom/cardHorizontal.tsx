import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";

interface oferta {
  href?: Href;
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const CardHorizontal = ({
  iconName,
  title,
  description,
  href,
  onPress
}: oferta) => {
  const { colorScheme } = useColorScheme();
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (href) {
      router.push(href);
    }
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="border-border border rounded-xl mx-4 p-4 flex-row items-center mb-4"
    >
      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
        <Ionicons name={iconName} size={28} color="#3B82F6" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="font-semibold" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={colorScheme === "dark" ? "#ffffff" : "#000000"}
      />
    </TouchableOpacity>
  );
};

export default CardHorizontal;
