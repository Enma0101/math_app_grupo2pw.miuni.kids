import { 
  apiSaveExercises, 
  apiGetUserExercises, 
  apiUpdateExercise, 
  apiDeleteLevelExercises 
} from '../services/api';

/**
 * Genera un dígito aleatorio según el nivel de dificultad
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @returns {number} 
 */
export const generateDigitByNivel = (nivel) => {
  // Normalizar nivel si viene como número
  let normalizedNivel = nivel;
  if (typeof nivel === 'number') {
    normalizedNivel = nivel === 1 ? 'Fácil' : nivel === 2 ? 'Medio' : 'Difícil';
  }

  let maxDigit;
  switch(normalizedNivel) {
    case "Fácil":
      maxDigit = 4; // Dígitos de 1-4
      break;
    case "Medio":
      maxDigit = 7; // Dígitos de 1-7
      break;
    case "Difícil":
      maxDigit = 9; // Dígitos de 1-9
      break;
    default:
      maxDigit = 9;
  }
  return Math.floor(Math.random() * maxDigit) + 1;
};

/**
 * Genera un número de 4 dígitos según el nivel de dificultad
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @returns {number} - Número de 4 dígitos
 */
export const generateNumberByNivel = (nivel) => {
  const digit1 = generateDigitByNivel(nivel);
  const digit2 = generateDigitByNivel(nivel);
  const digit3 = generateDigitByNivel(nivel);
  const digit4 = generateDigitByNivel(nivel);
  
  return parseInt(`${digit1}${digit2}${digit3}${digit4}`);
};

/**
 * Verifica si un ejercicio ya existe en el array
 * @param {Array} exercises - Array de ejercicios existentes
 * @param {number} num1 - Primer número
 * @param {number} num2 - Segundo número
 * @returns {boolean} - true si el ejercicio ya existe
 */
export const exerciseExists = (exercises, num1, num2) => {
  return exercises.some(
    (ex) => 
      (ex.number1 === num1 && ex.number2 === num2) ||
      (ex.number1 === num2 && ex.number2 === num1) 
  );
};

/**
 * Genera un ejercicio único según nivel de dificultad
 * @param {string} operationType - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {Array} existingExercises - Array de ejercicios ya generados
 * @returns {Object} - Objeto con el ejercicio generado
 */
export const generateUniqueExercise = (operationType, nivel, existingExercises) => {
  let num1, num2, attempts = 0;
  const maxAttempts = 100; 
  
  do {
    num1 = generateNumberByNivel(nivel);
    num2 = generateNumberByNivel(nivel);
    
    // Para restas, asegurar que num1 > num2
    if (operationType === "Restas" && num1 < num2) {
      [num1, num2] = [num2, num1]; // Intercambiar
    }
    
    // Si son iguales para restas, regenerar num2
    if (operationType === "Restas" && num1 === num2) {
      num2 = generateNumberByNivel(nivel);
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
    }
    
    attempts++;
    
    // Si hemos intentado muchas veces, salir del loop
    if (attempts > maxAttempts) {
      break;
    }
  } while (exerciseExists(existingExercises, num1, num2));
  
  const correctResult = operationType === "Sumas" 
    ? num1 + num2 
    : num1 - num2;
  
  return {
    operation_type: operationType,
    number1: num1,
    number2: num2,
    correct_result: correctResult,
    user_answer: null,
    is_correct: false,
    solved_at: null,
    is_blocked: false
  };
};

/**
 * Genera 8 ejercicios únicos
 * @param {string} operationType - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @returns {Array} - Array con 8 ejercicios únicos
 */
export const generateUniqueExercises = (operationType, nivel) => {
  const exercises = [];
  
  for (let i = 0; i < 8; i++) {
    const newExercise = generateUniqueExercise(operationType, nivel, exercises);
    exercises.push(newExercise);
  }
  
  return exercises;
};

/**
 * Guarda ejercicios en la base de datos
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {string} genero - "mujer" o "hombre" (ya no se usa en BD pero se mantiene por compatibilidad)
 * @param {Array} exercises - Array de ejercicios a guardar
 * @param {number} userId - ID del usuario
 * @param {number} levelId - ID del nivel (1: facil, 2: medio, 3: dificil)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const saveExercisesToStorage = async (kindOperation, nivel, genero, exercises, userId, levelId, token) => {
  try {
    const payload = {
      user_id: userId,
      level_id: levelId,
      operation_type: kindOperation, // "Sumas" o "Restas"
      exercises: exercises.map(ex => ({
        number1: ex.number1,
        number2: ex.number2,
        correct_result: ex.correct_result
      }))
    };
    
    const data = await apiSaveExercises(token, payload);
    return data;
    
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene ejercicios desde la base de datos
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {string} genero - "mujer" o "hombre"
 * @param {number} userId - ID del usuario
 * @param {number} levelId - ID del nivel
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array|null>} - Array de ejercicios o null
 */
export const getExercisesFromStorage = async (kindOperation, nivel, genero, userId, levelId, token) => {
  try {
    const data = await apiGetUserExercises(token, userId, levelId, kindOperation);
    return data;
    
  } catch (error) {
    return null;
  }
};

/**
 * Actualiza un ejercicio específico en la base de datos
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {string} genero - "mujer" o "hombre"
 * @param {number} exerciseIndex - Índice del ejercicio (ya no se usa)
 * @param {Object} updatedExercise - Ejercicio actualizado
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const updateExerciseInStorage = async (kindOperation, nivel, genero, exerciseIndex, updatedExercise, token) => {
  try {
    const payload = {
      user_answer: updatedExercise.user_answer,
      is_correct: updatedExercise.is_correct ? 1 : 0,
      solved_at: updatedExercise.solved_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    const data = await apiUpdateExercise(token, updatedExercise.id_exercise, payload);
    return data;
    
  } catch (error) {
    throw error;
  }
};

/**
 * Limpia ejercicios de un nivel Y tipo de operación específicos
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {number} userId - ID del usuario
 * @param {number} levelId - ID del nivel
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const clearExercisesByLevel = async (nivel, kindOperation, userId, levelId, token) => {
  try {
    const data = await apiDeleteLevelExercises(token, userId, levelId, kindOperation);
    return data;
    
  } catch (error) {
    throw error;
  }
};

/**
 * Genera ejercicios únicos que NO se parezcan a ejercicios anteriores
 * @param {string} operationType - "Sumas" o "Restas"
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @param {Array} previousExercises - Array de ejercicios anteriores a evitar (opcional)
 * @returns {Array} - Array con 8 ejercicios únicos y diferentes
 */
export const generateCompletelyNewExercises = (operationType, nivel, previousExercises = []) => {
  const exercises = [];
  const allExistingExercises = [...previousExercises]; // Incluir ejercicios anteriores
  
  for (let i = 0; i < 8; i++) {
    const newExercise = generateUniqueExercise(operationType, nivel, allExistingExercises);
    exercises.push(newExercise);
    allExistingExercises.push(newExercise); // Agregar al pool para evitar duplicados
  }
  
  return exercises;
};

/**
 * Mapea el nombre del nivel a su ID
 * @param {string|number} nivel - "Fácil", "Medio", "Difícil" o 1, 2, 3
 * @returns {number} - 1, 2, o 3
 */
export const mapNivelToId = (nivel) => {
  if (typeof nivel === 'number') {
    return nivel;
  }
  
  const nivelMap = {
    'Fácil': 1,
    'Medio': 2,
    'Difícil': 3
  };
  return nivelMap[nivel] || 1;
};

export const getStreak = async (token, userId, operationType) => {
  try {
    const { apiGetStreak } = await import('../services/api');
    const data = await apiGetStreak(token, userId, operationType);
    return data;
  } catch (error) {
    return { total: 0, levelCounts: { Fácil: 0, Medio: 0, Difícil: 0 } };
  }
};

/**
 * Incrementa la racha cuando el usuario responde correctamente
 */
export const incrementStreak = async (token, userId, operationType, nivel) => {
  try {
    const { apiUpdateStreak } = await import('../services/api');
    const data = await apiUpdateStreak(token, {
      user_id: userId,
      operation_type: operationType,
      nivel: nivel,
      action: 'increment'
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reinicia la racha cuando el usuario falla
 */
export const resetStreakOnFailure = async (token, userId, operationType) => {
  try {
    const { apiUpdateStreak } = await import('../services/api');
    const data = await apiUpdateStreak(token, {
      user_id: userId,
      operation_type: operationType,
      action: 'reset'
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza ejercicio en BD (versión simplificada para Exercise.jsx)
 */
export const updateExerciseInDB = async (token, exerciseId, payload) => {
  try {
    const { apiUpdateExercise } = await import('../services/api');
    const data = await apiUpdateExercise(token, exerciseId, payload);
    return data;
  } catch (error) {
    throw error;
  }
};