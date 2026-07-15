import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Bell, ShieldAlert, Award, MessageSquare } from "lucide-react-native";

export function NotificationCenter() {
  const items = [
    { id: "1", type: "milestone", title: "Milestone Reached!", body: "Your publication just passed 1,000 active email subscribers.", icon: <Award size={14} color="#f59e0b" />, bg: "#fffbeb" },
    { id: "2", type: "comment", title: "New Comment Approved", body: "Harry left a comment: 'This is an amazing update, looking forward to offline features!'", icon: <MessageSquare size={14} color="#3b82f6" />, bg: "#eff6ff" },
    { id: "3", type: "security", title: "New Device Registered", body: "Face ID sign-in succeeded from iPhone 15 Pro.", icon: <ShieldAlert size={14} color="#10b981" />, bg: "#ecfdf5" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Bell size={16} color="#18181b" />
        <Text style={styles.title}>Notification Center</Text>
      </View>

      <ScrollView style={styles.list} nestedScrollEnabled>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={[styles.iconWrapper, { backgroundColor: item.bg }]}>
              {item.icon}
            </View>
            <View style={styles.body}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemBody}>{item.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e4e4e7",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    maxHeight: 240,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  body: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#18181b",
  },
  itemBody: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2,
    lineHeight: 14,
  },
});
