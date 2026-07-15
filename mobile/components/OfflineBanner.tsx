import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { WifiOff, RefreshCw } from "lucide-react-native";

interface OfflineBannerProps {
  isOffline: boolean;
  onSync: () => void;
  syncCount: number;
}

export function OfflineBanner({ isOffline, onSync, syncCount }: OfflineBannerProps) {
  if (!isOffline && syncCount === 0) return null;

  return (
    <View style={[styles.container, isOffline ? styles.offline : styles.pendingSync]}>
      <View style={styles.content}>
        <WifiOff size={16} color={isOffline ? "#ef4444" : "#f59e0b"} />
        <Text style={[styles.text, isOffline ? styles.offlineText : styles.pendingText]}>
          {isOffline
            ? "Offline Mode active. Local drafts are cached."
            : `${syncCount} local drafts ready to sync.`}
        </Text>
      </View>

      {syncCount > 0 && !isOffline && (
        <TouchableOpacity style={styles.syncBtn} onPress={onSync}>
          <RefreshCw size={14} color="#ffffff" />
          <Text style={styles.btnText}>Sync</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  offline: {
    backgroundColor: "#fef2f2",
    borderBottomColor: "#fee2e2",
  },
  pendingSync: {
    backgroundColor: "#fffbeb",
    borderBottomColor: "#fef3c7",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  offlineText: {
    color: "#b91c1c",
  },
  pendingText: {
    color: "#b45309",
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
