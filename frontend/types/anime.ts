export type AnimeStatus = 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';

export type Anime = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  status: AnimeStatus;
  rating: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnimeInput = {
  title: string;
  status: AnimeStatus;
  description?: string;
  imageUrl?: string;
  rating?: number;
};

export type UpdateAnimeInput = {
  title?: string;
  status?: AnimeStatus;
  description?: string | null;
  imageUrl?: string | null;
  rating?: number | null;
};
