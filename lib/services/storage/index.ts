import type { StorageService, StorageProvider } from "./types";
import { FileSystemStorage } from "./filesystem";
import { RailwayBucketStorage } from "./railway";

export * from "./types";

let storageInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (storageInstance) {
    return storageInstance;
  }

  const provider = (process.env.STORAGE_PROVIDER || "filesystem") as StorageProvider;

  switch (provider) {
    case "railway":
      storageInstance = new RailwayBucketStorage();
      break;
    case "filesystem":
    default:
      storageInstance = new FileSystemStorage();
      break;
  }

  return storageInstance;
}
