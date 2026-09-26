'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { API_BASE_URL, setAccessToken } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }

      const data: { accessToken: string } = await response.json();
      setAccessToken(data.accessToken);
      router.push('/anime');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'メールアドレスまたはパスワードが正しくありません',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>ログイン</h1>
        {error && <p className="message message-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="login-email">メールアドレス</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">パスワード</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            minLength={8}
            required
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>

        <p className="auth-switch">
          アカウントがない場合は <Link href="/register">ユーザー登録</Link>
        </p>
      </form>
    </main>
  );
}
