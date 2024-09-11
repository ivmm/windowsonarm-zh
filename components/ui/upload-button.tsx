import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, MessageBar } from "@fluentui/react-components";
import { aqApi } from "@/lib/axios/api";
import axios from "axios";

interface FileUploadRequest {
  filename: string;
  contentType: string;
}

interface FileUploadResponse {
  url: string;
  fields: Record<string, string>;
}

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file first.",
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Step 1: Get the pre-signed URL from your API
      const response = await aqApi.post<FileUploadResponse, FileUploadRequest>(
        "/api/v1/upload",
        {
          filename: file.name,
          contentType: file.type,
        },
      );

      if (!response.success) {
        throw new Error("Failed to get upload URL");
      }

      const { url, fields } = response.data;

      console.log(url);

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          // You can use this to update a progress bar if you want
        },
      });

      setUploadStatus({
        type: "success",
        message: "File uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <Button onClick={handleSelectFile}>
        <Upload className="mr-2 h-4 w-4" /> Select File
      </Button>
      {file && (
        <p className="text-sm text-gray-500">Selected file: {file.name}</p>
      )}
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload to R2"}
      </Button>
      {uploadStatus && (
        <MessageBar
          intent={uploadStatus.type === "error" ? "error" : "success"}
        >
          {uploadStatus.message}
        </MessageBar>
      )}
    </div>
  );
};

export default FileUploader;
