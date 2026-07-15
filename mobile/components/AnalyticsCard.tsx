import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart2, Eye, TrendingUp, Users } from "lucide-react-native";

export function AnalyticsCard() {
  const metrics = [
    { label: "Total Views", val: "14.2K", growth: "+12.4%", icon: <Eye size={16} color="#3b82f6" />, bg: "#eff6ff" },
    { label: "Subscribers", val: "1,248", growth: "+8.2%", icon: <Users size={16} color="#6366f1" />, bg: "#e0e7ff" },
    { label: "Growth rate", val: "22.5%", growth: "+4.1%", icon: <TrendingUp size={16} color="#10b981" />, bg: "#ecfdf5" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <BarChart2 size={16} color="#18181b" />
        <Text style={styles.title}>Mobile Analytics overview</Text>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metricItem}>
            <View style={[styles.iconWrapper, { backgroundColor: m.bg }]}>
              {m.icon}
            </View>
            <Text style={styles.metricVal}>{m.val}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={styles.metricGrowth}>{m.growth}</Text>
          </View>
        ))}
      </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fafafa",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f4f4f5",
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#18181b",
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#71717a",
    marginTop: 2,
    textTransform: "uppercase",
  },
  metricGrowth: {
    fontSize: 9,
    color: "#10b981",
    fontWeight: "bold",
    marginTop: 4,
  },
});
