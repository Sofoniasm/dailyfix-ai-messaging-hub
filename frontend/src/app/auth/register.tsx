import React, { useState } from 'react';
import styles from '../page.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // TODO: Save user session/token and redirect
      alert('Registration successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google';
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername((e.target as HTMLInputElement).value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail((e.target as HTMLInputElement).value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword((e.target as HTMLInputElement).value)}
            required
          />
          <button type="submit" className={styles.primary}>Register</button>
        </form>
        <button onClick={handleGoogleRegister} className={styles.secondary} style={{ marginTop: 16 }}>
          Register with Google
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </main>
    </div>
  );
}
