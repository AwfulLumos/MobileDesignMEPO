/* eslint-disable prettier/prettier */
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const initialDocuments = [
  { id: "1", name: "Barangay Clearance", date: null, image: null },
  { id: "2", name: "Business Permit", date: null, image: null },
  { id: "3", name: "BIR Registration", date: null, image: null },
  { id: "4", name: "Social Security System (SSS)", date: null, image: null },
  { id: "5", name: "Occupancy Permit", date: null, image: null },
  { id: "6", name: "Sanitary Permit", date: null, image: null },
];

const DocumentScreen = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation value for expand/collapse
  const animation = useRef(new Animated.Value(0)).current;
  const handleImagePress = (imageUri) => {
    setFullImageUri(imageUri);
    setFullImageVisible(true);
  };

  const handlePress = (item) => {
    setSelectedDocument(item);
    setModalVisible(true);
  };

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
    outputRange: [0, 70],
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === selectedDocument.id
            ? { ...doc, image: result.assets[0].uri, date: formattedDate }
            : doc
        )
      );

      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleExpand} style={styles.headerRow}>
          <Text style={styles.header}>Document Management</Text>
          <Text style={styles.toggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        <Animated.View
          style={[styles.descriptionContainer, { height: heightInterpolation }]}
        >
          {isExpanded && (
            <Text style={styles.description}>
              This page allows stallholders to upload and manage required
              documents for MEPO. Documents must be renewed every 1 year and 6
              months.
            </Text>
          )}
        </Animated.View>
      </View>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.card}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.imagePreview}
                />
              )}
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDate}>
                Uploaded: {item.date || "N/A"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Document Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDocument?.name}</Text>
            <Text style={styles.modalText}>
              Uploaded: {selectedDocument?.date || "N/A"}
            </Text>

            {selectedDocument?.image && (
              <TouchableOpacity
                onPress={() => handleImagePress(selectedDocument.image)}
              >
                <Image
                  source={{ uri: selectedDocument.image }}
                  style={styles.modalImage}
                />
              </TouchableOpacity>
            )}

            <Pressable style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {selectedDocument?.image ? "Change Image" : "Upload Image"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Full-Screen Image Modal */}
      <Modal visible={fullImageVisible} transparent={true}>
        <TouchableOpacity
          style={styles.fullImageContainer}
          onPress={() => setFullImageVisible(false)}
          activeOpacity={1}
        >
          <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
        </TouchableOpacity>
      </Modal>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleIcon: {
    fontSize: 15,
    color: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#6200ea",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },
  description: {
    fontSize: 14,
    color: "#f5f5f5",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#002181",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  cardDate: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 5,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#34a853",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  fullImageCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
  },
});

export default DocumentScreen;
