import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Text } from "@/components/ui/text";
import * as LucideIcons from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

interface HelpHoverCardProps {
  titulo?: string;
  descripcion?: string;
  icono?: keyof typeof LucideIcons;
}

export function HelpHoverCard({
  titulo,
  descripcion,
  icono = "Info",
}: HelpHoverCardProps) {
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const IconComponent = LucideIcons[icono] ?? LucideIcons.HelpCircle;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="bg-muted rounded-full w-10 h-10">
          <Icon as={IconComponent} size={20} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent insets={contentInsets} className="w-80 bg-muted/95">
        <View className="flex flex-row justify-between gap-4">
          <View className="w-10 h-10 rounded-full bg-muted items-center justify-center">
            <Icon as={IconComponent} size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold mb-1">{titulo}</Text>
            <Text className="text-xs text-muted-foreground">{descripcion}</Text>
            {/* <Text className="text-muted-foreground text-xs">
              Joined December 2021
            </Text> */}
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}
