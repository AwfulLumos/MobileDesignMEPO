/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import supabase from "../supabaseClient";

// Import screens for Bottom Tabs
import DashboardScreen from "../components/DashboardScreen";
import DocumentScreen from "../components/DocumentScreen";
import AuctionScreen from "../components/AuctionScreen";

const Tab = createBottomTabNavigator();

// Function to get icon name based on route
export const getTabIcon = (routeName) => {
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

// Bottom Tabs Navigator
export const BottomTabs = () => (
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
    <Tab.Screen name="Auction" component={AuctionScreen} />
  </Tab.Navigator>
);

export const DrawerContent = (props) => {
  const [fullName, setFullName] = useState("Loading...");

  useEffect(() => {
    const fetchRegistrantName = async () => {
      const { data, error } = await supabase
        .from("registrant")
        .select("full_name")
        .eq("registration_id", 1)
        .single();

      if (error) {
        console.error("Error fetching registrant:", error);
        setFullName("Unknown User");
      } else {
        setFullName(data.full_name);
      }
    };

    fetchRegistrantName();
  }, []);

  const Divider = () => <View style={styles.divider} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#002181" }}>
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
            {fullName}
          </Text>
          <Text style={{ color: "white", fontSize: 12, fontWeight: "400" }}>
            Satellite Market Stallholder
          </Text>
        </View>

        {/* Section Label */}
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
            marginLeft: 17,
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Dashboard:
        </Text>

        {/* Drawer Items */}
        <DrawerItem
          label="Satellite Market"
          onPress={() => props.navigation.navigate("Dashboard")}
          labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
          style={{ borderRadius: 10 }}
        />
        <DrawerItem
          label="NCPM"
          onPress={() => {
            props.setSelectedMarket("NCPM");
            props.navigation.navigate("Dashboard");
          }}
          labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
          style={{ borderRadius: 10 }}
        />

        <Divider />

        <DrawerItem
          label="Profile"
          onPress={() => props.navigation.navigate("Profile")}
          labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
          style={{ borderRadius: 10 }}
        />
        <DrawerItem
          label="i-Message"
          onPress={() => props.navigation.navigate("i-Message")}
          labelStyle={{ color: "white", fontSize: 14, fontWeight: "bold" }}
          style={{ borderRadius: 10 }}
        />

        <Divider />

        <View style={{ flex: 1 }} />

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
};

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: "white",
    opacity: 1,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
