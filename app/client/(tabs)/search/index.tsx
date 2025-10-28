import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

const SearchScreen = () => {
  return (
    <View className="flex-1">
      <Alert variant="destructive" icon={AlertCircleIcon}>
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          Please verify your billing information and try again.
        </AlertDescription>
      </Alert>
    </View>
  );
};

export default SearchScreen;
