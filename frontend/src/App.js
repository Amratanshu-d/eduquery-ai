import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin  = (t) => { localStorage.setItem('token', t); setToken(t); };
  const handleLogout = ()  => { localStorage.removeItem('token');  setToken(null); };

  return token
    ? <Dashboard onLogout={handleLogout} />
    : <Login     onLogin={handleLogin}  />;
}

export default App;