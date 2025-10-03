import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function ForgotPasswordScreen() {
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
        <ForgotPasswordForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
