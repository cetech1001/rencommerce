"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
}

export function MultiImageUpload({ value, onChange, label }: MultiImageUploadProps) {
  const [showUpload, setShowUpload] = useState(false);

  const handleAddImage = (url: string) => {
    onChange([...value, url]);
    setShowUpload(false);
  };

  const handleRemoveImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video border border-border rounded-lg overflow-hidden group"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      {!showUpload && (
        <button
          type="button"
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-muted transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      )}

      {/* Upload Component */}
      {showUpload && (
        <div className="p-4 border border-border rounded-lg space-y-4">
          <ImageUpload
            value=""
            onChange={handleAddImage}
            label="Upload Additional Image"
          />
          <button
            type="button"
            onClick={() => setShowUpload(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
