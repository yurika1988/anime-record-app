'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { API_BASE_URL } from '../../lib/auth';

export default function RegisterPage() {
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('このメールアドレスは既に登録されています');
        }
        throw new Error('登録に失敗しました');
      }

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>ユーザー登録</h1>
        {error && <p className="message message-error">{error}</p>}

        <div className="form-field">
          <label htmlFor="register-email">メールアドレス</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-password">パスワード（8文字以上）</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            minLength={8}
            required
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '登録中...' : '登録'}
          </button>
        </div>

        <p className="auth-switch">
          すでにアカウントがある場合は <Link href="/login">ログイン</Link>
        </p>
      </form>
    </main>
  );
}
