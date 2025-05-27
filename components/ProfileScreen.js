/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import supabase from "../supabaseClient";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);

  // Extract the fetch function so it can be reused
  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("applicant")
        .select(
          `
    *,
    registrant!fk_applicant_registration (
    registration_id,
    full_name,
    address,
    contact_number,
    user_name,
    password
    ),
    stall (
      stall_no,
      stall_location,
      description,
      auction_date
    ),
    spouse_information (
      spouse_full_name,
      spouse_birth_date,
      spouse_educational_attainment,
      spouse_occupation,
      names_of_children
    )
  `
        )
        .eq("registration_id", "1"); // HARDCODED, MUST BE CHANGED WHEN THE INTEGRATION IS ALMOST COMPLETE.

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data && data.length > 0) {
        const applicant = data[0];

        // Simulate subscription valid until +1 year after auction
        const auctionDate = new Date(
          applicant.stall?.auction_date || new Date()
        );
        const subscriptionDate = new Date(auctionDate);
        subscriptionDate.setFullYear(auctionDate.getFullYear() + 1);

        setProfileData({
          registrant_id: applicant.registrant?.id,
          name: applicant.registrant?.full_name,
          address: applicant.registrant?.address,
          contact: applicant.registrant?.contact_number,
          username: applicant.registrant?.user_name,
          password: applicant.registrant?.password,

          birthDate: applicant.registrant_birth_date,
          civilStatus: applicant.registrant_civil_status,
          education: applicant.registrant_educational_attainment,
          businessNature: applicant.nature_of_business,
          capitalization: applicant.capitalization,
          sourceOfCapital: applicant.source_of_capital,

          stallNo: applicant.stall?.stall_no,
          stallLocation: applicant.stall?.stall_location,
          stallDescription: applicant.stall?.description,
          subscriptionEnd: subscriptionDate.toLocaleDateString(),

          spouseName: applicant.spouse_information?.spouse_full_name,
          spouseBirthDate: applicant.spouse_information?.spouse_birth_date,
          spouseEducation:
            applicant.spouse_information?.spouse_educational_attainment,
          spouseOccupation: applicant.spouse_information?.spouse_occupation,
          children: applicant.spouse_information?.names_of_children || [],
        });
      }
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 220 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://i.gifer.com/origin/c8/c8d864187433ac0cc77a5a2e057d52d4_w200.gif",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profileData.name}</Text>
        <Text style={styles.profileRole}>Satellite Market Stallholder</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("Profile", {
              screen: "EditProfile",
              params: { profileData },
            })
          }
        >
          <Icon name="pencil" size={18} color="#ffffff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Data */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Registration Information</Text>
        <Text style={styles.label}>Full Name: {profileData.name}</Text>
        <Text style={styles.label}>Address: {profileData.address}</Text>
        <Text style={styles.label}>Contact Number: {profileData.contact}</Text>
        <Text style={styles.label}>Username: {profileData.username}</Text>
        <Text style={styles.label}>Password: {profileData.password}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Application Information
        </Text>
        <Text style={styles.label}>Birth Date: {profileData.birthDate}</Text>
        <Text style={styles.label}>
          Civil Status: {profileData.civilStatus}
        </Text>
        <Text style={styles.label}>
          Educational Attainment: {profileData.education}
        </Text>
        <Text style={styles.label}>
          Nature of Business: {profileData.businessNature}
        </Text>
        <Text style={styles.label}>
          Capitalization: ₱{profileData.capitalization}
        </Text>
        <Text style={styles.label}>
          Source of Capital: {profileData.sourceOfCapital}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Stall Information
        </Text>
        <Text style={styles.label}>Stall No: {profileData.stallNo}</Text>
        <Text style={styles.label}>Location: {profileData.stallLocation}</Text>
        <Text style={styles.label}>
          Description: {profileData.stallDescription}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Spouse Information
        </Text>
        <Text style={styles.label}>
          Name: {profileData.spouseName || "N/A"}
        </Text>
        <Text style={styles.label}>
          Birth Date: {profileData.spouseBirthDate || "N/A"}
        </Text>
        <Text style={styles.label}>
          Education: {profileData.spouseEducation || "N/A"}
        </Text>
        <Text style={styles.label}>
          Occupation: {profileData.spouseOccupation || "N/A"}
        </Text>
        <Text style={styles.label}>
          Children:{" "}
          {profileData.children.length > 0
            ? profileData.children.join(", ")
            : "None"}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Subscription Details
        </Text>
        <Text style={styles.label}>
          Valid Until: {profileData.subscriptionEnd}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#002181",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  profileName: { fontSize: 17, fontWeight: "bold", color: "#fff" },
  profileRole: { fontSize: 14, color: "#e0e0e0", marginTop: 4 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
    lineHeight: 22,
    paddingLeft: 10,
  },
  infoCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 5,
    fontWeight: "600",
  },
});

export default ProfileScreen;
