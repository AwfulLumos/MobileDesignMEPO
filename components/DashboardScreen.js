/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import supabase from "../supabaseClient";

const DashboardScreen = () => {
  const [payments, setPayments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fetch payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payment")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data);
      }
    };

    fetchPayments();
  }, []);

  // Announcement carousel logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentAnnouncementIndex(
          (prevIndex) => (prevIndex + 1) % announcements.length
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleDescription = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const announcements = [
    {
      id: "1",
      title: "📢 New Lease & Tenant Management System Now Live!",
      text: "Dear Tenants, We are pleased to introduce our new Lease and Tenant Management System. You can now View and manage your lease details Receive payment reminders Submit maintenance requests Access important documents Please ensure your contact details are updated to receive notifications. For assistance, contact our support team. Thank you for your cooperation!",
    },
    {
      id: "2",
      title: "📄 Your Important Papers Are Now Easier to Reach!",
      text: "We've made it so you can see your important documents whenever you need them, from wherever you are. Whether you're at your desk, out and about, or working from home, you can get to your files with just a few clicks. It's now much easier to find the information you need, when you need it.",
    },
    {
      id: "3",
      title: "📝 Payment Reminders",
      text: "Receive payment reminders and submit maintenance requests easily!",
    },
  ];

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  return (
    <ScrollView style={styles.container}>
      {/* Dashboard Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity
          onPress={toggleDescription}
          style={styles.dropdownHeader}
        >
          <Text style={styles.dropdownText}>
            Dashboard Overview{" "}
            <Text style={styles.toggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.descriptionContainer, { maxHeight }]}>
          <Text style={styles.description}>
            Welcome to your dashboard! Here, you can track lease details,
            payments, submitted documents, and important announcements. Stay
            updated with the latest notices and manage your stall effortlessly.
          </Text>
        </Animated.View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lease Duration</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>Up to: 05/15/24</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rent Due</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>June 15, 2024</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Rent Payment</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>
            {payments.length > 0
              ? `₱${parseFloat(payments[0].payment_amount).toLocaleString()}`
              : "₱0"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Documents")}
        >
          <Text style={styles.cardTitle}>Document Submitted</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>6 Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Recent Transactions</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Amount</Text>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Status</Text>
          <Text style={styles.headerText}>Type</Text>
        </View>

        <FlatList
          data={payments}
          keyExtractor={(item) => item.payment_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.rowText}>
                ₱{parseFloat(item.payment_amount).toLocaleString()}
              </Text>
              <Text style={styles.rowText}>{item.payment_date}</Text>
              <Text style={styles.rowText}>{item.payment_status}</Text>
              <Text style={styles.rowText}>{item.payment_type}</Text>
            </View>
          )}
        />
      </View>

      {/* Announcements */}
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementTitle}>Announcements</Text>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.announcementSubtitle}>
            {currentAnnouncement.title}
          </Text>
          <Text style={styles.announcementText}>
            {currentAnnouncement.text}
          </Text>
        </Animated.View>
        <View style={styles.indicatorContainer}>
          {announcements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentAnnouncementIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cardsContainer: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  headerContainer: {
    backgroundColor: "#002181",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: "flex-start",
  },
  dropdownHeader: {
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 15,
    color: "#f5f5f5",
    fontWeight: "bold",
  },
  toggleIcon: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },
  descriptionContainer: {
    overflow: "hidden",
  },
  description: {
    fontSize: 14,
    color: "#f5f5f5",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "left",
    width: "100%",
  },
  cardValue: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 5,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
    marginVertical: 8,
  },
  tableContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "#002181",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: {
    flex: 1,
    textAlign: "center",
  },
  announcementContainer: {
    padding: 25,
    backgroundColor: "#fffae6",
    borderRadius: 5,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "#002181",
  },
  announcementText: {
    fontSize: 14,
    color: "#333",
  },
  announcementSubtitle: {
    marginBottom: 10,
    fontSize: 14,
  },
});

export default DashboardScreen;
