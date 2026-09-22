'use client';

import type { FormEvent } from 'react';
import type { AnimeStatus } from '../../types/anime';

export const ANIME_STATUSES: AnimeStatus[] = [
  'WATCHING',
  'COMPLETED',
  'ON_HOLD',
  'DROPPED',
];

export const STATUS_LABELS: Record<AnimeStatus, string> = {
  WATCHING: '視聴中',
  COMPLETED: '完走',
  ON_HOLD: '保留',
  DROPPED: '中断',
};

export type AnimeFormValues = {
  title: string;
  status: AnimeStatus;
  rating: string;
  description: string;
  imageUrl: string;
};

export const EMPTY_ANIME_FORM: AnimeFormValues = {
  title: '',
  status: 'WATCHING',
  rating: '',
  description: '',
  imageUrl: '',
};

type AnimeFormProps = {
  mode: 'create' | 'edit';
  values: AnimeFormValues;
  isSubmitting: boolean;
  error: string | null;
  onChange: (values: AnimeFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function validateAnimeForm(values: AnimeFormValues): string | null {
  if (!values.title.trim()) {
    return 'タイトルを入力してください';
  }

  if (values.rating !== '') {
    const parsedRating = Number(values.rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return '評価は1〜5の整数で入力してください';
    }
  }

  return null;
}

export default function AnimeForm({
  mode,
  values,
  isSubmitting,
  error,
  onChange,
  onSubmit,
  onCancel,
}: AnimeFormProps) {
  const isCreate = mode === 'create';

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2>{isCreate ? 'アニメを登録' : 'アニメを編集'}</h2>
      {error && <p className="message message-error">{error}</p>}

      <div className="form-field">
        <label htmlFor="anime-title">タイトル（必須）</label>
        <input
          id="anime-title"
          type="text"
          value={values.title}
          onChange={(event) => onChange({ ...values, title: event.target.value })}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="anime-status">ステータス（必須）</label>
        <select
          id="anime-status"
          value={values.status}
          onChange={(event) =>
            onChange({ ...values, status: event.target.value as AnimeStatus })
          }
          disabled={isSubmitting}
          required
        >
          {ANIME_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="anime-rating">評価（任意）</label>
        <select
          id="anime-rating"
          value={values.rating}
          onChange={(event) => onChange({ ...values, rating: event.target.value })}
          disabled={isSubmitting}
        >
          <option value="">未設定</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="anime-image-url">画像URL</label>
        <input
          id="anime-image-url"
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={values.imageUrl}
          onChange={(event) => onChange({ ...values, imageUrl: event.target.value })}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-field">
        <label htmlFor="anime-description">説明（任意）</label>
        <textarea
          id="anime-description"
          value={values.description}
          onChange={(event) =>
            onChange({ ...values, description: event.target.value })
          }
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isCreate
              ? '登録中...'
              : '更新中...'
            : isCreate
              ? '登録'
              : '更新'}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
