import { uploadFileToMinio } from './uploadFile';
import { uploadToCloudinary } from './uploadToCloudinary';

export type StorageUploadResult = {
  storageKey: string;
  externalUrl: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return undefined;
}

export async function uploadFileService(file: File, folder: string): Promise<StorageUploadResult> {
  const provider = getCookie('storage_provider') || 'cloudinary';

  if (provider === 'minio') {
    const res = await uploadFileToMinio(file, folder);
    return {
      storageKey: res.storageKey,
      externalUrl: res.url,
      fileName: res.fileName,
      sizeBytes: res.size,
      mimeType: res.mimeType,
    };
  }

  const res = await uploadToCloudinary(file, folder);
  return {
    storageKey: res.public_id,
    externalUrl: res.secure_url,
    fileName: res.original_filename || file.name,
    sizeBytes: res.bytes,
    mimeType: file.type || 'application/octet-stream',
  };
}
