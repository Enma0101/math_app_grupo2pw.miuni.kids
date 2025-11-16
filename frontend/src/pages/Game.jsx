import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { LogOut, Undo, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";

import Background from "../assets/BackgroundLogin.svg";
import Backgroundgirl from "../assets/BackgroundLoginGirl.svg";
import Number2 from "../assets/Number2.png";
import Number1 from "../assets/Number1.png";
import Llama from "../assets/chubby-cute.gif";
import Number8 from "../assets/Number8.png";
import Number4 from "../assets/Number4.png";
import fondo1 from "../assets/fondo.svg";
import Check from "../assets/check.png";
import {
  generateUniqueExercises,
  getExercisesFromStorage,
  saveExercisesToStorage,
  clearExercisesByLevel,
  generateCompletelyNewExercises,
  mapNivelToId,
} from "../utils/exerciseGenerator";

import { useAuth } from "../context/AuthContext";
import { useAudio } from "../components/AudioManager";
import { apiGetProgress, apiGetStarsForLevel, apiGetStreak, apiResetStreak } from "../services/api";

export default function Game() {
  
  const { state } = useLocation();
  const navigate = useNavigate();
  const { kindOperation, genero, nivel } = state || {};
  const resultado = kindOperation === "Sumas" ? "+" : "-";
  const { playClick, playClickButton } = useAudio();

  const [stars, setStars] = useState(0);
  const [current_streak, setcurrent_streak] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Bloked, setBloked] = useState({
    0: false, 1: false, 2: false, 3: false,
    4: false, 5: false, 6: false, 7: false,
  });

  const { token, user } = useAuth(); 
  const userId = user?.id_user; 
  const levelId = mapNivelToId(nivel);

  // Verificar si todos los ejercicios están completados
  const allExercisesCompleted = Object.values(Bloked).every(value => value === true);

  const loadStars = async () => {
    const res = await apiGetStarsForLevel(token, levelId);
    setStars(res.stars);
  };


  const loadStreak = async () => {
    if (token && userId && kindOperation && nivel) {
      try {
        const streakResponse = await apiGetStreak(token, userId, kindOperation);
       
        
        const streakData = Array.isArray(streakResponse) ? streakResponse[0] : streakResponse;
        
        if (streakData) {
          // Mapear nivel a dificultad
          let difficulty;
          if (typeof nivel === 'number') {
            difficulty = nivel === 1 ? 'facil' : nivel === 2 ? 'medio' : 'dificil';
          } else {
            const nivelLower = nivel.toLowerCase();
            difficulty = nivelLower === 'fácil' ? 'facil' : 
                        nivelLower === 'medio' ? 'medio' : 'dificil';
          }
          
          const currentLevelStreak = streakData[`${difficulty}_count`] || 0;
          setcurrent_streak(currentLevelStreak);
         
        } else {
          setcurrent_streak(0);
        }
      } catch (error) {
          
        setcurrent_streak(0);
      }
    }
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    loadStars();
    loadStreak();
  }, [levelId, kindOperation, nivel]);

  useEffect(() => {
    if (hasInitialized.current) {
      
      return;
    }

    const loadExercises = async () => {
      if (!kindOperation || !nivel || !userId || !token) {
        
        setIsLoading(false);
        return;
      }

      hasInitialized.current = true;

      try {
        setIsLoading(true);
       

        const storedExercises = await getExercisesFromStorage(
          kindOperation,
          nivel,
          genero,
          userId,
          levelId,
          token
        );

        if (storedExercises && storedExercises.length > 0) {
      
          setExercises(storedExercises);

          const newBloked = {};
          storedExercises.forEach((exercise, index) => {
            newBloked[index] = exercise.is_correct === true || exercise.is_correct === 1;
          });
          setBloked(newBloked);
        } else {
         
          const newExercises = generateUniqueExercises(kindOperation, nivel);

          
   
          await saveExercisesToStorage(
            kindOperation, 
            nivel, 
            genero, 
            newExercises, 
            userId, 
            levelId, 
            token
          );
       

        
          const freshExercises = await getExercisesFromStorage(
            kindOperation,
            nivel,
            genero,
            userId,
            levelId,
            token
          );

          if (freshExercises && freshExercises.length > 0) {
           
            setExercises(freshExercises);
          } else {
           
            setExercises(newExercises);
          }
        }
      } catch (error) {
         
        const newExercises = generateUniqueExercises(kindOperation, nivel);
        setExercises(newExercises);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [kindOperation, nivel, genero, userId, token, levelId]);

  const handlegoback = () => {
    playClickButton();
    navigate("/Seleccion", {
      state: {
        kindOperation: kindOperation,
        genero: genero,
        nivel: nivel,
      },
    });
  };

  const handleResetLevel = async () => {
    playClickButton();
    
    if (!userId || !token) {
     
      return;
    }

    const result = await Swal.fire({
      title: `¿Reiniciar ejercicios de ${kindOperation.toUpperCase()} - Nivel ${nivel === 1 ? "Fácil" : nivel === 2 ? "Medio" : nivel === 3 ? "Difícil" : nivel}?`,
      text: "Se perderá todo el progreso de este nivel y se generarán 8 nuevos ejercicios.",
      icon: "question",
      color: "#5c5b5bff",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#F44336",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, reiniciar",
      customClass: {
        popup: "font-kavoon shadow-lg alerta-redondeada",
        confirmButton: "mi-boton-confirmar",
        cancelButton: "mi-boton-cancelar",
        title: "mi-alerta-titulo",
        htmlContainer: "mi-alerta-texto",
      },
    });

    if (result.isConfirmed) {
      try {
        const currentExercises = [...exercises];


        await clearExercisesByLevel(nivel, kindOperation, userId, levelId, token);
       
        
        
        try {
          // Mapear nivel a dificultad
          let difficulty;
          if (typeof nivel === 'number') {
            difficulty = nivel === 1 ? 'facil' : nivel === 2 ? 'medio' : 'dificil';
          } else {
            const nivelLower = nivel.toLowerCase();
            difficulty = nivelLower === 'fácil' ? 'facil' : 
                        nivelLower === 'medio' ? 'medio' : 'dificil';
          }

          
          await apiResetStreak(token, {
            user_id: userId,
            operation_type: kindOperation,
            difficulty: difficulty
          });
          
          setcurrent_streak(0); // Resetear visualmente
        } catch (streakError) {
    
        }
        

        const newExercises = generateCompletelyNewExercises(
          kindOperation,
          nivel,
          currentExercises
        );


 
        await saveExercisesToStorage(
          kindOperation, 
          nivel, 
          genero, 
          newExercises, 
          userId, 
          levelId, 
          token
        );
 


        const freshExercises = await getExercisesFromStorage(
          kindOperation,
          nivel,
          genero,
          userId,
          levelId,
          token
        );

        if (freshExercises && freshExercises.length > 0) {

          setExercises(freshExercises);
        } else {
          setExercises(newExercises);
        }

        setBloked({
          0: false, 1: false, 2: false, 3: false,
          4: false, 5: false, 6: false, 7: false,
        });

        Swal.fire({
          title: "¡Reiniciado!",
          text: "Los ejercicios y la racha del nivel han sido reseteados.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "font-kavoon shadow-lg alerta-redondeada",
          },
        });
      } catch (error) {
         
        Swal.fire({
          title: "Error",
          text: "No se pudieron resetear los ejercicios",
          icon: "error",
          customClass: {
            popup: "font-kavoon shadow-lg alerta-redondeada",
          },
        });
      }
    }
  };

  const handlegoExercise = (index) => {
    if (!Bloked[index] && exercises[index]) {
      playClickButton();
      navigate("/Exercise", {
        state: {
          exercise: exercises[index],
          exerciseIndex: index,
          kindOperation: kindOperation,
          genero: genero,
          nivel: levelId,
          allExercises: exercises,
          stars: stars
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 text-white flex items-center justify-center">
        <h2 className="text-5xl" style={{ fontFamily: "Kavoon, cursive" }}>
          Cargando ejercicios...
        </h2>
      </div>
    );
  }


  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo */}

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

      {/* Overlay oscuro cuando todos los ejercicios están completados */}
      {allExercisesCompleted && (
        <div className="absolute inset-0 bg-black/60 z-40" />
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
        {/* Navbar */}
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
          {/* Logo y Título */}
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
              {/* Imagen numeros 2*/}

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
                        marginLeft: "50px",
                        color: "#ffff",
                      }}
                    >
                      Nivel: {nivel === 1 ? "Fácil" : nivel === 2 ? "Medio" : nivel === 3 ? "Difícil" : nivel}
                    
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
                        marginLeft: "50px",
                        color: "#ffff",
                      }}
                    >
                    Nivel: {nivel === 1 ? "Fácil" : nivel === 2 ? "Medio" : nivel === 3 ? "Difícil" : nivel}
                   
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
                      marginLeft: "50px",
                      color: "#262A51",
                    }}
                  >
                  Nivel: {nivel === 1 ? "Fácil" : nivel === 2 ? "Medio" : nivel === 3 ? "Difícil" : nivel}
                    
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
                      marginLeft: "50px",
                      color: "#262A51",
                    }}
                  >
                   Nivel: {nivel === 1 ? "Fácil" : nivel === 2 ? "Medio" : nivel === 3 ? "Difícil" : nivel}
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

      <div className="absolute top-40 right-0 w-30 h-35 z-50">
        <img
          src={Number8}
          alt="number8"
          className="w-30 h-35 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-5 left-0 w-30 h-30  z-50">
        <img
          src={Number4}
          alt="number4"
          className="w-30 h-30 object-contain"
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
            {Bloked[0] ? (
              <div className=" absolute w-20 h-20 top-50  left-72 z-120">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[1] ? (
              <div className=" absolute w-20 h-20 top-50  left-180 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[2] ? (
              <div className=" absolute w-20 h-20 top-50  left-285 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[3] ? (
              <div className=" absolute w-20 h-20 top-50  left-388 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[4] ? (
              <div className=" absolute w-20 h-20 top-130  left-72 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[5] ? (
              <div className=" absolute w-20 h-20 top-130  left-180 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[6] ? (
              <div className=" absolute w-20 h-20 top-130  left-285 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[7] ? (
              <div className=" absolute w-20 h-20 top-130  left-388 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}

         
            {exercises.map((exercise, index) => {
              const marginClass = index % 4 === 0 ? "ml-4" : "ml-8";

              // Separar dígitos individuales para alineación perfecta
              const num1Digits = exercise.number1
                .toString()
                .padStart(4, " ")
                .split("");
              const num2Digits = exercise.number2
                .toString()
                .padStart(4, " ")
                .split("");
              const resultDigits = exercise.is_correct
                ? exercise.correct_result.toString().padStart(5, " ").split("")
                : ["", "", "", "", ""];

              return (
                <button
                  key={`exercise-${index}`}
                  onClick={() => handlegoExercise(index)}
                  onMouseEnter={() => !Bloked[index] && playClick()}
                  className={`relative backdrop-blur-sm rounded-4xl w-87 h-75 flex flex-col border-4 border-black/20 px-7 shadow-inner transition-transform mt-3 sm:mt-5 ${marginClass} ${
                    !Bloked[index]
                      ? "transition-all duration-300 hover:scale-110"
                      : ""
                  }`}
                  style={{
                    fontFamily: "Sansation, cursive",
                    color: "#FFFFFF",
                    filter: Bloked[index]
                      ? "grayscale(20%) brightness(0.70)"
                      : "none",
                  }}
                  disabled={Bloked[index]}
                >
                  <div className="relative z-10 flex flex-col items-end pl-4">
                    {/* Primera línea: operador + número1 */}
                    <div className="flex items-center gap-1">
                      {num1Digits.map((digit, i) => (
                        <span
                          key={`num1-${i}`}
                          className="text-6xl font-bold text-white w-10 text-center"
                          style={{ fontFamily: "Sansation" }}
                        >
                          {digit}
                        </span>
                      ))}
                      <span className="text-9xl font-bold text-white w-10 text-center ml-3 mr-4">
                        {resultado}
                      </span>
                    </div>

                    {/* Segunda línea: número2 */}
                    <div className="flex items-center gap-1">
                      {/* Espacio para alinear con el operador de arriba */}

                      {num2Digits.map((digit, i) => (
                        <span
                          key={`num2-${i}`}
                          className="text-6xl font-bold text-white w-10 text-center"
                          style={{ fontFamily: "Sansation" }}
                        >
                          {digit}
                        </span>
                      ))}
                      <span className="w-10 ml-8"></span>
                    </div>

                    {/* Línea divisoria */}
                    <div className="w-full h-2 bg-white mt-2 mb-2 opacity-80"></div>

                    {/* Resultado con espacio extra para 5to dígito */}
                    <div className="flex items-center gap-1">
                      {/* Espacio para alinear con el operador */}

                      {resultDigits.map((digit, i) => (
                        <span
                          key={`result-${i}`}
                          className="text-6xl font-bold text-white opacity-90 w-10 text-center "
                          style={{ fontFamily: "Sansation" }}
                        >
                          {digit}
                        </span>
                      ))}
                      <span className="w-10 ml-8"></span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón de reiniciar centrado cuando todos los ejercicios están completados */}
      {allExercisesCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="text-center">
            <h2
              className="text-7xl mb-10 text-shadow-lg"
              style={{
                fontFamily: "Kavoon, cursive",
                color: genero === "mujer" ? "#ffffff" : "#FFB212",
              }}
            >
              ¡Nivel Completado!
            </h2>
            <button
              onClick={handleResetLevel}
              onMouseEnter={() => playClick()}
              className="text-6xl flex items-center gap-4 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-110 transition-transform text-shadow-lg mx-auto"
              style={{
                fontFamily: "Kavoon, cursive",
                color: genero === "mujer" ? "#ffffff" : "#FFB212",
              }}
            >
              Reiniciar Nivel <RotateCcw className="w-15 h-15" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Botones inferiores - solo se muestran si NO todos los ejercicios están completados */}
      {!allExercisesCompleted && (
        <>
          <div className=" absolute flex items-center  bottom-10 right-20 z-30 ">
            {/* Botón regresar */}
            {genero === "mujer" ? (
              <button
                onClick={handlegoback}
                onMouseEnter={() => playClick()}
                className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg mr-15"
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
                onMouseEnter={() => playClick()}
                className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg mr-15"
                style={{
                  fontFamily: "Kavoon, cursive",
                  color: "#FFB212",
                }}
              >
                Regresar
                </button>
            ) }
           
          </div>
          
          <div className=" absolute flex items-center  bottom-10 left-40 z-30 ">
            {/* Botón reiniciar */}
            {genero === "mujer" ? (
              <button
                onClick={handleResetLevel}
                onMouseEnter={() => playClick()}
                className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg mr-15"
                style={{
                  fontFamily: "Kavoon, cursive",
                  color: "#ffffff",
                }}
              >
                Reiniciar <RotateCcw className="w-10 h-10 " strokeWidth={3} />
              </button>
            ) : (
              <button
                onClick={handleResetLevel}
                onMouseEnter={() => playClick()}
                className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg mr-15"
                style={{
                  fontFamily: "Kavoon, cursive",
                  color: "#FFB212",
                }}
              >
                Reiniciar <RotateCcw className="w-10 h-10 " strokeWidth={3} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
            