import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { OfflineBanner } from "./components/OfflineBanner";
import { DraftSyncManager } from "./components/DraftSyncManager";
import { MobileEditor } from "./components/MobileEditor";
import { AnalyticsCard } from "./components/AnalyticsCard";
import { NotificationCenter } from "./components/NotificationCenter";
import { MediaUploader } from "./components/MediaUploader";

export default function App() {
  const [offline, setOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState(0);

  const handleRefreshSyncQueue = () => {
    // refresh callback
    setSyncQueue((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <OfflineBanner
        isOffline={offline}
        syncCount={syncQueue}
        onSync={() => setSyncQueue(0)}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.branding}>
          <Text style={styles.brandTitle}>LogBook Mobile</Text>
          <Text style={styles.brandSubtitle}>Workspace Creator app</Text>
        </View>

        {/* Sync queue controllers */}
        <DraftSyncManager onSyncComplete={() => setSyncQueue(0)} />

        {/* Quick analytics card overview */}
        <AnalyticsCard />

        {/* Notification Alert Center */}
        <NotificationCenter />

        {/* Media Assets Uploader */}
        <MediaUploader />

        {/* Markdown Mobile Editor */}
        <MobileEditor onSaveComplete={handleRefreshSyncQueue} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  branding: {
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#18181b",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#71717a",
    fontWeight: "600",
    marginTop: 2,
  },
});
