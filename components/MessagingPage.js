/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const MessagingPage = ({ route }) => {
  const { sender } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setMessage(""); // Clear input field after sending
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header with Dark Mode Toggle */}
      <View style={[styles.headerContainer, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.header, isDarkMode && styles.darkHeaderText]}>
          {sender}
        </Text>
        <TouchableOpacity onPress={toggleDarkMode}>
          <Text
            style={[styles.darkModeText, isDarkMode && styles.darkHeaderText]}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <View style={styles.messageListContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "You" ? styles.myMessage : styles.adminMessage,
                isDarkMode &&
                  (item.sender === "You"
                    ? styles.darkMyMessage
                    : styles.darkAdminMessage),
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isDarkMode && styles.darkMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[styles.timestamp, isDarkMode && styles.darkTimestamp]}
              >
                {item.timestamp}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          inverted
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {/* Message Input & Send Button */}
      <View
        style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}
      >
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#6200ea",
  },
  darkHeader: {
    backgroundColor: "#1f1f1f",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },
  darkHeaderText: {
    color: "#fff",
  },
  darkModeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  messageListContainer: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "75%",
    paddingHorizontal: 15,
  },
  myMessage: {
    backgroundColor: "#6200ea",
    alignSelf: "flex-end",
  },
  darkMyMessage: {
    backgroundColor: "#bb86fc",
  },
  adminMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  darkAdminMessage: {
    backgroundColor: "#333",
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  darkMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#ddd",
    marginTop: 5,
    textAlign: "right",
  },
  darkTimestamp: {
    color: "#bbb",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  darkInputContainer: {
    backgroundColor: "#1f1f1f",
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#000",
  },
  darkInput: {
    borderColor: "#555",
    color: "#fff",
  },
  sendButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MessagingPage;
