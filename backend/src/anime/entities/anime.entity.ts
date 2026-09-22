import { AnimeStatus } from '../enums/anime-status.enum';

export class Anime {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  status: AnimeStatus;
  rating: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
