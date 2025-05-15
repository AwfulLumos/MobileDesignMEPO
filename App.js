/* eslint-disable import/no-unresolved */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Text, Image } from "react-native";

// Import Screens
import DashboardScreen from "./components/DashboardScreen";
import DocumentScreen from "./components/DocumentScreen";
import IMessageScreen from "./components/IMessageScreen";
import AuctionScreen from "./components/AuctionScreen";
import MessagingPage from "./components/MessagingPage";
import NotificationScreen from "./components/NotificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";

// Import Notification Context
import { NotificationProvider } from "./contexts/NotificationContext";

// Navigation containers
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const ProfileStack = createStackNavigator(); // Separate stack for Profile

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

// Profile Stack Navigator (Profile and Edit Profile)
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={({ navigation }) => ({
        headerShown: false, // header na may lapis to kanina.
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
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Icon name="pencil" size={24} color="#000" />
          </TouchableOpacity>
        ),
      })}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: false,
        headerTitle: "Edit Profile",
        headerTitleAlign: "center",
      }}
    />
  </ProfileStack.Navigator>
);

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

// Drawer Content
const DrawerContent = (props) => (
  <View style={{ flex: 1, backgroundColor: "#6200ea" }}>
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* User Info Section */}
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Image
          source={{
            uri: "https://i.gifer.com/origin/c8/c8d864187433ac0cc77a5a2e057d52d4_w200.gif",
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: "#ffffff",
          }}
        />
        <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
          Awful Lumos
        </Text>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "400" }}>
          Satellite Market Stallholder
        </Text>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        label="Dashboard"
        onPress={() => props.navigation.navigate("Dashboard")}
        labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
        style={{
          borderRadius: 10,
        }}
      />
      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate("Profile")}
        labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
        style={{
          borderRadius: 10,
        }}
      />

      {/* Spacer to push logout at the bottom */}
      <View style={{ flex: 1 }} />

      {/* Logout Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e53935",
          paddingVertical: 10,
          marginHorizontal: 20,
          borderRadius: 5,
          marginBottom: 20,
          alignItems: "center",
        }}
        onPress={() => console.log("Logout pressed")}
      >
        <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  </View>
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

// Main App Navigation
export default function App() {
  return (
    <NotificationProvider>
      <NavigationContainer>
        {/* Drawer is now the root navigator */}
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
          {/* Main Stack (Tabs + Modal Screens) */}
          <Drawer.Screen name="Dashboard" component={MainStack} />

          {/* Profile Screen with its own stack for EditProfile */}
          <Drawer.Screen
            name="Profile"
            component={ProfileStackNavigator}
            options={{
              headerShown: true,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}
