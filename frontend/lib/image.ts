import { API_BASE_URL } from './auth';

export function resolveImageSrc(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  return imageUrl;
}
