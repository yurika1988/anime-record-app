import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { extensionForMimeType, getUploadDir } from './image-file.filter';

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly uploadDir = getUploadDir();

  async onModuleInit() {
    await mkdir(this.uploadDir, { recursive: true });
  }

  isOwnedUploadPath(imageUrl: string | null | undefined, userId: string): boolean {
    if (!imageUrl) {
      return false;
    }
    const prefix = `/uploads/${userId}/`;
    if (!imageUrl.startsWith(prefix)) {
      return false;
    }
    const filename = imageUrl.slice(prefix.length);
    return filename.length > 0 && !filename.includes('/') && !filename.includes('..');
  }

  async save(userId: string, file: Express.Multer.File): Promise<string> {
    const ext = extensionForMimeType(file.mimetype);
    const filename = `${randomUUID()}${ext}`;
    const userDir = join(this.uploadDir, userId);
    await mkdir(userDir, { recursive: true });
    await writeFile(join(userDir, filename), file.buffer);
    return `/uploads/${userId}/${filename}`;
  }

  async removeIfOwned(
    imageUrl: string | null | undefined,
    userId: string,
  ): Promise<void> {
    if (!this.isOwnedUploadPath(imageUrl, userId) || !imageUrl) {
      return;
    }
    const filename = imageUrl.slice(`/uploads/${userId}/`.length);
    await unlink(join(this.uploadDir, userId, filename)).catch(() => undefined);
  }
}
