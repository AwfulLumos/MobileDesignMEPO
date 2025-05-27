/* eslint-disable prettier/prettier */
import { useNotifications } from "../contexts/NotificationContext";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from "react-native";

const stall1 = require("../assets/images/stall1.jpg");
const stall2 = require("../assets/images/stall2.jpg");

const auctions = [
  {
    id: "1",
    stall_no: "19",
    zone: "Zone A",
    floor_level: "1st Floor",
    section: "Vegetable Section",
    width: "3m",
    height: "4m",
    starting_bid: "₱5,000",
    description:
      "A spacious stall with good ventilation, ideal for fresh produce. Includes built-in shelves.",
    auction_date: "March 30, 2025 - 10:00 AM",
    minimum_increment: "₱500",
    image: stall1,
  },
  {
    id: "2",
    stall_no: "25",
    zone: "Zone B",
    floor_level: "2nd Floor",
    section: "Dry Goods Section",
    width: "4m",
    height: "5m",
    starting_bid: "₱7,500",
    description:
      "A well-located stall suitable for clothing, accessories, or dry goods. Good foot traffic.",
    auction_date: "April 5, 2025 - 2:00 PM",
    minimum_increment: "₱750",
    image: stall2,
  },
  {
    id: "3",
    stall_no: "32",
    zone: "Zone C",
    floor_level: "Ground Floor",
    section: "Meat Section",
    width: "3.5m",
    height: "4.5m",
    starting_bid: "₱6,500",
    description:
      "A stall designed for meat vendors with a dedicated drainage system and easy access for deliveries.",
    auction_date: "April 10, 2025 - 9:00 AM",
    minimum_increment: "₱600",
    image: stall1,
  },
  {
    id: "4",
    stall_no: "41",
    zone: "Zone D",
    floor_level: "1st Floor",
    section: "Seafood Section",
    width: "3m",
    height: "4m",
    starting_bid: "₱5,500",
    description:
      "Located near the main entrance, this stall is perfect for seafood vendors. Includes a built-in counter.",
    auction_date: "April 15, 2025 - 11:00 AM",
    minimum_increment: "₱550",
    image: stall2,
  },
  {
    id: "5",
    stall_no: "50",
    zone: "Zone E",
    floor_level: "2nd Floor",
    section: "Food Court",
    width: "4.5m",
    height: "5m",
    starting_bid: "₱10,000",
    description:
      "A prime food court stall with high customer traffic. Perfect for a small restaurant or café.",
    auction_date: "April 20, 2025 - 1:00 PM",
    minimum_increment: "₱1,000",
    image: stall1,
  },
];

const AuctionScreen = () => {
  const { addNotification } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 95],
  });

  const handlePreRegisterAll = () => {
    addNotification(
      "You have pre-registered for all auctions, please stand by for the date of the auction at the office of the MEPO."
    );
    console.log("Pre-Register clicked for all auctions");
    setSuccessModalVisible(true);
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleExpand} style={styles.headerRow}>
          <Text style={styles.header}>Auction Page</Text>
          <Text style={styles.toggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        <Animated.View
          style={[styles.descriptionContainer, { height: heightInterpolation }]}
        >
          {isExpanded && (
            <Text style={styles.auction_description}>
              Stallholders can view and pre-register for available stalls in
              MEPO-managed markets. Admins list stalls with key details below.
              The Pre-Register button allows you to participate in upcoming
              auction events at the MEPO Office.
            </Text>
          )}
        </Animated.View>
      </View>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successModalBackground}>
          <View style={styles.successModalContent}>
            <Text style={styles.successMessage}>
              Pre-registered successfully!{"\n"}See notifications to check.
            </Text>
            <TouchableOpacity
              style={styles.closeSuccessButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.closeSuccessButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={selectedImage}
              style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.6,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Stall Cards */}
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.preRegisterButton}
              onPress={handlePreRegisterAll}
            >
              <Text style={styles.preRegisterButtonText}>
                Pre-Register for All Auctions
              </Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <View style={styles.card}>
              <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => handleImagePress(item.image)}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.viewText}>View</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Location: </Text>
                    {item.zone}, {item.floor_level}, {item.section}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Width x Height: </Text>
                    {item.width} x {item.height}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Starting Bid: </Text>
                    {item.starting_bid}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Min Increment: </Text>
                    {item.minimum_increment}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Auction Date: </Text>
                    {item.auction_date}
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={{ height: 20 }} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContainer: {
    backgroundColor: "#002181",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleIcon: { fontSize: 15, color: "#ffffff" },
  header: { fontSize: 17, fontWeight: "bold", color: "#ffffff" },
  descriptionContainer: { overflow: "hidden" },
  preRegisterButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  preRegisterButtonText: { fontSize: 15, color: "#ffffff", fontWeight: "bold" },
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  rowContainer: { flexDirection: "row", alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 5, marginRight: 10 },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
  },
  viewText: { color: "white", fontSize: 12, fontWeight: "bold" },
  detailsContainer: { flex: 1 },
  details: { fontSize: 14, color: "#000000", marginBottom: 3 },
  description: { fontSize: 14, color: "#000000", marginTop: 10 },
  auction_description: { fontSize: 14, color: "#ffffff", marginTop: 10 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: { color: "white", fontSize: 20, fontWeight: "bold" },
  successModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#28a745",
  },
  closeSuccessButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeSuccessButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default AuctionScreen;
