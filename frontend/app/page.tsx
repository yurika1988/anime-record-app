import Link from 'next/link';

export default function Home() {
  return (
    <main className="page auth-page">
      <h1>Anime Record App</h1>
      <p>Frontend is running.</p>
      <p className="auth-switch">
        <Link href="/login">ログイン</Link>
        {' / '}
        <Link href="/register">ユーザー登録</Link>
      </p>
    </main>
  );
}
