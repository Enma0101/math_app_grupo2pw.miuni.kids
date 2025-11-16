// Servicio centralizado de llamadas al backend
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

    throw new Error('No se pudo conectar con el servidor');
  }

  let json;
  try {
    json = await res.json();
   
  } catch (parseErr) {
   
    throw new Error('Respuesta no válida del servidor');
  }

  if (!res.ok || json.ok === false) {
    const msg = json?.message || `Error HTTP ${res.status}`;
    
    throw new Error(msg);
  }

  return json.data || json;
}

// ------------------- AUTH -------------------
export const apiRegister = (payload) => request('/auth/register', { method: 'POST', body: payload });
export const apiLogin = (username, password) => request('/auth/login', { method: 'POST', body: { username, password } });

// ------------------- USERS -------------------
export const apiGetUser = (id, token) => request(`/users/${id}`, { token });
export const apiUpdateUser = (token, id, payload) => request(`/users/${id}`, { method: 'PUT', token, body: payload });

// ------------------- LEVELS -------------------
export const apiGetLevels = () => request('/levels');
export const apiGetLevelConfig = () => request('/levels'); 
export const apiGetStarsForLevel = (token, levelId) =>
  request(`/levels/${levelId}/stars`, { token });

// ------------------- EXERCISES -------------------
export const apiSaveExercises = (token, exercises) =>
  request('/exercises/save-batch', { method: 'POST', token, body: exercises });

export const apiGetUserExercises = (token, userId, levelId, operationType) =>
  request(`/exercises/user/${userId}?level_id=${levelId}&operation_type=${operationType}`, { token });

export const apiUpdateExercise = (token, exerciseId, payload) =>
  request(`/exercises/${exerciseId}`, { method: 'PUT', token, body: payload });

export const apiAttemptExercise = (token, payload) =>
  request('/exercises/attempt', { method: 'POST', token, body: payload });

export const apiDeleteLevelExercises = (token, userId, levelId, operationType) =>
  request('/exercises/delete-level', {
    method: 'DELETE',
    token,
    body: { user_id: userId, level_id: levelId, operation_type: operationType }
  });

// ------------------- PROGRESS (STARS) -------------------
export const apiGetProgress = (token, userId) =>
  request(`/progress/${userId}`, { token });

export const apiGetStars = (token, userId) =>
  request(`/progress/stars/${userId}`, { token });

export const apiUpdateStars = (token, body) =>
  request('/progress/update/stars', { method: 'POST', token, body });

export const apiResetProgress = (token, userId) =>
  request('/progress/reset', { method: 'POST', token, body: { user_id: userId } });

// ------------------- STREAKS -------------------

export const apiGetStreak = (token, userId, operationType = null) => {
  const query = operationType ? `?operation_type=${operationType}` : '';
  return request(`/progress/streak/${userId}${query}`, { token });
};

export const apiUpdateStreak = (token, body) =>
  request('/progress/streak/update', { method: 'POST', token, body });

export const apiResetStreak = (token, body) =>
  request('/progress/streak/reset', { method: 'POST', token, body });

// ------------------- EXPORT -------------------
export default {
  apiRegister,
  apiLogin,
  apiGetUser,
  apiUpdateUser,
  apiGetStarsForLevel,
  apiSaveExercises,
  apiGetUserExercises,
  apiUpdateExercise,
  apiAttemptExercise,
  apiDeleteLevelExercises,
  apiGetProgress,
  apiGetStars,
  apiUpdateStars,
  apiResetProgress,
  apiGetStreak,
  apiUpdateStreak,
  apiResetStreak,
  request
};