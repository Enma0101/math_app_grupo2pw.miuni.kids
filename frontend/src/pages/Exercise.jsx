import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, RotateCcw } from "lucide-react";
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
import Cross from "../assets/Cross Mark.png";
import StarR from "../assets/starR.png";
import Cat from "../assets/catawesome.gif";
import Catsad from "../assets/catsad.gif";
import PizzarraBg from "../assets/pizarra.svg";
import { updateExerciseInStorage } from "../utils/exerciseGenerator";
import { useAudio } from "../components/AudioManager";
import { useAuth } from "../context/AuthContext";
import {
  apiGetStars,
  apiUpdateStars,
  apiUpdateStreak,
  apiResetStreak,
  apiGetStreak,
} from "../services/api";

export default function Exercise({ onExit }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const userId = user?.id_user;

  const {
    playClick,
    playClickButton,
    playCorrect,
    playCorrect2,
    playincorrect,
    pauseAudio,
    addnumber,
    playAudio,
  } = useAudio();

  useEffect(() => {
    pauseAudio();
  }, []);

  const {
    exercise,
    exerciseIndex,
    kindOperation,
    genero,
    nivel,
    allExercises,
    stars,
  } = state || {};

  const [TotalStar, setTotalStar] = useState(100);
  const [current_streak, setcurrent_streak] = useState(0);
  const [Star_for_level] = useState(stars);

  const [operation, setOperation] = useState("+");
  const [num1, setNum1] = useState("0000");
  const [num2, setNum2] = useState("0000");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [carries, setCarries] = useState([0, 0, 0, 0]);
  const [answer, setAnswer] = useState(["", "", "", "", ""]);
  const [validationResult, setValidationResult] = useState(null);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);


  useEffect(() => {
    const loadStreak = async () => {
      if (token && userId && kindOperation && nivel) {
        try {
        
          const streakResponse = await apiGetStreak(
            token,
            userId,
            kindOperation
          );
        


          if (streakResponse && !Array.isArray(streakResponse)) {
            // Mapear nivel a dificultad
            let difficulty;
            if (typeof nivel === "number") {
              difficulty =
                nivel === 1 ? "facil" : nivel === 2 ? "medio" : "dificil";
            } else {
              const nivelLower = nivel.toLowerCase();
              difficulty =
                nivelLower === "fácil"
                  ? "facil"
                  : nivelLower === "medio"
                  ? "medio"
                  : "dificil";
            }

            const currentLevelStreak =
              streakResponse[`${difficulty}_count`] || 0;
            setcurrent_streak(currentLevelStreak);
         
          }
   
          else if (Array.isArray(streakResponse) && streakResponse.length > 0) {
            const streakData = streakResponse.find(
              (s) => s.operation_type === kindOperation
            );

            if (streakData) {
           
              let difficulty;
              if (typeof nivel === "number") {
                difficulty =
                  nivel === 1 ? "facil" : nivel === 2 ? "medio" : "dificil";
              } else {
                const nivelLower = nivel.toLowerCase();
                difficulty =
                  nivelLower === "fácil"
                    ? "facil"
                    : nivelLower === "medio"
                    ? "medio"
                    : "dificil";
              }

              const currentLevelStreak = streakData[`${difficulty}_count`] || 0;
              setcurrent_streak(currentLevelStreak);
            
            } else {
           
              setcurrent_streak(0);
            }
          } else {
           
            setcurrent_streak(0);
          }
        } catch (error) {
       
          setcurrent_streak(0);
        }
      }
    };

    loadStreak();
  }, [token, userId, kindOperation, nivel]);

  useEffect(() => {
    if (exercise) {
      setOperation(exercise.operation_type === "Sumas" ? "+" : "-");
      setNum1(exercise.number1.toString().padStart(4, "0"));
      setNum2(exercise.number2.toString().padStart(4, "0"));
      setCorrectAnswer(exercise.correct_result.toString());
    }
  }, [exercise]);

  const isCarryEnabled = (index) => {
    return true;
  };

  const isAnswerEnabled = (index) => {
    if (index === 4) return true;
    return answer[index + 1] !== "";
  };

  const handleCarryClick = (index) => {
    if (!isCarryEnabled(index)) return;
    const newCarries = [...carries];
    newCarries[index] = (newCarries[index] + 1) % 10;
    setCarries(newCarries);
    // Ocultar la animación cuando el usuario cambia los números
    setShowIncorrectAnimation(false);
  };

  const handleAnswerClick = (index) => {
    if (!isAnswerEnabled(index)) return;
    const newAnswer = [...answer];
    newAnswer[index] =
      newAnswer[index] === ""
        ? "0"
        : String((parseInt(newAnswer[index]) + 1) % 10);
    setAnswer(newAnswer);
    // Ocultar la animación cuando el usuario cambia la respuesta
    setShowIncorrectAnimation(false);
  };

  const handleVerify = async () => {
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

   const userAnswerNumber = parseInt(userAnswerString, 10);
   const correctAnswerNumber = parseInt(correctAnswer, 10);

      if (userAnswerNumber === correctAnswerNumber) {
        setValidationResult("correct");
        playCorrect();

        try {
          if (token && userId && exercise?.id_exercise) {
            const updatedExercise = {
              ...exercise,
              is_correct: true,
              user_answer: parseInt(userAnswerString),
              solved_at: new Date().toISOString(),
            };

            await updateExerciseInStorage(
              kindOperation,
              nivel,
              genero,
              exerciseIndex,
              updatedExercise,
              token
            );
        

    
            try {
              const currentStarsResponse = await apiGetStars(token, userId);

           

              if (currentStarsResponse?.total_stars !== undefined) {
                const currentStars = currentStarsResponse.total_stars;
                const newTotalStars = currentStars + Star_for_level;

       

                const updatePayload = {
                  user_id: userId,
                  total_stars: newTotalStars,
                };

         
                const updateResponse = await apiUpdateStars(
                  token,
                  updatePayload
                );

              

                if (updateResponse) {
                  setTotalStar(newTotalStars);
               
                }
              } else {
              
              }
            } catch (starError) {
             
            }


            try {
              let difficulty;
              if (typeof nivel === "number") {
                difficulty =
                  nivel === 1 ? "facil" : nivel === 2 ? "medio" : "dificil";
              } else {
                const nivelLower = nivel.toLowerCase();
                difficulty =
                  nivelLower === "fácil"
                    ? "facil"
                    : nivelLower === "medio"
                    ? "medio"
                    : "dificil";
              }

           

              const streakPayload = {
                user_id: userId,
                operation_type: kindOperation,
                difficulty: difficulty,
              };

             

              const streakResponse = await apiUpdateStreak(
                token,
                streakPayload
              );

   

              // Actualizar el estado local con la nueva racha
              if (streakResponse) {
                const newStreak = streakResponse[`${difficulty}_count`] || 0;
                setcurrent_streak(newStreak);
                playCorrect2();
               
              }
            } catch (streakError) {
            
            }

            if (allExercises) {
              const updatedAllExercises = [...allExercises];
              updatedAllExercises[exerciseIndex] = updatedExercise;
            
            }
          }
        } catch (error) {
        
        }
      } else {
        setValidationResult("incorrect");
        setShowIncorrectAnimation(true);
        playincorrect();

  
        try {
          let difficulty;
          if (typeof nivel === "number") {
            difficulty =
              nivel === 1 ? "facil" : nivel === 2 ? "medio" : "dificil";
          } else {
            const nivelLower = nivel.toLowerCase();
            difficulty =
              nivelLower === "fácil"
                ? "facil"
                : nivelLower === "medio"
                ? "medio"
                : "dificil";
          }

        

          const resetPayload = {
            user_id: userId,
            operation_type: kindOperation,
            difficulty: difficulty,
          };

         

          await apiResetStreak(token, resetPayload);

          // Resetear el estado local
          setcurrent_streak(0);

       
        } catch (resetError) {
  
        }
      }
    } else {
      if (!userAnswerString) {
        if (genero === "mujer") {
          Swal.fire({
            icon: "warning",
            title: "¡Upss!",
            text: "Debes ingresar un resultado antes de continuar",
            confirmButtonColor: "#2fe317ff",
            customClass: {
              popup: "rounded-xl font-kavoon shadow-lg alerta-redondeada",
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

  const handleReset = () => {
    if (
      validationResult === "incorrect" ||
      validationResult === "" ||
      validationResult === null
    ) {
      setCarries([0, 0, 0, 0]);
      setAnswer(["", "", "", "", ""]);
      setValidationResult(null);
      setShowIncorrectAnimation(false);
    }
  };

  const handleContinue = () => {
    playClickButton();
    setValidationResult(null);
    setShowIncorrectAnimation(false);
    setCarries([0, 0, 0, 0]);
    setAnswer(["", "", "", "", ""]);

    setTimeout(() => {
      if (allExercises && exerciseIndex < allExercises.length - 1) {
        let nextIndex = exerciseIndex + 1;

        while (nextIndex < allExercises.length) {
          const nextExercise = allExercises[nextIndex];
          if (!nextExercise.is_correct) {
            break;
          }
          nextIndex++;
        }

        if (nextIndex < allExercises.length) {
          navigate("/Exercise", {
            state: {
              exercise: allExercises[nextIndex],
              exerciseIndex: nextIndex,
              kindOperation,
              genero,
              nivel,
              allExercises,
              stars,
            },
          });
        } else {
          navigate("/Game", {
            state: {
              kindOperation,
              genero,
              nivel,
            },
          });
        }
      } else {
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

  const handleGoBack = () => {
    playClickButton();
    navigate("/Game", {
      state: {
        kindOperation: kindOperation,
        genero: genero,
        nivel:
          nivel === 1
            ? "Fácil"
            : nivel === 2
            ? "Medio"
            : nivel === 3
            ? "Difícil"
            : nivel,
      },
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
        className={`absolute top-0 left-0 right-0 z-20 py-4 sm:py-6 md:py-15 lg:py-20 px-4 md:px-10 ${
          genero === "mujer"
            ? "bg-ground-custom-girl"
            : genero === "hombre"
            ? "bg-ground-custom"
            : "bg-gray-400"
        }`}
      >
        <nav
          className={`absolute top-0 left-0 right-0 z-30 py-4 sm:py-6 md:py-15 lg:py-20 px-4 md:px-10 ${
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
                    className="sm:text-3xl md:text-5xl lg:text-5xl"
                    style={{ fontFamily: "Kavoon, cursive", color: "#852526" }}
                  >
                    ¡Vamos a Sumar!{" "}
                    <span
                      style={{
                        display: "block",
                        marginTop: "25px",
                        marginLeft: "10px",
                        color: "#ffff",
                      }}
                    >
                      Ejercicio {exerciseIndex + 1}/8
                    </span>
                  </h1>
                ) : (
                  <h1
                    className="sm:text-3xl md:text-5xl lg:text-5xl"
                    style={{ fontFamily: "Kavoon, cursive", color: "#852526" }}
                  >
                    ¡Vamos a Restar!{" "}
                    <span
                      style={{
                        display: "block",
                        marginTop: "25px",
                        color: "#ffff",
                      }}
                    >
                      Ejercicio {exerciseIndex + 1}/8
                    </span>
                  </h1>
                )
              ) : kindOperation === "Sumas" ? (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-5xl"
                  style={{ fontFamily: "Kavoon, cursive", color: "#FFB212" }}
                >
                  ¡Vamos a Sumar!{" "}
                  <span
                    style={{
                      display: "block",
                      marginTop: "25px",
                      color: "#262A51",
                    }}
                  >
                    Ejercicio {exerciseIndex + 1}/8
                  </span>
                </h1>
              ) : (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-5xl"
                  style={{ fontFamily: "Kavoon, cursive", color: "#FFB212" }}
                >
                  ¡Vamos a Restar!{" "}
                  <span
                    style={{
                      display: "block",
                      marginTop: "25px",
                      color: "#262A51",
                    }}
                  >
                    Ejercicio {exerciseIndex + 1}/8
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

      <div className="absolute top-40 right-0 w-60  h-60 z-50">
        <img
          src={Number8}
          alt="number8"
          className="w-70 h-70 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-5 left-5 w-60 h-60 z-50">
        <img
          src={Number4}
          alt="number4"
          className="w-45 h-60 object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute   top-42 bottom-5 left-15 right-15 rounded-3xl z-10 shadow-3xl overflow-hidden ">
        <img
          src={fondo1}
          alt="Fondo"
          className="  absolute inset-0 w-full h-full object-cover scale-110"
          draggable={false}
        />

        <div
  className="absolute top-15 bottom-0 left-80 right-80  -translate-y-10 border-4 border-black/10 shadow-xl "
  style={
    validationResult === "correct"
      ? {
          backgroundImage: `url(${PizzarraBg})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#919191ff",
          filter: "grayscale(20%) brightness(0.5)",
         
        }
      : {
          fontFamily: "Sansation, cursive",
          backgroundImage: `url(${PizzarraBg})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }
  }
>


            
          
              
              <div className="absolute top-[12%] left-[50%] -translate-x-1/2 -translate-y-1/2 gap-18 mb-4 pr-2 flex">
                {carries.map((carry, index) => (
                  <button
                    key={`carry-${index}`}
                    onClick={() => {
                      handleCarryClick(index);
                      addnumber();
                    }}
                    className="w-12 h-12 flex justify-center items-center border-1 border-black/10 rounded-2xl font-semibold text-4xl transition-all shadow-md text-white text-center hover:scale-110 cursor-pointer"
                    style={{
                      background: "#d8d8d8ff",
                      color:"#353535ff",
                      fontFamily: "Sansation, cursive",
                    }}
                  >
                    {carry > 0 ? carry : ""}
                  </button>
                ))}
              </div>

              <div className="absolute bottom-[40%] right-[20%] gap-10 ">
                <span
                  className="text-[250px] font-bold "
                  style={{ fontFamily: "Sansation, cursive", color:"#353535ff" }}
                >
                  {operation}
                </span>
              </div>

              <div className="absolute flex top-[18%] right-[35%] gap-16">
                {num1.split("").map((digit, index) => (
                  <div
                    key={`num1-${index}`}
                    className="w-16 h-20 flex items-center justify-center"
                  >
                    <span
                      className="text-9xl font-semibold"
                      style={{
                        fontFamily: "Sansation, cursive",
                        color: "#353535ff",
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute flex top-[40%] right-[35%] gap-16">
                {num2.split("").map((digit, index) => (
                  <div
                    key={`num2-${index}`}
                    className="w-16 h-20 flex items-center justify-center"
                  >
                    <span
                      className="text-9xl font-semibold"
                      style={{
                        fontFamily: "Sansation, cursive",
                        color: "#353535ff",
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute top-[60%] right-[34%] z-50">
                <div className="mx-auto w-[520px] border-t-15 "style={{ borderColor: "#353535ff" }}
></div>
              </div>

              <div className="absolute flex top-[65%] right-[32%] gap-3">
                <div className="w-20"></div>
                {answer.map((digit, index) => (
                <button
  key={`answer-${index}`}
  onClick={() => {
    handleAnswerClick(index);
    addnumber();
  }}
  disabled={
    !isAnswerEnabled(index) || validationResult === "correct"
  }
  className={`w-30 h-35 border-1 rounded-3xl font-semibold text-9xl transition-all shadow-lg flex items-center justify-center ${
    isAnswerEnabled(index) && validationResult !== "correct"
      ? "bg-ground-custom-selector border-black/10 border-2 hover:scale-105 cursor-pointer"
      : "bg-gray-200 border-gray-400 cursor-not-allowed opacity-50"
  }`}
  style={{
    fontFamily: "Sansation, cursive",
    color: "#353535ff",
  }}
>
  {digit}
</button>

                ))}
              </div>
            </div>
          
        
      </div>

      {showIncorrectAnimation && (
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
          <div className="absolute bottom-15 right-100 w-60 h-60 z-50">
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
        {validationResult === "correct" ? (
        <div className="absolute bottom-90 right-15 z-30">
          {genero === "mujer" ? (
            <button
              onClick={() => {
                handleContinue();
                handleReset();
              }}
              onMouseEnter={() => playClick()}
              className="text-5xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
              style={{ fontFamily: "Kavoon, cursive", color: "#ffffff" }}
            >
              Continuar <ChevronRight className="w-15 h-20" strokeWidth={3} />
            </button>
          ) : (
         
            <button
              onClick={() => {
                handleContinue();
                handleReset();
              }}
              onMouseEnter={() => playClick()}
              className="text-5xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
              style={{ fontFamily: "Kavoon, cursive", color: "#FFB212" }}
            >
              Continuar <ChevronRight className="w-15 h-20" strokeWidth={3} />
            </button>
          )}
        </div>
      ) : (
        <div className="absolute bottom-40 right-115 z-30">
          {genero === "mujer" ? (
            <button
              onClick={handleVerify}
              onMouseEnter={() => playClick()}
              className="text-5xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
              style={{ fontFamily: "Kavoon, cursive", color: "#8054AE" }}
            >
              Verificar
            </button>
          ) : (
            <button
              onClick={handleVerify}
              onMouseEnter={() => playClick()}
              className="text-5xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
              style={{ fontFamily: "Kavoon, cursive", color: "#FFB212" }}
            >
              Verificar
            </button>
          )}
        </div>
      )}

      <div className="absolute bottom-15 right-30 z-30">
        {genero === "mujer" ? (
          <button
            onClick={() => {
              handleGoBack();
              playAudio();
            }}
            onMouseEnter={() => playClick()}
            disabled={validationResult === "incorrect"}
            className={`text-5xl flex items-center gap-2 bg-transparent border-none p-0 transition-all duration-300 mt-3 sm:mt-5 text-shadow-lg ${
              validationResult === "incorrect"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:scale-120 transition-transform"
            }`}
            style={{ fontFamily: "Kavoon, cursive", color: "#ffffff" }}
          >
            Regresar
          </button>
        ) : (
          <button
            onClick={() => {
              handleGoBack();
              playAudio();
            }}
            onMouseEnter={() => playClick()}
            disabled={validationResult === "incorrect"}
            className={`text-5xl flex items-center gap-2 bg-transparent border-none p-0 transition-all duration-300 mt-3 sm:mt-5 ${
              validationResult === "incorrect"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:scale-120 transition-transform"
            }`}
            style={{ fontFamily: "Kavoon, cursive", color: "#ffffff" }}
          >
            Regresar
          </button>
        )}
      </div>

      <div className="absolute top-58 right-115 z-30">
        {genero === "mujer" ? (
          <button
            onClick={() => {
              playClickButton();
              handleReset();
            }}
            onMouseEnter={() => playClick()}
            className="text-4xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
            style={{ fontFamily: "Kavoon, cursive", color: "#8054AE" }}
          >
            Reiniciar <RotateCcw className="w-15 h-20" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => {
              playClickButton();
              handleReset();
            }}
            onMouseEnter={() => playClick()}
            className="text-4xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
            style={{ fontFamily: "Kavoon, cursive", color: "#FFB212" }}
          >
            Reiniciar <RotateCcw className="w-10 h-10" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}