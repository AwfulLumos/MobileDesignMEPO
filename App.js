/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import custom navigation components
import { BottomTabs, DrawerContent } from "./navbars/NavigationComponents";

// Screen imports
import MessagingPage from "./components/MessagingPage";
import NotificationScreen from "./components/NotificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import IMessageScreen from "./components/IMessageScreen";
import LoginScreen from "./components/LoginScreen";

import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Navigation containers
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const ProfileStack = createStackNavigator();
const MessageStack = createStackNavigator();
const AuthStack = createStackNavigator(); // Add this for authentication screens

const MessageStackNavigator = () => (
  <MessageStack.Navigator>
    <MessageStack.Screen
      name="IMessageScreen"
      component={IMessageScreen}
      options={{
        headerShown: true,
        headerTitle: "i-Message",
        headerTitleAlign: "center",
      }}
    />
    <MessageStack.Screen
      name="MessagingPage"
      component={MessagingPage}
      options={{
        headerShown: true,
        headerTitle: "Chat",
        headerTitleAlign: "center",
      }}
    />
  </MessageStack.Navigator>
);

// Profile Stack Navigator (Profile and Edit Profile)
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Profile",
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="menu" size={24} color="#000" />
          </TouchableOpacity>
        ),
      })}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: true,
        headerTitle: "Edit Profile",
        headerTitleAlign: "center",
      }}
    />
  </ProfileStack.Navigator>
);

// Authentication Stack Navigator
const AuthStackNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
    {/* Add other auth screens here if needed (Register, ForgotPassword, etc.) */}
  </AuthStack.Navigator>
);

// Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={BottomTabs}
      options={({ route, navigation }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";
        return {
          headerShown: true,
          headerTitle: routeName,
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            >
              <Icon name="menu" size={24} color="#000" />
            </TouchableOpacity>
          ),
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
    <Stack.Screen
      name="MessagingPage"
      component={MessagingPage}
      options={{
        headerShown: true,
        headerTitle: "Chat",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{
        headerShown: true,
        headerTitle: "Notification",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: true,
        headerTitle: "Edit Profile",
        headerTitleAlign: "center",
      }}
    />
  </Stack.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: 220,
        backgroundColor: "#3700b3",
      },
      drawerActiveTintColor: "#bb86fc",
      drawerInactiveTintColor: "#ffffff",
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
      drawerItemStyle: {
        borderRadius: 0,
        marginHorizontal: 0,
      },
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen name="Dashboard" component={MainStack} />
    <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
    <Drawer.Screen name="i-Message" component={MessageStackNavigator} />
  </Drawer.Navigator>
);

// Main App Navigation Component
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Navigation
export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}
