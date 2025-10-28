import { Icon } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Animated, View, type ViewProps } from 'react-native';

function Alert({
  className,
  variant = 'default',
  children,
  icon,
  iconClassName,
  isLoading = false, // 👈 Nuevo prop
  loadingSpin, // 👈 Nuevo prop para la animación
  ...props
}: ViewProps &
  React.RefAttributes<View> & {
    icon: LucideIcon;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    iconClassName?: string;
    isLoading?: boolean;
    loadingSpin?: Animated.AnimatedInterpolation<string | number>;
  }) {
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground',
        variant === 'destructive' && 'text-destructive',
        variant === 'success' && 'text-emerald-500',
        variant === 'warning' && 'text-yellow-500',
        variant === 'info' && 'text-sky-500',
        className
      )}>
      <View
        role="alert"
        className={cn(
          'bg-card border-border relative w-full rounded-lg border px-4 pb-2 pt-3.5',
          className
        )}
        {...props}>
        {/* 👇 Usa Animated.View solo cuando sea loading */}
        {isLoading && loadingSpin ? (
          <Animated.View 
            className="absolute left-3.5 top-3"
            style={{ transform: [{ rotate: loadingSpin }] }}
          >
            <Icon
              as={icon}
              className={cn('size-6', iconClassName)}
            />
          </Animated.View>
        ) : (
          <View className="absolute left-3.5 top-3">
            <Icon
              as={icon}
              className={cn(
                'size-6',
                variant === 'destructive' && 'text-destructive',
                variant === 'success' && 'text-emerald-500',
                variant === 'warning' && 'text-yellow-500',
                variant === 'info' && 'text-sky-500',
                iconClassName
              )}
            />
          </View>
        )}
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      className={cn('mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        'text-muted-foreground ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed',
        textClass?.includes('text-destructive') && 'text-destructive/90',
        textClass?.includes('text-emerald-500') && 'text-emerald-500/90',
        textClass?.includes('text-yellow-500') && 'text-yellow-500/90',
        textClass?.includes('text-sky-500') && 'text-sky-500/90',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
