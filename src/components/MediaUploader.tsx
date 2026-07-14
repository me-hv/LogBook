"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Dropzone } from "./Dropzone";
import { UploadProgress } from "./UploadProgress";
import { uploadMediaAction } from "@/app/admin/actions";

interface MediaUploaderProps {
  onUploadSuccess: (media: any) => void;
  bucket?: "post-images" | "avatars" | "site-assets";
}

interface UploadTask {
  id: string;
  name: string;
  progress: number;
  controller?: AbortController; // For cancellation simulation
}

export function MediaUploader({ onUploadSuccess, bucket = "post-images" }: MediaUploaderProps) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [error, setError] = useState("");

  const handleFilesSelected = async (files: File[]) => {
    setError("");

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

    for (const file of files) {
      // 1. Validations
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the maximum 5MB size limit.`);
        continue;
      }
      if (!allowedMimeTypes.includes(file.type)) {
        setError(`"${file.name}" is an unsupported file format.`);
        continue;
      }

      // 2. Create task
      const taskId = `${file.name}-${Date.now()}`;
      const controller = new AbortController();

      const newTask: UploadTask = {
        id: taskId,
        name: file.name,
        progress: 0,
        controller,
      };

      setTasks((prev) => [...prev, newTask]);

      try {
        // Simulate upload progress
        let simulatedProgress = 0;
        const progressInterval = setInterval(() => {
          simulatedProgress += Math.floor(Math.random() * 20) + 5;
          if (simulatedProgress >= 90) {
            simulatedProgress = 90;
            clearInterval(progressInterval);
          }
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, progress: simulatedProgress } : t))
          );
        }, 150);

        // Perform actual Server Action upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const result = await uploadMediaAction(formData);

        clearInterval(progressInterval);

        if (controller.signal.aborted) {
          // Task was cancelled
          continue;
        }

        if (result.success && result.media) {
          setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, progress: 100 } : t)));
          onUploadSuccess(result.media);
          // Remove completed task after short delay
          setTimeout(() => {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
          }, 1000);
        } else {
          setError(result.error || "Upload failed.");
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    }
  };

  const handleCancel = (id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task?.controller) {
        task.controller.abort();
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-650 dark:text-red-400">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Dropzone onFilesSelected={handleFilesSelected} />

      {tasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Uploading ({tasks.length})
          </h4>
          <div className="grid gap-2">
            {tasks.map((task) => (
              <UploadProgress
                key={task.id}
                fileName={task.name}
                progress={task.progress}
                onCancel={() => handleCancel(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
