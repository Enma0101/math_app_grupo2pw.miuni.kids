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
export const saveExercisesToStorage = (kindOperation, nivel, genero, exercises) => {
  const storageKey = `exercises_${kindOperation}_${nivel}_${genero}`;
  localStorage.setItem(storageKey, JSON.stringify(exercises));
};

/**
 * Obtiene ejercicios desde localStorage
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} genero - "mujer" o "hombre"
 * @returns {Array|null} - Array de ejercicios o null si no existen
 */
export const getExercisesFromStorage = (kindOperation, nivel, genero) => {
  const storageKey = `exercises_${kindOperation}_${nivel}_${genero}`;
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Actualiza un ejercicio específico en localStorage
 * @param {string} kindOperation - "Sumas" o "Restas"
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} genero - "mujer" o "hombre"
 * @param {number} exerciseIndex - Índice del ejercicio a actualizar
 * @param {Object} updatedExercise - Ejercicio actualizado
 */
export const updateExerciseInStorage = (kindOperation, nivel, genero, exerciseIndex, updatedExercise) => {
  const exercises = getExercisesFromStorage(kindOperation, nivel, genero);
  if (exercises) {
    exercises[exerciseIndex] = updatedExercise;
    saveExercisesToStorage(kindOperation, nivel, genero, exercises);
  }
};

/**
 * Limpia ejercicios de un nivel Y tipo de operación específicos
 * @param {string} nivel - "Facil", "Medio", o "Dificil"
 * @param {string} kindOperation - "Sumas" o "Restas"
 */
export const clearExercisesByLevel = (nivel, kindOperation) => {
  Object.keys(localStorage).forEach((key) => {
    // Verifica que la clave tenga el formato: exercises_[kindOperation]_[nivel]_[genero]
    if (key.startsWith(`exercises_${kindOperation}_${nivel}_`)) {
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