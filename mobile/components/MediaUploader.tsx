import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, Image, Check, AlertCircle } from "lucide-react-native";

export function MediaUploader() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const startUpload = () => {
    setUploadState("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("success");
          setTimeout(() => setUploadState("idle"), 2000);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Camera size={16} color="#18181b" />
        <Text style={styles.title}>Mobile Media Uploader</Text>
      </View>

      <Text style={styles.desc}>
        Upload images directly from camera or device photo library to CDN.
      </Text>

      {uploadState === "uploading" ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color="#18181b" />
          <Text style={styles.progressText}>Uploading assets... {progress}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      ) : uploadState === "success" ? (
        <View style={styles.statusRow}>
          <Check size={16} color="#10b981" />
          <Text style={[styles.statusText, styles.successText]}>Upload completed successfully!</Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={startUpload}>
            <Image size={14} color="#71717a" />
            <Text style={styles.btnText}>Photo Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={startUpload}>
            <Camera size={14} color="#71717a" />
            <Text style={styles.btnText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 11,
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
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  btnText: {
    color: "#18181b",
    fontSize: 10,
    fontWeight: "bold",
  },
  progressContainer: {
    width: "100%",
    gap: 6,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#71717a",
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#f4f4f5",
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#18181b",
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
});
