/* eslint-disable prettier/prettier */
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture and Name */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://i.gifer.com/origin/c8/c8d864187433ac0cc77a5a2e057d52d4_w200.gif",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Awful Lumos</Text>
        <Text style={styles.profileRole}>Satellite Market Stallholder</Text>
      </View>

      {/* Profile Information */}
      {/* Profile Information */}
      <View style={styles.profileInfo}>
        {/* Registrant Info */}
        <Text style={styles.sectionTitle}>Registrant Information</Text>
        <Text style={styles.label}>Full Name: Awful M. Lumos</Text>
        <Text style={styles.label}>
          Address: Block 30 Lot 10, Zone 5, Barangay Concepcion Pequeña, Naga
          City, Camarines Sur, 4400, Philippines
        </Text>
        <Text style={styles.label}>Contact Number: 09123456789</Text>
        <Text style={styles.label}>Username: awful_lumos_30</Text>
        <Text style={styles.label}>Password: **********</Text>

        {/* Applicant Info */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Applicant Information
        </Text>
        <Text style={styles.label}>Birth Date: 01/01/1995</Text>
        <Text style={styles.label}>Civil Status: Single</Text>
        <Text style={styles.label}>
          Educational Attainment: College Graduate
        </Text>
        <Text style={styles.label}>Nature of Business: Dry Goods Retail</Text>
        <Text style={styles.label}>Capitalization: ₱10,000</Text>
        <Text style={styles.label}>Source of Capital: Personal Savings</Text>

        {/* Stallholder Subscription */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Subscription Details
        </Text>
        <Text style={styles.label}>Subscription Valid Until: 25/05/2025</Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Icon name="pencil" size={16} color="#fff" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6200ea",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ea",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  profileInfo: {
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    marginVertical: 5,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 10,
  },
});

export default ProfileScreen;
