import React, { useState } from 'react';
import styles from '../page.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // TODO: Save user session/token and redirect
      alert('Login successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google';
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={e => setUsername((e.target as HTMLInputElement).value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword((e.target as HTMLInputElement).value)}
            required
          />
          <button type="submit" className={styles.primary}>Login</button>
        </form>
        <button onClick={handleGoogleLogin} className={styles.secondary} style={{ marginTop: 16 }}>
          Login with Google
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </main>
    </div>
  );
}
