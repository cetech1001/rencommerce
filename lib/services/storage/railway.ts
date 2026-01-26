import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { StorageService, UploadResult } from "./types";

export class RailwayBucketStorage implements StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    const bucketName = process.env.S3_BUCKET;
    const region = process.env.S3_REGION || "us-east-1";
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!endpoint || !bucketName || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "S3 configuration is missing. Please set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY"
      );
    }

    this.endpoint = endpoint;
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for Railway/MinIO-style S3
    });
  }

  async uploadImage(file: File | Blob, originalFilename: string): Promise<UploadResult> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = originalFilename.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to S3 bucket
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      });

      await this.s3Client.send(command);

      const url = `https://bucket-proxy.up.railway.app/unsafe/plain/s3://${this.bucketName}/${filename}`;

      return { success: true, url };
    } catch (error) {
      console.error("S3 upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file to S3 bucket"
      };
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const filename = url.split("/").pop();
      if (!filename) return false;

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error("S3 delete error:", error);
      return false;
    }
  }
}
