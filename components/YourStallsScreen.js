/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import supabase from "../supabaseClient";

const YourStallsScreen = ({ route, registrantId }) => {
  // Hardcode registrantId to 1 for testing (remove this when you add login)
  const actualRegistrantId = 1;
  const [yourStalls, setYourStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const fetchStalls = async () => {
      // Check if registrantId is valid before making the API call
      if (
        !actualRegistrantId ||
        actualRegistrantId === undefined ||
        actualRegistrantId === null
      ) {
        console.error(
          "registrantId is required but not provided:",
          actualRegistrantId
        );
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("stall")
          .select("*")
          .eq("registrant_id", actualRegistrantId);

        if (error) {
          console.error("Error fetching stalls:", error);
        } else {
          setYourStalls(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
  }, [actualRegistrantId]);

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

  const handleImagePress = (image) => {
    if (image) {
      setSelectedImage(image);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Show error state if registrantId is not provided
  if (
    !actualRegistrantId ||
    actualRegistrantId === undefined ||
    actualRegistrantId === null
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to load stalls: User ID not found
          </Text>
          <Text style={styles.errorSubtext}>
            Please make sure you are logged in properly
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#002181" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleExpand} style={styles.headerRow}>
          <Text style={styles.header}>Your Stalls</Text>
          <Text style={styles.toggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        <Animated.View
          style={[styles.descriptionContainer, { height: heightInterpolation }]}
        >
          {isExpanded && (
            <Text style={styles.headerDescription}>
              This page lists all the stalls currently assigned to you.
            </Text>
          )}
        </Animated.View>
      </View>

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
              source={{ uri: selectedImage }}
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

      {/* Stall List */}
      {yourStalls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stalls found</Text>
          <Text style={styles.emptySubtext}>
            You don't have any stalls assigned yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={yourStalls}
          keyExtractor={(item) => item.stall_id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => handleImagePress(item.image_url)}
                  style={styles.imageContainer}
                >
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.imageOverlay}>
                    <Text style={styles.viewText}>
                      {item.image_url ? "View" : "No Image"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Stall No: </Text>
                    {item.stall_no}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Location: </Text>
                    {item.stall_location}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Size: </Text>
                    {item.size}
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text style={styles.description}>
                  <Text style={{ fontWeight: "600" }}>Description: </Text>
                  {item.description}
                </Text>
              )}
              <View style={{ height: 20 }} />
            </View>
          )}
        />
      )}
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
  headerDescription: { fontSize: 14, color: "#ffffff", marginTop: 10 },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  rowContainer: { flexDirection: "row", alignItems: "flex-start" },
  imageContainer: {
    position: "relative",
    marginRight: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 4,
    alignItems: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  viewText: { color: "white", fontSize: 10, fontWeight: "bold" },
  detailsContainer: { flex: 1 },
  details: { fontSize: 14, color: "#000000", marginBottom: 4 },
  additionalInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  description: { fontSize: 14, color: "#000000", marginTop: 10 },
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default YourStallsScreen;
