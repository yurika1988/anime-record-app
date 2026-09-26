'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { apiFetch, clearAccessToken, getAccessToken, redirectToLogin } from '../../lib/auth';
import { resolveImageSrc } from '../../lib/image';
import type { Anime } from '../../types/anime';
import AnimeForm, {
  EMPTY_ANIME_FORM,
  STATUS_LABELS,
  validateAnimeForm,
  type AnimeFormValues,
} from './anime-form';

function AnimeCover({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  const src = resolveImageSrc(imageUrl);

  if (!src || failed) {
    return <div className="anime-card-placeholder">画像なし</div>;
  }

  return (
    <img
      className="anime-card-image"
      src={src}
      alt={title}
      onError={() => setFailed(true)}
    />
  );
}

export default function AnimeListPage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AnimeFormValues>(EMPTY_ANIME_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchAnimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/anime');
      if (!response.ok) {
        throw new Error(`Failed to fetch anime list: ${response.status}`);
      }
      const data: Anime[] = await response.json();
      setAnimes(data);
    } catch {
      setError('アニメ一覧の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      redirectToLogin();
      return;
    }
    fetchAnimes();
  }, [fetchAnimes]);

  const handleLogout = () => {
    clearAccessToken();
    window.location.href = '/login';
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormValues(EMPTY_ANIME_FORM);
    setFormError(null);
  };

  const openCreateForm = () => {
    setFormMode('create');
    setEditingId(null);
    setFormValues(EMPTY_ANIME_FORM);
    setFormError(null);
    setDeleteError(null);
  };

  const openEditForm = (anime: Anime) => {
    setFormMode('edit');
    setEditingId(anime.id);
    setFormValues({
      title: anime.title,
      status: anime.status,
      rating: anime.rating != null ? String(anime.rating) : '',
      description: anime.description ?? '',
      imageUrl: anime.imageUrl ?? '',
      imageFile: null,
      removeImage: false,
    });
    setFormError(null);
    setDeleteError(null);
  };

  const handleDelete = async (anime: Anime) => {
    const confirmed = window.confirm(`『${anime.title}』を削除しますか？`);
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setDeleteError(null);
    try {
      const response = await apiFetch(`/anime/${anime.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete anime: ${response.status}`);
      }
      if (editingId === anime.id) {
        closeForm();
      }
      await fetchAnimes();
    } catch {
      setDeleteError('アニメの削除に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateAnimeForm(formValues);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const trimmedTitle = formValues.title.trim();
    const trimmedDescription = formValues.description.trim();
    const trimmedImageUrl = formValues.imageUrl.trim();
    const parsedRating =
      formValues.rating === '' ? undefined : Number(formValues.rating);

    setIsSubmitting(true);
    setFormError(null);
    try {
      const body = new FormData();
      body.append('title', trimmedTitle);
      body.append('status', formValues.status);
      if (trimmedDescription) {
        body.append('description', trimmedDescription);
      } else if (formMode === 'edit') {
        body.append('description', '');
      }
      if (parsedRating !== undefined) {
        body.append('rating', String(parsedRating));
      } else if (formMode === 'edit') {
        body.append('rating', '');
      }

      if (formValues.imageFile) {
        body.append('image', formValues.imageFile);
      } else if (formValues.removeImage) {
        body.append('removeImage', 'true');
      } else if (trimmedImageUrl) {
        body.append('imageUrl', trimmedImageUrl);
      } else if (formMode === 'edit') {
        body.append('imageUrl', '');
      }

      const response =
        formMode === 'edit' && editingId
          ? await apiFetch(`/anime/${editingId}`, {
              method: 'PATCH',
              body,
            })
          : await apiFetch('/anime', {
              method: 'POST',
              body,
            });

      if (!response.ok) {
        throw new Error(`Failed to save anime: ${response.status}`);
      }

      closeForm();
      await fetchAnimes();
    } catch {
      setFormError(
        formMode === 'edit'
          ? 'アニメの更新に失敗しました'
          : 'アニメの登録に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <header className="page-header">
        <h1>アニメ一覧</h1>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={openCreateForm}
            disabled={isSubmitting}
          >
            アニメを追加
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleLogout}
            disabled={isSubmitting}
          >
            ログアウト
          </button>
        </div>
      </header>

      {formMode && (
        <AnimeForm
          mode={formMode}
          values={formValues}
          isSubmitting={isSubmitting}
          error={formError}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {deleteError && <p className="message message-error">{deleteError}</p>}

      {isLoading && <p className="message">読み込み中...</p>}

      {!isLoading && error && <p className="message message-error">{error}</p>}

      {!isLoading && !error && animes.length === 0 && (
        <p className="empty-state">登録されているアニメはありません</p>
      )}

      {!isLoading && !error && animes.length > 0 && (
        <ul className="anime-grid">
          {animes.map((anime) => (
            <li className="anime-card" key={anime.id}>
              <AnimeCover
                key={anime.imageUrl ?? 'none'}
                imageUrl={anime.imageUrl}
                title={anime.title}
              />
              <div className="anime-card-body">
                <h2 className="anime-card-title">{anime.title}</h2>
                <span className={`status-badge status-${anime.status}`}>
                  {STATUS_LABELS[anime.status]}
                </span>
                {anime.rating == null ? (
                  <p className="rating rating-empty">未評価</p>
                ) : (
                  <p className="rating" aria-label={`評価 ${anime.rating}`}>
                    {'★'.repeat(anime.rating)}
                    {'☆'.repeat(5 - anime.rating)}
                  </p>
                )}
                {anime.description && (
                  <p className="anime-card-description">{anime.description}</p>
                )}
                <div className="anime-card-actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => openEditForm(anime)}
                    disabled={isSubmitting}
                  >
                    編集
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(anime)}
                    disabled={isSubmitting}
                  >
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
