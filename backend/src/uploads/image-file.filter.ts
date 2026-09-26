import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { memoryStorage } from 'multer';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export function getUploadDir() {
  return process.env.UPLOAD_DIR ?? '/app/uploads';
}

export function getUploadMaxBytes() {
  const parsed = Number(process.env.UPLOAD_MAX_BYTES ?? 5 * 1024 * 1024);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5 * 1024 * 1024;
}

export function extensionForMimeType(mimetype: string): '.jpg' | '.png' | '.webp' {
  switch (mimetype) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      throw new BadRequestException('JPEG / PNG / WebP のみアップロードできます');
  }
}

export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      file.mimetype as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
    )
  ) {
    callback(
      new BadRequestException('JPEG / PNG / WebP のみアップロードできます'),
      false,
    );
    return;
  }
  callback(null, true);
}

export function imageUploadOptions() {
  return {
    storage: memoryStorage(),
    limits: { fileSize: getUploadMaxBytes() },
    fileFilter: imageFileFilter,
  };
}
