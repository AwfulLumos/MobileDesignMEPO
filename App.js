/* eslint-disable import/no-unresolved */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import Screens
import DashboardScreen from "./components/DashboardScreen";
import DocumentScreen from "./components/DocumentScreen";
import IMessageScreen from "./components/IMessageScreen";
import AuctionScreen from "./components/AuctionScreen";
import MessagingPage from "./components/MessagingPage";
import NotificationScreen from "./components/NotificationScreen";

// Import Notification Context
import { NotificationProvider } from "./contexts/NotificationContext";

// Create navigation containers
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Helper function to get icon name based on route
const getTabIcon = (routeName) => {
  switch (routeName) {
    case "Dashboard":
      return "view-dashboard";
    case "Documents":
      return "file-document";
    case "i-Message":
      return "message-text";
    case "Auction":
      return "gavel";
    default:
      return "circle";
  }
};

// Bottom Tabs
const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => (
        <Icon name={getTabIcon(route.name)} size={size} color={color} />
      ),
      tabBarActiveTintColor: "#6200ea",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "bold",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Documents" component={DocumentScreen} />
    <Tab.Screen name="i-Message" component={IMessageScreen} />
    <Tab.Screen name="Auction" component={AuctionScreen} />
  </Tab.Navigator>
);

// Main App Navigation
export default function App() {
  return (
    <NotificationProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={({ route, navigation }) => {
              const routeName =
                getFocusedRouteNameFromRoute(route) ?? "Dashboard";
              return {
                headerShown: true,
                headerTitle: routeName,
                headerTitleAlign: "center",
                headerRight: () => (
                  <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate("Notification")}
                  >
                    <Icon name="bell-outline" size={24} color="#000" />
                  </TouchableOpacity>
                ),
              };
            }}
          />

          {/* Messaging Page */}
          <Stack.Screen
            name="MessagingPage"
            component={MessagingPage}
            options={{
              headerShown: true,
              headerTitle: "Chat",
              headerTitleAlign: "center",
            }}
          />

          {/* Notifications Page */}
          <Stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{
              headerShown: true,
              headerTitle: "Notification",
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}
