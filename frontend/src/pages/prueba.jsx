import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Undo } from "lucide-react";

// Importa tus imágenes
import Background from "../assets/BackgroundLogin.svg";
import Backgroundgirl from "../assets/BackgroundLoginGirl.svg";
import Number2 from "../assets/Number2.png";
import Number1 from "../assets/Number1.png";
import Llama from "../assets/chubby-cute.gif";
import Number8 from "../assets/Number8.png";
import Number4 from "../assets/Number4.png";
import fondo1 from "../assets/fondo.svg";
import Check from "../assets/check.png";

// Función para generar un dígito según el nivel de dificultad
const generateDigitBynivel = (nivel) => {
  let maxDigit;
  switch(nivel) {
    case "Facil":
      maxDigit = 4;
      break;
    case "Medio":
      maxDigit = 7;
      break;
    case "Dificil":
      maxDigit = 9;
      break;
    default:
      maxDigit = 9;
  }
  return Math.floor(Math.random() * maxDigit) + 1; // Entre 1 y maxDigit
};

// Función para generar un número de 4 dígitos según el nivel
const generateNumberBynivel = (nivel) => {
  const digit1 = generateDigitBynivel(nivel);
  const digit2 = generateDigitBynivel(nivel);
  const digit3 = generateDigitBynivel(nivel);
  const digit4 = generateDigitBynivel(nivel);
  
  return parseInt(`${digit1}${digit2}${digit3}${digit4}`);
};

// Función para verificar si un ejercicio ya existe en el array
const exerciseExists = (exercises, num1, num2) => {
  return exercises.some(
    (ex) => 
      (ex.number1 === num1 && ex.number2 === num2) ||
      (ex.number1 === num2 && ex.number2 === num1) // También verifica el caso inverso
  );
};

// Función para generar un ejercicio único según nivel de dificultad
const generateUniqueExercise = (operationType, nivel, existingExercises) => {
  let num1, num2, attempts = 0;
  const maxAttempts = 100; // Prevenir loops infinitos
  
  do {
    num1 = generateNumberBynivel(nivel);
    num2 = generateNumberBynivel(nivel);
    
    // Para restas, asegurar que num1 > num2
    if (operationType === "Restas" && num1 < num2) {
      [num1, num2] = [num2, num1]; // Intercambiar
    }
    
    // Si son iguales para restas, regenerar num2
    if (operationType === "Restas" && num1 === num2) {
      num2 = generateNumberBynivel(nivel);
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
    }
    
    attempts++;
    
    // Si hemos intentado muchas veces, ajustar números manualmente
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

// Función para generar 8 ejercicios únicos
const generateUniqueExercises = (operationType, nivel) => {
  const exercises = [];
  
  for (let i = 0; i < 8; i++) {
    const newExercise = generateUniqueExercise(operationType, nivel, exercises);
    exercises.push(newExercise);
  }
  
  return exercises;
};

export default function Game() {
  const [TotalStar, setTotalStar] = useState(100);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { kindOperation, genero, nivel } = state || {}; // Agregamos nivel
  const resultado = kindOperation === "Sumas" ? "+" : "-";
  const [validationResult, setValidationResult] = useState(null);
  const [current_streak, setcurrent_streak] = useState(5);
  
  // Estado para almacenar los 8 ejercicios únicos
  const [exercises, setExercises] = useState([]);
  
  const [Bloked, setBloked] = useState({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  // Generar ejercicios al cargar el componente
  useEffect(() => {
    if (kindOperation && nivel) {
      // Verificar si ya hay ejercicios guardados para este tipo de operación y nivel
      const storageKey = `exercises_${kindOperation}_${nivel}_${genero}`;
      const storedExercises = localStorage.getItem(storageKey);
      
      if (storedExercises) {
        const parsed = JSON.parse(storedExercises);
        setExercises(parsed);
        
        // Actualizar estado de bloqueados basado en ejercicios completados
        const Bloked = {};
        parsed.forEach((exercise, index) => {
          Bloked[index] = exercise.is_correct;
        });
        setBloked(Bloked);
      } else {
        // Generar nuevos ejercicios únicos según el nivel
        const newExercises = generateUniqueExercises(kindOperation, nivel);
        setExercises(newExercises);
        localStorage.setItem(storageKey, JSON.stringify(newExercises));
      }
    }
  }, [kindOperation, nivel, genero]);

  const handlegoback = () => {
    navigate("/Seleccion", {
      state: { kindOperation: kindOperation, genero: genero, nivel: nivel },
    });
  };

  const handlegoExercise = (index) => {
    if (!Bloked[index] && exercises[index]) {
      // Navegar a la página de ejercicio con el ejercicio específico
      navigate("/Exercise", {
        state: { 
          exercise: exercises[index],
          exerciseIndex: index,
          kindOperation: kindOperation, 
          genero: genero,
          nivel: nivel,
          allExercises: exercises
        },
      });
    }
  };

  // Función para regenerar todos los ejercicios (útil para testing)
  const regenerateExercises = () => {
    const newExercises = generateUniqueExercises(kindOperation, nivel);
    setExercises(newExercises);
    const storageKey = `exercises_${kindOperation}_${nivel}_${genero}`;
    localStorage.setItem(storageKey, JSON.stringify(newExercises));
    
    // Resetear bloqueados
    setBloked({
      0: false, 1: false, 2: false, 3: false,
      4: false, 5: false, 6: false, 7: false,
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {genero === "mujer" ? (
        <img
          src={Backgroundgirl}
          draggable={false}
          alt="Background"
          className="absolute w-full h-full object-cover object-center"
        />
      ) : (
        <img
          src={Background}
          draggable={false}
          alt="Background"
          className="absolute w-full h-full object-cover object-center"
        />
      )}

      <div
        className={`absolute top-0 left-0 right-0 z-20  py-4 sm:py-6 md:py-15 lg:py-20 px-4 md:px-10"
        ${
          genero === "mujer"
            ? "bg-ground-custom-girl"
            : genero === "hombre"
            ? "bg-ground-custom"
            : "bg-gray-400"
        }`}
      >
        <nav
          className={`absolute top-0 left-0 right-0 z-30 py-4 sm:py-6 md:py-15 lg:py-20 px-4 md:px-10"
        ${
          genero === "mujer"
            ? "bg-custom-gradient-girl"
            : genero === "hombre"
            ? "bg-custom-gradient"
            : "bg-gray-400"
        }`}
        >
          <div className="absolute top-5 left-8 right-18 justify-between flex">
            <svg width="0" height="0">
              <filter
                id="inner-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feOffset dx="3" dy="3" />
                <feGaussianBlur stdDeviation="3" result="offset-blur" />
                <feComposite
                  operator="out"
                  in="SourceGraphic"
                  in2="offset-blur"
                  result="inverse"
                />
                <feFlood floodColor="rgba(0,0,0,0.5)" result="color" />
                <feComposite
                  operator="in"
                  in="color"
                  in2="inverse"
                  result="shadow"
                />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
            </svg>
            <div className="flex-1 flex justify-start items-start">
              {genero === "mujer" ? (
                <h1
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-bold"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFFFFF",
                    textShadow: "-10px 0px #852526",
                    filter: "url(#inner-shadow)",
                  }}
                >
                  Math{" "}
                  <span style={{ display: "block", textIndent: "4ch" }}>
                    School
                  </span>
                </h1>
              ) : (
                <h1
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-bold"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                    textShadow: "-10px 0px #262A51",
                    filter: "url(#inner-shadow)",
                  }}
                >
                  Math{" "}
                  <span style={{ display: "block", textIndent: "4ch" }}>
                    School
                  </span>
                </h1>
              )}
            </div>
            <div className="flex-1 flex justify-center items-center">
              {genero === "mujer" ? (
                <img
                  src={Number1}
                  draggable={false}
                  alt="Numbers"
                  className="w-25 h-30 object-contain"
                />
              ) : (
                <img
                  src={Number2}
                  draggable={false}
                  alt="Numbers"
                  className="w-25 h-30 object-contain"
                />
              )}

              {genero === "mujer" ? (
                kindOperation === "Sumas" ? (
                  <h1
                    className="sm:text-3xl md:text-5xl lg:text-5xl "
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#852526",
                    }}
                  >
                    ¡Vamos a Sumar!{" "}
                    <span
                      style={{
                        display: "block",
                        marginTop: "25px",
                        color: "#ffff",
                      }}
                    >
                      Nivel: {nivel}
                    </span>
                  </h1>
                ) : (
                  <h1
                    className="sm:text-3xl md:text-5xl lg:text-5xl "
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#852526",
                    }}
                  >
                    ¡Vamos a Restar!{" "}
                    <span
                      style={{
                        display: "block",
                        marginTop: "25px",
                        color: "#ffff",
                      }}
                    >
                      Nivel: {nivel}
                    </span>
                  </h1>
                )
              ) : kindOperation === "Sumas" ? (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-5xl "
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                  }}
                >
                  ¡Vamos a Sumar!{" "}
                  <span
                    style={{
                      display: "block",
                      marginTop: "25px",
                      color: "#262A51",
                    }}
                  >
                    Nivel: {nivel}
                  </span>
                </h1>
              ) : (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-5xl "
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                  }}
                >
                  ¡Vamos a Restar!{" "}
                  <span
                    style={{
                      display: "block",
                      marginTop: "25px",
                      color: "#262A51",
                    }}
                  >
                    Nivel: {nivel}
                  </span>
                </h1>
              )}
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center gap-4">
                {current_streak > 0 && (
                  <div className="flex items-center gap-4">
                    <h1
                      className="sm:text-3xl md:text-5xl lg:text-6xl bg-clip-text text-transparent"
                      style={{
                        fontFamily: "Kavoon, cursive",
                        backgroundImage:
                          "linear-gradient(to right, #ee5f00ff, #FFB212)",
                      }}
                    >
                      Racha{" "}
                      <span className="inline-block">{current_streak}</span>
                    </h1>

                    <img
                      src={Llama}
                      draggable={false}
                      alt="Numbers"
                      className="w-30 h-30 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="absolute top-50 right-0 w-45 h-50 z-50">
        <img
          src={Number8}
          alt="number8"
          className="w-45 h-50 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-5 left-0 w-40 h-40  z-50">
        <img
          src={Number4}
          alt="number4"
          className="w-40 h-40 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute top-42 bottom-5 left-15 right-15 rounded-3xl z-10 shadow-3xl overflow-hidden">
        <img
          src={fondo1}
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          draggable={false}
        />

        <div className="absolute z-50 w-full h-full p-10 flex items-center justify-center">
          <div className="absolute grid grid-cols-4 grid-rows-2 gap-x-10  -translate-y-10">
            {/* Checks para ejercicios completados */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
              const positions = [
                { top: "top-50", left: "left-70" },
                { top: "top-50", left: "left-172" },
                { top: "top-50", left: "left-270" },
                { top: "top-50", left: "left-368" },
                { top: "top-130", left: "left-70" },
                { top: "top-130", left: "left-172" },
                { top: "top-130", left: "left-270" },
                { top: "top-130", left: "left-368" },
              ];

              return Bloked[index] ? (
                <div
                  key={`check-${index}`}
                  className={`absolute w-20 h-20 ${positions[index].top} ${positions[index].left} z-100`}
                >
                  <img
                    src={Check}
                    draggable={false}
                    alt="Completado"
                    className="absolute w-20 h-20 object-cover object-center"
                  />
                </div>
              ) : null;
            })}

            {/* Renderizar los 8 contenedores con ejercicios dinámicos */}
            {exercises.map((exercise, index) => {
              const marginClass = index % 4 === 0 ? "ml-4" : "ml-8";
              
              return (
                <button
                  key={`exercise-${index}`}
                  onClick={() => handlegoExercise(index)}
                  className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-7 shadow-inner transition-transform mt-3 sm:mt-5 ${marginClass} ${
                    !Bloked[index] ? "transition-all duration-300 hover:scale-110" : ""
                  }`}
                  style={{
                    fontFamily: "Sansation, cursive",
                    color: "#FFFFFF",
                    filter: Bloked[index] ? "grayscale(20%) brightness(0.70)" : "none",
                  }}
                  disabled={Bloked[index]}
                >
                  <div className="relative z-10">
                    <p className="text-white text-6xl font-bold leading-tight text-right">
                      {exercise.number1} <span className="text-8xl">{resultado}</span>
                    </p>
                    <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                      {exercise.number2}
                    </p>
                    <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                    {/* Mostrar resultado solo si está resuelto */}
                    <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                      {exercise.is_correct ? exercise.correct_result : "????"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className=" absolute  bottom-10 right-20 z-30 ">
        {genero === "mujer" ? (
          <button
            onClick={handlegoback}
            className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#ffffff",
            }}
          >
            Regresar
          </button>
        ) : (
          <button
            onClick={handlegoback}
            className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFB212",
            }}
          >
            Regresar
          </button>
        )}
      </div>
    </div>
  );
}