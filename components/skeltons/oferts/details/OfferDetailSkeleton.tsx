import { Skeleton } from "@/components/ui/skeleton";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfferDetailSkeleton() {
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
          <Skeleton className="h-32 w-full rounded-lg mb-6" />
        </View>
      </ScrollView>
    </View>
  );
}
