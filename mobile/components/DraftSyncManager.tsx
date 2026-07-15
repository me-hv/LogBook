import React, { useEffect, useTransition } from "react";
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { getOfflineDrafts, removeOfflineDraft } from "../src/lib/storage";
import { syncDraftToServer } from "../src/lib/api";
import { CloudLightning, Check, AlertCircle } from "lucide-react-native";

interface DraftSyncManagerProps {
  onSyncComplete: () => void;
}

export function DraftSyncManager({ onSyncComplete }: DraftSyncManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [syncStatus, setSyncStatus] = React.useState<"idle" | "syncing" | "success" | "error">("idle");
  const [queueCount, setQueueCount] = React.useState(0);

  const checkQueue = async () => {
    const drafts = await getOfflineDrafts();
    setQueueCount(drafts.length);
  };

  useEffect(() => {
    checkQueue();
  }, []);

  const handleSyncAll = () => {
    setSyncStatus("syncing");
    startTransition(async () => {
      try {
        const drafts = await getOfflineDrafts();
        let successCount = 0;

        for (const draft of drafts) {
          const success = await syncDraftToServer(draft);
          if (success) {
            await removeOfflineDraft(draft.id);
            successCount++;
          }
        }

        if (successCount === drafts.length) {
          setSyncStatus("success");
          setQueueCount(0);
          onSyncComplete();
          setTimeout(() => setSyncStatus("idle"), 2000);
        } else {
          setSyncStatus("error");
        }
      } catch {
        setSyncStatus("error");
      }
    });
  };

  if (queueCount === 0 && syncStatus === "idle") return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <CloudLightning size={16} color="#18181b" />
        <Text style={styles.title}>Workspace Sync Controller</Text>
      </View>

      <Text style={styles.desc}>
        {queueCount} drafts are queued offline. Sync to save them in database.
      </Text>

      {syncStatus === "syncing" ? (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#18181b" />
          <Text style={styles.statusText}>Syncing drafts to server...</Text>
        </View>
      ) : syncStatus === "success" ? (
        <View style={styles.statusRow}>
          <Check size={16} color="#10b981" />
          <Text style={[styles.statusText, styles.successText]}>All drafts synced successfully!</Text>
        </View>
      ) : syncStatus === "error" ? (
        <View style={styles.statusRow}>
          <AlertCircle size={16} color="#ef4444" />
          <Text style={[styles.statusText, styles.errorText]}>Some sync attempts failed. Try again.</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleSyncAll}>
          <Text style={styles.btnText}>Sync All Drafts</Text>
        </TouchableOpacity>
      )}
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
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 11,
    color: "#71717a",
    lineHeight: 16,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#71717a",
  },
  successText: {
    color: "#10b981",
  },
  errorText: {
    color: "#ef4444",
  },
});
