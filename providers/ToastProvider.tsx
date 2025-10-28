import { Alert, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 4000;
const ANIMATION_DURATION = 300;

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: LucideIcon;
    variant: "default" | "destructive" | "success" | "warning" | "info";
  }
> = {
  success: {
    icon: CheckCircle2,
    variant: "success",
  },
  error: {
    icon: XCircle,
    variant: "destructive",
  },
  warning: {
    icon: AlertCircle,
    variant: "warning",
  },
  info: {
    icon: Info,
    variant: "info",
  },
  loading: {
    icon: Loader2,
    variant: "default",
  },
};

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [rotateAnim] = useState(new Animated.Value(0));

  const config = TOAST_CONFIG[toast.type];

  // Animación de rotación continua para el loader
  useEffect(() => {
    if (toast.type === "loading") {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [toast.type]);

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    if (toast.type !== "loading") {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration || TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  // Interpolación para la rotación
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="w-full"
    >
      <Alert
        variant={config.variant}
        icon={config.icon}
        isLoading={toast.type === "loading"} // 👈 Nuevo prop
        loadingSpin={spin} // 👈 Pasar la animación
      >
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1">
            <AlertTitle>{toast.message}</AlertTitle>
            {toast.action && (
              <Pressable
                onPress={() => {
                  toast.action!.onPress();
                  handleDismiss();
                }}
                className="mt-2 self-start active:opacity-70"
              >
                <Text className="text-sm font-semibold underline">
                  {toast.action.label}
                </Text>
              </Pressable>
            )}
          </View>
          {toast.type !== "loading" && (
            <Pressable
              onPress={handleDismiss}
              hitSlop={8}
              className="active:opacity-50"
            >
              <Icon as={X} size={20} />
            </Pressable>
          )}
        </View>
      </Alert>
    </Animated.View>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const insets = useSafeAreaInsets();

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration?: number) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
      return id; // 👈 Retornar el ID para poder removerlo después
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "success", duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "error", duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "info", duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "warning", duration),
    [showToast]
  );

  const promise = useCallback(
    async <T,>(
      promiseToResolve: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ): Promise<T> => {
      // 👇 Mostrar toast de loading
      const loadingId = showToast(messages.loading, "loading", 999999);

      try {
        const result = await promiseToResolve;

        // 👇 Remover loading y mostrar success
        removeToast(loadingId);
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success;
        showToast(successMessage, "success");

        return result;
      } catch (err) {
        // 👇 Remover loading y mostrar error
        removeToast(loadingId);
        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error;
        showToast(errorMessage, "error");

        throw err;
      }
    },
    [showToast, removeToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toast: showToast,
        success,
        error,
        info,
        warning,
        promise,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <View
          style={{ top: insets.top + 10 }}
          className="absolute left-4 right-4 z-50 gap-2"
          pointerEvents="box-none"
        >
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
