import { HeaderRightView } from "@/components/custom/HeaderRightView";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <HeaderRightView />,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
          // header: () => (
          //   <ImprovedHeader
          //     variant="home"
          //     showUserGreeting={true}
          //     onNotificationPress={handleNotificationPress}
          //     onCreditsPress={handleCreditsPress}
          //     onProfilePress={handleProfilePress}
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: true,
          // header: () => (
          //   <ImprovedHeader
          //     variant="search"
          //     title="Buscar"
          //     showCredits={false}
          //     showFilter={true}
          //     onNotificationPress={handleNotificationPress}
          //     onFilterPress={handleFilterPress}
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="post/index"
        options={{
          title: "Publicar",

          tabBarIcon: ({ color, size, focused }) => (
            <View
              className={`w-14 h-8 rounded-full items-center justify-center ${
                focused ? "bg-blue-500 shadow-lg" : "bg-gray-200"
              }`}
            >
              <Ionicons
                name="add"
                size={24}
                color={focused ? "white" : color}
              />
            </View>
          ),
          headerShown: true,
          // header: () => (
          //   <ImprovedHeader
          //     title="Publicar"
          //     onNotificationPress={handleNotificationPress}
          //     onCreditsPress={handleCreditsPress}
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: true,
          // header: () => (
          //   <ImprovedHeader
          //     variant="detailed"
          //     title="Favoritos"
          //     showCredits={false}
          //     onNotificationPress={handleNotificationPress}
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: true,
          // header: () => (
          //   <ImprovedHeader
          //     variant="detailed"
          //     title="Perfil"
          //     onNotificationPress={handleNotificationPress}
          //     onCreditsPress={handleCreditsPress}
          //   />
          // ),
        }}
      />
      <Tabs.Screen
        name="ofertas/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="servicios/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
