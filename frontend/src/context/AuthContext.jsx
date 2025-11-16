import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiGetUser } from '../services/api';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);
const ROUTE_FLOW = ["/Home", "/Seleccion", "/Game", "/Exercise"];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [lastValidRoute, setLastValidRoute] = useState("/Home");

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser?.id_user;
    if (!userId) return;

    try {
      const fresh = await apiGetUser(userId, token);
      setUser(prev => ({ ...prev, ...fresh }));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...fresh }));
    } catch (error) {}
  }, [token]);

  useEffect(() => { setInitializing(false); }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { ok: true };
    } catch (e) { return { ok: false, message: e.message }; }
    finally { setLoading(false); }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      await apiRegister(payload);
      const loginRes = await login(payload.username, payload.password);
      if (loginRes.ok) return { ok: true, registered: true, loginOk: true };
      return { ok: true, registered: true, loginOk: false, message: loginRes.message };
    } catch (e) { return { ok: false, message: e.message }; }
    finally { setLoading(false); }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    token, user, loading, initializing,
    login, register, logout, refreshUser,
    lastValidRoute, setLastValidRoute
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// ------------------ ProtectedRoute ------------------
export function ProtectedRoute({ children }) {
  const { token, initializing } = useAuth();
  if (initializing) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ------------------ FlowRoute ------------------
export function FlowRoute({ children }) {
  const { token, initializing, lastValidRoute, setLastValidRoute } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    
    const currentIndex = ROUTE_FLOW.indexOf(location.pathname);
    const lastIndex = ROUTE_FLOW.indexOf(lastValidRoute);

    // Solo actualizamos si estamos avanzando un paso válido
    if (currentIndex === lastIndex + 1) {
      setLastValidRoute(location.pathname);
    }
  }, [location.pathname, token, lastValidRoute, setLastValidRoute]);

  if (initializing) return null;
  if (!token) return <Navigate to="/login" replace />;

  const currentIndex = ROUTE_FLOW.indexOf(location.pathname);
  const lastIndex = ROUTE_FLOW.indexOf(lastValidRoute);

  // Bloqueamos cualquier salto de ruta
  if (currentIndex === -1 || currentIndex > lastIndex + 1) {
    return <Navigate to={lastValidRoute} replace />;
  }

  return children;
}
