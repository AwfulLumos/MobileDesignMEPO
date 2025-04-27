/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProfileHeader = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    console.log("Logged out");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.headerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.image}
        />
        <Text style={styles.name}>John Grim Doe</Text>
      </View>

      {/* Stall Number & Logout Button */}
      <View style={styles.rightSection}>
        <View style={styles.stallNumberContainer}>
          <Text style={styles.stallNumberText}>Stall Number: 19</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width, // Ensure full screen width
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  stallNumberContainer: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  stallNumberText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff", // White text
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default ProfileHeader;
