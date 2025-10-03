import { RegisterDataForm } from "@/components/custom/register-data-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const RegisterData = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-background"
      >
        <RegisterDataForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterData;
