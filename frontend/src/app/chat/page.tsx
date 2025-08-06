
"use client";
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import * as sdk from 'matrix-js-sdk';


interface Room {
  room_id: string;
  name: string;
}


export default function ChatPage() {
  const [homeserver, setHomeserver] = useState('https://matrix.org');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [client, setClient] = useState<any>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const matrixClient = sdk.createClient({ baseUrl: homeserver });
      const loginResp = await matrixClient.loginWithPassword(username, password);
      setAccessToken(loginResp.access_token);
      setUserId(loginResp.user_id);
      const authedClient = sdk.createClient({
        baseUrl: homeserver,
        accessToken: loginResp.access_token,
        userId: loginResp.user_id,
      });
      setClient(authedClient);
    } catch (err: any) {
      setError('Login failed: ' + (err?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  // Fetch rooms after login
  useEffect(() => {
    if (!client) return;
    setLoading(true);
    setError('');
    client.startClient();
    const onSync = (state: string) => {
      if (state === 'PREPARED') {
        const joinedRooms = client.getRooms().map((room: any) => ({
          room_id: room.roomId,
          name: room.name || room.roomId,
        }));
        setRooms(joinedRooms);
        setLoading(false);
        client.removeListener('sync', onSync);
      }
    };
    client.on('sync', onSync);
    return () => {
      client.removeListener('sync', onSync);
    };
  }, [client]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Matrix Rooms</h2>
        {!accessToken ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <label>
              Homeserver URL
              <input type="text" value={homeserver} onChange={e => setHomeserver(e.target.value)} required />
            </label>
            <label>
              Username
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </form>
        ) : (
          <>
            {loading && <div>Loading rooms...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
              {rooms.map(room => (
                <li key={room.room_id}>{room.name}</li>
              ))}
            </ul>
          </>
        )}
        {/* TODO: Add chat messages and WhatsApp bridge sync UI here */}
      </main>
    </div>
  );
}
