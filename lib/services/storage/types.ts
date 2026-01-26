export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface StorageService {
  uploadImage(file: File | Blob, filename: string): Promise<UploadResult>;
  deleteImage(url: string): Promise<boolean>;
}

export type StorageProvider = "filesystem" | "railway";
