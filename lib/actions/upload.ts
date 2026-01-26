"use server";

import { getStorageService } from "@/lib/services/storage";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    // Get storage service based on environment configuration
    const storageService = getStorageService();

    // Upload using the configured storage service
    const result = await storageService.uploadImage(file, file.name);

    return result;
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export async function deleteImage(url: string) {
  try {
    const storageService = getStorageService();
    const success = await storageService.deleteImage(url);

    return { success };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
