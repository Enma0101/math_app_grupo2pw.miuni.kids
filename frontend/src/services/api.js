// Servicio centralizado de llamadas al backend
// Ajusta la URL base según tu entorno. Puedes moverlo a .env (VITE_API_BASE).
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function buildHeaders(token, extra = {}) {
	return {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...extra
	};
}

async function request(path, { method = 'GET', token, body } = {}) {
		let res;
		try {
			res = await fetch(`${API_BASE}${path}`, {
				method,
				headers: buildHeaders(token),
				body: body ? JSON.stringify(body) : undefined,
				credentials: 'omit'
			});
		} catch (networkErr) {
			console.error('Network/Fetch error:', networkErr);
			throw new Error('No se pudo conectar con el servidor');
		}
	let json;
	try {
		json = await res.json();
		} catch {
			throw new Error('Respuesta no válida del servidor');
		}
	if (!res.ok || json.ok === false) {
		const msg = json?.message || `Error HTTP ${res.status}`;
		throw new Error(msg);
	}
	return json.data;
}

// AUTH
export const apiRegister = (payload) => request('/auth/register', { method: 'POST', body: payload });
export const apiLogin = (username, password) => request('/auth/login', { method: 'POST', body: { username, password } });

// USERS
export const apiGetUser = (id, token) => request(`/users/${id}`, { token });
export const apiUpdateUser = (id, token, payload) => request(`/users/${id}`, { method: 'PUT', token, body: payload });

// LEVELS
export const apiGetLevels = () => request('/levels');

// EXERCISES
export const apiGenerateExercises = (type, levelId) => request(`/exercises/${type}/${levelId}`);
export const apiSaveAnswer = (token, payload) => request('/exercises/answer', { method: 'POST', token, body: payload });

// PROGRESS
export const apiGetProgress = (userId, token) => request(`/progress/${userId}`, { token });
export const apiUpdateProgress = (token, payload) => request('/progress/update', { method: 'POST', token, body: payload });
export const apiResetProgress = (token, userId) => request('/progress/reset', { method: 'POST', token, body: { user_id: userId } });

// Utilidad para manejo de errores en componentes
export function friendlyError(error) {
	return error?.message || 'Ha ocurrido un error inesperado';
}

