/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationScreen() {
  const { notifications } = useNotifications();

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No new notifications.</Text>
      ) : (
        <FlatList
          data={notifications.slice().reverse()} // Reverse the array before passing it to FlatList
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 18 },
  notificationCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    marginVertical: 8,
    borderRadius: 8,
  },
  notificationText: { fontSize: 16 },
  dateText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
