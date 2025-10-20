import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { Zoom } from 'react-native-reanimated-zoom';

interface ImageViewerProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black">
        {/* Botón de cerrar */}
        <View className="absolute z-10 bg-black/60 rounded-full w-11 h-11 items-center justify-center active:bg-black/80">
          <TouchableOpacity
            onPress={onClose}
            className="w-11 h-11 items-center justify-center mt-14 ml-5"
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Imagen con zoom */}
        {/* <View className="flex-1"> */}
          <Zoom>
            <Image
            // resizeMode="contain"
            source={{ uri: imageUri }}
            //   style={{ width: 300, height: 400 }}
              className="w-full h-full"
            />
          </Zoom>
        {/* </View> */}
      </View>
    </Modal>
  );
};
