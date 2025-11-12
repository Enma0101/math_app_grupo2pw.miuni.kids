import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";

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
import Cross from "../assets/Cross Mark.png";
import StarR from "../assets/starR.png";
import Cat from "../assets/catawesome.gif";
import Catsad from "../assets/catsad.gif";
import { updateExerciseInStorage, getStreak, incrementStreak, resetStreakOnFailure } from "../utils/exerciseGenerator";
import { useAudio } from "../components/AudioManager";
import { useAuth } from "../context/AuthContext";
import { apiAttemptExercise } from "../services/api";

export default function Exercise({ onExit }) {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ IMPORTAR FUNCIONES DE AUDIO
  const { playClick, playClickButton, playCorrect, playCorrect2, playincorrect, pauseAudio , addnumber,playAudio } = useAudio();
  const { token, user } = useAuth();

  // ✅ PAUSAR MÚSICA DE FONDO AL ENTRAR (solo audio)
  useEffect(() => {
    pauseAudio();
    return () => { playAudio(); };
  }, [pauseAudio, playAudio]);

  // ✅ RECIBIR DATOS DESDE GAME
  const {
    exercise,
    exerciseIndex,
    kindOperation,
    genero,
    nivel,
    allExercises,
  } = state || {};

  // ✅ Cargar racha persistida por usuario/operación
  useEffect(() => {
    if (user?.id_user && kindOperation) {
      const st = getStreak(user.id_user, kindOperation);
      setcurrent_streak(st?.total || 0);
    }
  }, [user?.id_user, kindOperation]);

  // Estados básicos
  // Eliminados estados no utilizados: userName, TotalStar
  const [current_streak, setcurrent_streak] = useState(0);
  const [Star_for_level] = useState(3);

  // ✅ USAR LOS DATOS DEL EJERCICIO RECIBIDO
  const [operation, setOperation] = useState("+");
  const [num1, setNum1] = useState("0000");
  const [num2, setNum2] = useState("0000");
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Acumuladores de "llevo" para cada posición
  const [carries, setCarries] = useState([0, 0, 0, 0]);

  // Respuesta del usuario (5 dígitos)
  const [answer, setAnswer] = useState(["", "", "", "", ""]);

  const [validationResult, setValidationResult] = useState(null);

  // ✅ CARGAR EL EJERCICIO AL MONTAR EL COMPONENTE
  useEffect(() => {
    if (exercise) {
      // Configurar operación
      setOperation(exercise.operation_type === "Sumas" ? "+" : "-");

      // Configurar números (asegurar 4 dígitos)
      setNum1(exercise.number1.toString().padStart(4, "0"));
      setNum2(exercise.number2.toString().padStart(4, "0"));

      // Configurar respuesta correcta
      setCorrectAnswer(exercise.correct_result.toString());
    }
  }, [exercise]);

  const isCarryEnabled = () => true;

  // Verificar si un cuadro de respuesta está habilitado
  const isAnswerEnabled = (index) => {
    if (index === 4) return true;
    return answer[index + 1] !== "";
  };

  // Cambiar el valor de un acumulador de "llevo"
  const handleCarryClick = (index) => {
    if (!isCarryEnabled(index)) return;

    const newCarries = [...carries];
    newCarries[index] = (newCarries[index] + 1) % 10;
    setCarries(newCarries);
  };

  // Cambiar el valor de un dígito de respuesta
  const handleAnswerClick = (index) => {
    if (!isAnswerEnabled(index)) return;

    const newAnswer = [...answer];
    newAnswer[index] =
      newAnswer[index] === ""
        ? "0"
        : String((parseInt(newAnswer[index]) + 1) % 10);
    setAnswer(newAnswer);
    setValidationResult(null);
  };

  // ✅ FUNCIÓN PARA VERIFICAR LA RESPUESTA
  const handleVerify = async () => {
    // Contar dígitos llenados desde la derecha
    let filledCount = 0;
    for (let i = 4; i >= 0; i--) {
      if (answer[i] !== "") {
        filledCount++;
      } else {
        break;
      }
    }

    let userAnswerString = "";

    if (filledCount > 0) {
      const startIndex = 5 - filledCount;
      userAnswerString = answer.slice(startIndex).join("");

      // Validar
      if (userAnswerString === correctAnswer) {
        setValidationResult("correct");
        
        // ✅ REPRODUCIR SONIDO DE CORRECTO
        playCorrect();
        
        // ✅ AUMENTAR RACHA PERSISTENTE Y REPRODUCIR SONIDO ESPECIAL
        if (user?.id_user && kindOperation) {
          const st = incrementStreak(user.id_user, kindOperation, nivel);
          setcurrent_streak(st.total);
          playCorrect2();
        }

        // ✅ ACTUALIZAR EL EJERCICIO EN STORAGE
        const updatedExercise = {
          ...exercise,
          is_correct: true,
          user_answer: parseInt(userAnswerString),
          solved_at: new Date().toISOString(),
        };

        if(user?.id_user){
          updateExerciseInStorage(
            user.id_user,
            kindOperation,
            nivel,
            genero,
            exerciseIndex,
            updatedExercise
          );
        }

        // Enviar intento correcto al backend (no altera la lógica del front)
        try {
          if (token && user?.id_user) {
            const levelMap = { "Facil": 1, "Medio": 2, "Dificil": 3 };
            await apiAttemptExercise(token, {
              user_id: user.id_user,
              level_id: levelMap[nivel] || 1,
              operation_type: kindOperation,
              number1: exercise.number1,
              number2: exercise.number2,
              correct_result: exercise.correct_result,
              user_answer: parseInt(userAnswerString),
              is_correct: true,
              is_blocked: false,
              solved_at: new Date().toISOString()
            });
          }
        } catch(e) {
          console.warn('Falló registro de intento correcto:', e?.message);
        }
      } else {
        setValidationResult("incorrect");
        
        // ✅ REPRODUCIR SONIDO DE INCORRECTO
        playincorrect();
        // Reiniciar racha completa por fallo
        if (user?.id_user && kindOperation) {
          const st = resetStreakOnFailure(user.id_user, kindOperation);
          setcurrent_streak(st.total);
        }
        // Enviar intento incorrecto (is_blocked true) al backend
        try {
          if (token && user?.id_user) {
            const levelMap = { "Facil": 1, "Medio": 2, "Dificil": 3 };
            await apiAttemptExercise(token, {
              user_id: user.id_user,
              level_id: levelMap[nivel] || 1,
              operation_type: kindOperation,
              number1: exercise.number1,
              number2: exercise.number2,
              correct_result: exercise.correct_result,
              user_answer: userAnswerString ? parseInt(userAnswerString) : null,
              is_correct: false,
              is_blocked: true,
              solved_at: new Date().toISOString()
            });
          }
        } catch(e) {
          console.warn('Falló registro de intento incorrecto:', e?.message);
        }
      }
    } else {
      if (!userAnswerString) {
        if (genero === "mujer") {
          Swal.fire({
            icon: "warning",
            title: "¡Upss!",
            text: "Debes ingresar un resultado antes de continuar ",
            confirmButtonColor: "#2fe317ff",

            customClass: {
              popup: "rounded-xl font-kavoon shadow-lg  alerta-redondeada",
              confirmButton: "mi-boton-confirmar",
              cancelButton: "mi-boton-cancelar",

              title: "mi-alerta-titulo",
              htmlContainer: "mi-alerta-texto",
            },
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Upss!",
            text: "Debes ingresar un resultado antes de continuar 😅",
            confirmButtonColor: "#f57c00",
            background: "bg-ground-custom-girl",
            color: "#5d4037",
            customClass: {
              popup: "mi-alerta-popup",
              title: "mi-alerta-titulo",

              htmlContainer: "mi-alerta-texto",
            },
          });
        }

        return;
      }
    }
  };

  // Resetear todo
  const handleReset = () => {
    if (
      validationResult === "incorrect" ||
      validationResult === "" ||
      validationResult === null
    ) {
      setCarries([0, 0, 0, 0]);
      setAnswer(["", "", "", "", ""]);
      setValidationResult(null);
    }
  };

  // ✅ FUNCIÓN PARA CONTINUAR AL SIGUIENTE EJERCICIO O REGRESAR
  const handleContinue = () => {
    playClickButton();
    
    // 🔹 Desactivar visuales antes de cambiar de pantalla
    setValidationResult(null);
    setCarries([0, 0, 0, 0]);
    setAnswer(["", "", "", "", ""]);
    
    // 🔹 Pequeño delay para permitir limpiar la interfaz (200ms)
    setTimeout(() => {
      if (allExercises && exerciseIndex < allExercises.length - 1) {
        // ✅ BUSCAR EL SIGUIENTE EJERCICIO NO COMPLETADO
        let nextIndex = exerciseIndex + 1;
        
        // Buscar el siguiente ejercicio que no esté completado
        while (nextIndex < allExercises.length) {
          const nextExercise = allExercises[nextIndex];
          // Si el ejercicio no está completado (is_correct no es true), lo usamos
          if (!nextExercise.is_correct) {
            break;
          }
          nextIndex++;
        }
        
        // ✅ VERIFICAR SI ENCONTRAMOS UN EJERCICIO NO COMPLETADO
        if (nextIndex < allExercises.length) {
          navigate("/Exercise", {
            state: {
              exercise: allExercises[nextIndex],
              exerciseIndex: nextIndex,
              kindOperation,
              genero,
              nivel,
              allExercises,
            },
          });
        } else {
          // ✅ SI TODOS LOS EJERCICIOS ESTÁN COMPLETADOS, IR AL JUEGO
          navigate("/Game", {
            state: {
              kindOperation,
              genero,
              nivel,
            },
          });
        }
      } else {
        // ✅ SI ES EL ÚLTIMO EJERCICIO, IR AL JUEGO
        navigate("/Game", {
          state: {
            kindOperation,
            genero,
            nivel,
          },
        });
      }
    }, 200);
  };

  // ✅ FUNCIÓN PARA REGRESAR A GAME
  const handleGoBack = () => {
    playClickButton();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/Game", {
        state: { kindOperation, genero, nivel },
      });
    }
  };

  return (
  <div className="h-screen bg-linear-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold"
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
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold"
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

  <div className="grid grid-cols-4 grid-rows-4 gap-4 z-50 w-full h-full p-10">
          <div
            className="absolute top-25 bottom-5 left-80 right-80 rounded-4xl -translate-y-10 border-4 border-black/10 shadow-xl flex"
            style={
              validationResult === "correct"
                ? {
                    background: "#21b94aff",
                    filter: "grayscale(20%) brightness(0.5)",
                  }
                : {
                    fontFamily: "Sansation, cursive",
                  }
            }
          >
            <div className="relative w-full h-full p-6 rounded-4xl ">
              {/* Acumuladores de "llevo" */}
              <div className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-1/2  gap-18 mb-4 pr-2 flex ">
                {carries.map((carry, index) => (
                  <button
                    key={`carry-${index}`}
                    onClick={() =>{ handleCarryClick(index),addnumber()}}
                    className="w-12 h-12  flex justify-center items-center border border-black/10 rounded-2xl font-semibold text-4xl transition-transform shadow-md 
                      text-white text-center hover:scale-110 cursor-pointer"
                    style={{
                      background: "#21b94aff",
                      fontFamily: "Sansation, cursive",
                    }}
                  >
                    {carry > 0 ? carry : ""}
                  </button>
                ))}
              </div>

              <div className="absolute  bottom-[40%] right-[20%]  gap-10">
                <span
                  className="text-[250px] font-bold text-white"
                  style={{ fontFamily: "Sansation, cursive" }}
                >
                  {operation}
                </span>
              </div>

              {/* Primera cifra */}
              <div className="absolute flex top-[18%] right-[35%]  gap-16 ">
                {num1.split("").map((digit, index) => (
                  <div
                    key={`num1-${index}`}
                    className="w-16 h-20 flex items-center justify-center"
                  >
                    <span
                      className="text-9xl font-semibold "
                      style={{
                        fontFamily: "Sansation, cursive",
                        color: "#FFFFFF",
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Segunda cifra */}
              <div className="absolute flex top-[40%] right-[35%]  gap-16 ">
                {num2.split("").map((digit, index) => (
                  <div
                    key={`num2-${index}`}
                    className="w-16 h-20 flex items-center justify-center"
                  >
                    <span
                      className="text-9xl font-semibold "
                      style={{
                        fontFamily: "Sansation, cursive",
                        color: "#FFFFFF",
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Línea divisoria */}
              <div className="absolute top-[60%] right-[34%]  z-50">
                <div className="mx-auto w-[520px] border-t-15 border-white"></div>
              </div>

              {/* Área de respuesta */}
              <div className=" absolute flex top-[65%] right-[32%]  gap-3">
                <div className="w-20"></div>
                {answer.map((digit, index) => (
                  <button
                    key={`answer-${index}`}
                    onClick={() => {handleAnswerClick(index),addnumber()}}
                    disabled={
                      !isAnswerEnabled(index) || validationResult === "correct"
                    }
                    className={`w-30 h-35 border rounded-3xl font-semibold text-9xl  transition-transform shadow-lg flex items-center justify-center  ${
                      isAnswerEnabled(index) && validationResult !== "correct"
                        ? " bg-ground-custom-selector  border-black/10 border-2 text-white hover:scale-105 cursor-pointer"
                        : "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    style={{
                      fontFamily: "Sansation, cursive",
                    }}
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {validationResult === "incorrect" && (
        <>
          <div className="absolute bottom-105 right-80 w-50 h-40 z-50">
            <img
              src={Cross}
              draggable={false}
              alt="Incorrecto"
              className="absolute w-50 h-45 object-contain"
            />
          </div>

          <div className="absolute bottom-60 right-120 w-60 h-60 z-50">
            <img
              src={Catsad}
              draggable={false}
              alt="Correcto"
              className="absolute w-60 h-60 object-contain"
            />
          </div>
        </>
      )}

      {validationResult === "correct" && (
        <>
          <div className="absolute bottom-20 right-100 w-60 h-60 z-50">
            <img
              src={Cat}
              draggable={false}
              alt="Correcto"
              className="absolute w-60 h-60 object-contain"
            />
          </div>

          <div className="absolute bottom-85 right-90 w-60 h-60 z-50">
            <img
              src={Check}
              draggable={false}
              alt="Check"
              className="absolute w-60 h-60 object-contain"
            />

            <div className="absolute bottom-0 right-20 w-60 h-60 z-50">
              <h1
                className="relative bottom-80 right-171 flex font-semibold text-[500px] text-white"
                style={{
                  fontFamily: "Sansation, sans-serif",
                  color: "#FFFFFF",
                }}
              >
                <span>+</span>
                <span
                  className="text-[250px]"
                  style={{
                    transform: "translateY(260px)",
                    display: "inline-block",
                  }}
                >
                  {Star_for_level}
                </span>
              </h1>

              <div className="absolute bottom-10 right-80 w-50 h-50 z-50">
                <img
                  src={StarR}
                  draggable={false}
                  alt="Star"
                  className="absolute w-50 h-50 object-contain"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Botón Verificar o Continuar */}
      {validationResult === "correct" ? (
        <div className=" absolute  bottom-90 right-15 z-30 ">
          {genero === "mujer" ? (
            <button
              onClick={() => {
                handleContinue();
                handleReset();
              }}
              onMouseEnter={() => playClick()}
                className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-transform duration-300 hover:scale-120 mt-3 sm:mt-5 text-shadow-lg"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#ffffff",
              }}
            >
              Continuar
              <ChevronRight className="w-15 h-20 " strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={() => {
                handleContinue();
                handleReset();
              }}
              onMouseEnter={() => playClick()}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 mt-3 sm:mt-5"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#FFB212",
              }}
            >
              Continuar
              <ChevronRight className="w-15 h-20 " strokeWidth={3} />
            </button>
          )}
        </div>
      ) : (
        <div className=" absolute  bottom-40 right-110 z-30 ">
          {genero === "mujer" ? (
            <button
              onClick={handleVerify}
              onMouseEnter={() => playClick()}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 mt-3 sm:mt-5 text-shadow-lg"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#ffffff",
              }}
            >
              Verificar
            </button>
          ) : (
            <button
              onClick={handleVerify}
              onMouseEnter={() => playClick()}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 mt-3 sm:mt-5"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#FFB212",
              }}
            >
              Verificar
            </button>
          )}
        </div>
      )}

      {/* Botón Regresar */}
      <div className=" absolute  bottom-10 right-25 z-30 ">
        {genero === "mujer" ? (
          <button
            onClick={() => {handleGoBack(),playAudio()}}
            onMouseEnter={() => playClick()}
            className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 mt-3 sm:mt-5 text-shadow-lg"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#ffffff",
            }}
          >
            Regresar
          </button>
        ) : (
          <button
            onClick={() => {handleGoBack(),playAudio()}}
            onMouseEnter={() => {playClick()}}
            className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFB212",
            }}
          >
            Regresar
          </button>
        )}
      </div>

      {/* Botón Reiniciar */}
  <div className=" absolute  top-58 right-105 z-30 ">
        {genero === "mujer" ? (
          <button
            onClick={() => {
              playClickButton();
              handleReset();
            }}
            onMouseEnter={() => playClick()}
              className=" text-4xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-transform duration-300 hover:scale-120 mt-3 sm:mt-5 text-shadow-lg"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#ffffff",
            }}
          >
            Reiniciar <RotateCcw className="w-15 h-20 " strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => {
              playClickButton();
              handleReset();
            }}
            className=" text-4xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFB212",
            }}
            onMouseEnter={() => playClick()}
          >
            Reiniciar <RotateCcw className="w-10 h-10 " strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
