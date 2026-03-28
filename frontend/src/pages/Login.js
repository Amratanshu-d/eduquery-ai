import React, { useState } from 'react';
import { login } from '../api';

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  card: {
    background: '#1e293b', borderRadius: '16px',
    padding: '40px', width: '100%', maxWidth: '400px',
    border: '1px solid #334155'
  },
  title: { fontSize: '28px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' },
  subtitle: { color: '#94a3b8', marginBottom: '32px', fontSize: '14px' },
  label: { display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    background: '#0f172a', border: '1px solid #334155',
    color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', outline: 'none'
  },
  btn: {
    width: '100%', padding: '13px', borderRadius: '8px',
    background: '#6366f1', color: '#fff', border: 'none',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px'
  },
  hint: {
    marginTop: '24px', padding: '12px', borderRadius: '8px',
    background: '#0f172a', fontSize: '12px', color: '#64748b', lineHeight: '1.8'
  },
  error: { color: '#f87171', fontSize: '13px', marginBottom: '12px' }
};

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await login({ email, password });
      onLogin(res.data.access_token);
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>📚 EduQuery AI</div>
        <div style={styles.subtitle}>Smart Student Performance Analytics</div>
        {error && <div style={styles.error}>⚠ {error}</div>}
        <label style={styles.label}>Email</label>
        <input style={styles.input} value={email}
          onChange={e => setEmail(e.target.value)} placeholder="teacher@edu.com"/>
        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder="••••••••"/>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div style={styles.hint}>
          Demo credentials:<br/>
          Teacher → teacher@edu.com / teacher123<br/>
          Student → student@edu.com / student123
        </div>
      </div>
    </div>
  );
}