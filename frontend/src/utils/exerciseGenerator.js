// exerciseGenerator.js
// Archivo de utilidades para generar ejercicios matemáticos únicos

/**
 * Genera un dígito aleatorio según el nivel de dificultad
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @returns {number} - Dígito entre 1 y el máximo según nivel
 */
export const generateDigitByNivel = (nivel) => {
  let maxDigit;
  switch(nivel) {
    case "Facil":
      maxDigit = 4; // Dígitos de 1-4
      break;
    case "Medio":
      maxDigit = 7; // Dígitos de 1-7
      break;
    case "Dificil":
      maxDigit = 9; // Dígitos de 1-9
      break;
    default:
      maxDigit = 9;
  }
  return Math.floor(Math.random() * maxDigit) + 1;
};

/**
 * Genera un número de 4 dígitos según el nivel de dificultad
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
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
      (ex.number1 === num2 && ex.number2 === num1) // También verifica inverso
  );
};

/**
 * Genera un ejercicio único según nivel de dificultad
 * @param {string} operationType - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {Array} existingExercises - Array de ejercicios ya generados
 * @returns {Object} - Objeto con el ejercicio generado
 */
export const generateUniqueExercise = (operationType, nivel, existingExercises) => {
  let num1, num2, attempts = 0;
  const maxAttempts = 100; // Prevenir loops infinitos
  
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
    id_exercise: Date.now() + Math.random(), // ID temporal único
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
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
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
 * Guarda ejercicios en localStorage
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} genero - "mujer" o "hombre"
 * @param {Array} exercises - Array de ejercicios a guardar
 */
export const saveExercisesToStorage = (userId, kindOperation, nivel, genero, exercises) => {
  if(!userId) return;
  const storageKey = `exercises_${userId}_${kindOperation}_${nivel}_${genero}`;
  localStorage.setItem(storageKey, JSON.stringify(exercises));
};

/**
 * Obtiene ejercicios desde localStorage
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} genero - "mujer" o "hombre"
 * @returns {Array|null} - Array de ejercicios o null si no existen
 */
export const getExercisesFromStorage = (userId, kindOperation, nivel, genero) => {
  if(!userId) return null;
  const newKey = `exercises_${userId}_${kindOperation}_${nivel}_${genero}`;
  const storedNew = localStorage.getItem(newKey);
  if(storedNew) return JSON.parse(storedNew);
  // Intentar migración desde clave antigua (sin userId) solo una vez
  const legacyKey = `exercises_${kindOperation}_${nivel}_${genero}`;
  const legacy = localStorage.getItem(legacyKey);
  if(legacy){
    // Migrar y eliminar legacy para evitar que otro usuario la copie
    localStorage.setItem(newKey, legacy);
    localStorage.removeItem(legacyKey);
    return JSON.parse(legacy);
  }
  return null;
};

/**
 * Actualiza un ejercicio específico en localStorage
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} genero - "mujer" o "hombre"
 * @param {number} exerciseIndex - Índice del ejercicio a actualizar
 * @param {Object} updatedExercise - Ejercicio actualizado
 */
export const updateExerciseInStorage = (userId, kindOperation, nivel, genero, exerciseIndex, updatedExercise) => {
  const exercises = getExercisesFromStorage(userId, kindOperation, nivel, genero);
  if (exercises) {
    exercises[exerciseIndex] = updatedExercise;
    saveExercisesToStorage(userId, kindOperation, nivel, genero, exercises);
  }
};

/**
 * Limpia ejercicios de un nivel Y tipo de operación específicos
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} kindOperation - "Sumas" o "Restas"
 */
export const clearExercisesByLevel = (userId, nivel, kindOperation) => {
  if(!userId) return;
  Object.keys(localStorage).forEach((key) => {
    // Formato nuevo: exercises_{userId}_{kindOperation}_{nivel}_{genero}
    if (key.startsWith(`exercises_${userId}_${kindOperation}_${nivel}_`)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Genera ejercicios únicos que NO se parezcan a ejercicios anteriores
 * @param {string} operationType - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
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

// ===================== STREAK (RACHA) UTILITIES =====================
// Estructura en localStorage por usuario y tipo de operación:
// Key: streak_{userId}_{operationType}
// Value: {
//   total: number,               // racha total acumulada (consecutivos correctos)
//   levelCounts: { Facil:number, Medio:number, Dificil:number } // aportes por nivel
// }

const STREAK_LEVELS = ['Facil','Medio','Dificil'];

function buildStreakKey(userId, operationType){
  return `streak_${userId}_${operationType}`; // operationType: 'Sumas' | 'Restas'
}

export function getStreak(userId, operationType){
  if(!userId || !operationType) return { total:0, levelCounts: {Facil:0,Medio:0,Dificil:0} };
  try {
    const raw = localStorage.getItem(buildStreakKey(userId, operationType));
    if(!raw) return { total:0, levelCounts: {Facil:0,Medio:0,Dificil:0} };
    const parsed = JSON.parse(raw);
    // asegurar estructura
    return {
      total: typeof parsed.total === 'number' ? parsed.total : 0,
      levelCounts: {
        Facil: parsed?.levelCounts?.Facil || 0,
        Medio: parsed?.levelCounts?.Medio || 0,
        Dificil: parsed?.levelCounts?.Dificil || 0,
      }
    };
  } catch { return { total:0, levelCounts:{Facil:0,Medio:0,Dificil:0} }; }
}

function saveStreak(userId, operationType, data){
  if(!userId || !operationType) return;
  localStorage.setItem(buildStreakKey(userId, operationType), JSON.stringify(data));
}

// Incrementa racha global y del nivel (solo si se mantiene consecutividad de aciertos)
export function incrementStreak(userId, operationType, nivel){
  const streak = getStreak(userId, operationType);
  // nivel conteo
  if(!STREAK_LEVELS.includes(nivel)) nivel = 'Facil';
  streak.levelCounts[nivel] += 1;
  streak.total += 1;
  saveStreak(userId, operationType, streak);
  return streak;
}

// Reinicia completamente la racha para esa operación (por fallo)
export function resetStreakOnFailure(userId, operationType){
  const cleared = { total:0, levelCounts:{Facil:0,Medio:0,Dificil:0} };
  saveStreak(userId, operationType, cleared);
  return cleared;
}

// Reinicia solo la contribución de un nivel (por reinicio de ejercicios del nivel)
export function resetStreakLevel(userId, operationType, nivel){
  const streak = getStreak(userId, operationType);
  if(STREAK_LEVELS.includes(nivel)){
    const subtract = streak.levelCounts[nivel];
    streak.total = Math.max(0, streak.total - subtract);
    streak.levelCounts[nivel] = 0;
    saveStreak(userId, operationType, streak);
  }
  return streak;
}
