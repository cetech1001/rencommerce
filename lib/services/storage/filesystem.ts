import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { StorageService, UploadResult } from "./types";

export class FileSystemStorage implements StorageService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = join(process.cwd(), "public", "uploads");
  }

  async uploadImage(file: File | Blob, originalFilename: string): Promise<UploadResult> {
    try {
      // Create uploads directory if it doesn't exist
      if (!existsSync(this.uploadsDir)) {
        await mkdir(this.uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = originalFilename.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filepath = join(this.uploadsDir, filename);
      await writeFile(filepath, buffer);

      // Return public URL
      const url = `/uploads/${filename}`;

      return { success: true, url };
    } catch (error) {
      console.error("FileSystem upload error:", error);
      return { success: false, error: "Failed to upload file to filesystem" };
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const filename = url.split("/").pop();
      if (!filename) return false;

      const filepath = join(this.uploadsDir, filename);

      if (existsSync(filepath)) {
        await unlink(filepath);
        return true;
      }

      return false;
    } catch (error) {
      console.error("FileSystem delete error:", error);
      return false;
    }
  }
}
