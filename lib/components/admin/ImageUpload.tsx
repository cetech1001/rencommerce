"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { ImageCropper } from "./ImageCropper";
import { useToast } from "@/lib/contexts";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
}

export function ImageUpload({ value, onChange, label, required = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedBlob, selectedFile?.name || "image.jpg");

      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
        showToast("Image uploaded", "success");
      } else {
        showToast(result.error || "Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
      setShowCropper(false);
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain bg-muted"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL Input */}
      <div>
        <input
          type="text"
          value={value}
          onChange={handleUrlChange}
          required={required && !value}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Or paste image URL"
        />
      </div>

      {/* Cropper Modal */}
      {showCropper && previewUrl && (
        <ImageCropper
          imageUrl={previewUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedFile(null);
            setPreviewUrl("");
          }}
        />
      )}
    </div>
  );
}
