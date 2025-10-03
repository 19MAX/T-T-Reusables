import { IdentificationForm } from '@/components/custom/identification-form'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

const Identification = () => {
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
        <IdentificationForm />

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Identification