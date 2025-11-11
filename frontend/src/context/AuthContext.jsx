/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiGetUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		try { return raw ? JSON.parse(raw) : null; } catch { return null; }
	});
	const [loading, setLoading] = useState(false);
	const [initializing, setInitializing] = useState(true);

	// Refrescar usuario del backend (opcional) si hay token
	const refreshUser = useCallback(async () => {
		if (!token || !user?.id_user) return;
		try {
			const fresh = await apiGetUser(user.id_user, token);
			setUser(prev => ({ ...prev, ...fresh }));
			localStorage.setItem('user', JSON.stringify({ ...user, ...fresh }));
			} catch { /* silencioso */ }
	}, [token, user]);

	useEffect(() => {
		setInitializing(false);
	}, []);

	const login = async (username, password) => {
		setLoading(true);
		try {
			const data = await apiLogin(username, password);
			setToken(data.token);
			setUser(data.user);
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			return { ok: true };
		} catch (e) {
			return { ok: false, message: e.message };
		} finally { setLoading(false); }
	};

	const register = async (payload) => {
		setLoading(true);
		try {
			await apiRegister(payload);
			// Auto-login
			return await login(payload.username, payload.password);
		} catch (e) {
			return { ok: false, message: e.message };
		} finally { setLoading(false); }
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	const value = {
		token,
		user,
		loading,
		initializing,
		login,
		register,
		logout,
		refreshUser
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Colocar el ProtectedRoute en un archivo separado podría evitar el warning de fast-refresh,
// pero mantenemos aquí por simplicidad.
import { Navigate } from 'react-router-dom';
export function ProtectedRoute({ children }) {
	const { token, initializing } = useAuth();
	if (initializing) return null; // Podrías retornar un loader.
	if (!token) return <Navigate to="/login" replace />;
	return children;
}

