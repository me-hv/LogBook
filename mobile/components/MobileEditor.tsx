import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { saveDraftOffline } from "../src/lib/storage";
import { Bold, Italic, Link, Code, Image, Save } from "lucide-react-native";

interface MobileEditorProps {
  onSaveComplete: () => void;
}

export function MobileEditor({ onSaveComplete }: MobileEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Autosaved local");

  // Simple simulated autosave loop on content updates
  useEffect(() => {
    if (!title.trim()) return;

    setSaveStatus("Saving...");
    const timeout = setTimeout(async () => {
      const draft = {
        id: "offline_draft_1",
        title,
        content,
        slug: `draft-${Date.now()}`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveDraftOffline(draft);
      setSaveStatus("Draft autosaved offline");
      onSaveComplete();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content]);

  const insertSyntax = (syntax: string) => {
    setContent(content + syntax);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mobile Editor</Text>
        <Text style={styles.saveStatus}>{saveStatus}</Text>
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Post Title"
        placeholderTextColor="#a1a1aa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.contentInput}
        placeholder="Write in markdown format..."
        placeholderTextColor="#a1a1aa"
        multiline
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />

      {/* Editor shortcuts toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={() => insertSyntax("**")}>
          <Bold size={16} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => insertSyntax("*")}>
          <Italic size={16} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => insertSyntax("[]()")}>
          <Link size={16} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => insertSyntax("`")}>
          <Code size={16} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={() => insertSyntax("![]()")}>
          <Image size={16} color="#71717a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderColor: "#e4e4e7",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    height: 380,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  saveStatus: {
    fontSize: 9,
    fontWeight: "semibold",
    color: "#a1a1aa",
  },
  titleInput: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 8,
    padding: 0,
  },
  contentInput: {
    flex: 1,
    fontSize: 12,
    color: "#3f3f46",
    padding: 0,
    lineHeight: 18,
  },
  toolbar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 8,
    gap: 16,
  },
  toolBtn: {
    padding: 6,
    backgroundColor: "#f4f4f5",
    borderRadius: 8,
  },
});
