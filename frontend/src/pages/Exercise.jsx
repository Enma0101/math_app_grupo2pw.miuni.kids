import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ChevronRight, RotateCcw  } from "lucide-react";

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

export default function Exercise() {
  // Estado para almacenar el género seleccionado
  const [userName, setUserName] = useState("Enmanuel");
  const [TotalStar, setTotalStar] = useState(100);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [genero, setGenero] = useState("mujer");
  const [kindOperation, setkindOperation] = useState("Sumas");
  const [current_streak, setcurrent_streak] = useState(5);
  const [operation, setOperation] = useState("-");
  const [num1] = useState("4598");
  const [num2] = useState("8956");
  const [Star_for_level] = useState(3);

  const [Bloked, setBloked] = useState({
    0: false, // operación 1
    1: false, // operación 2
    2: false, // operación 3
    3: false, // operación 4
    4: false, // operación 5
    5: false, // operación 6
    6: false, // operación 7
    7: false, // operación 8
  });

  {
    /* const { kindOperation, genero } = state || {};*/
  }

  // Acumuladores de "llevo" para cada posición (derecha a izquierda: índice 3, 2, 1, 0)
  const [carries, setCarries] = useState([0, 0, 0, 0]); // 4 posiciones

  // Respuesta del usuario (5 dígitos, derecha a izquierda: índice 4, 3, 2, 1, 0)
  const [answer, setAnswer] = useState(["", "", "", "", ""]); // 5 posiciones

  const [validationResult, setValidationResult] = useState(null); // 'correct', 'incorrect', o null

  // Calcular resultado correcto
  const correctAnswer =
    operation === "+"
      ? (parseInt(num1) + parseInt(num2)).toString()
      : Math.abs(parseInt(num1) - parseInt(num2)).toString();

  const expectedLength = correctAnswer.length;

  const isCarryEnabled = (index) => {
    return true;
  };

  // Verificar si un cuadro de respuesta está habilitado
  const isAnswerEnabled = (index) => {
    // Los índices van de 0 (izquierda) a 4 (derecha)
    // El de más a la derecha (índice 4) siempre está habilitado
    if (index === 4) return true;
    // Los demás solo si el de la derecha ya tiene un valor
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
    // Limpiar validación anterior al cambiar respuesta
    setValidationResult(null);
  };

  // Función para verificar la respuesta manualmente
  const handleVerify = () => {
    // Contar dígitos llenados desde la derecha
    let filledCount = 0;
    for (let i = 4; i >= 0; i--) {
      if (answer[i] !== "") {
        filledCount++;
      } else {
        break;
      }
    }

    // Si se llenaron dígitos, obtenerlos
    if (filledCount > 0) {
      const startIndex = 5 - filledCount;
      const userAnswerString = answer.slice(startIndex).join("");

      // Validar
      if (userAnswerString === correctAnswer) {
        setValidationResult("correct");
      } else {
        setValidationResult("incorrect");
      }
    } else {
      alert("Por favor, completa la respuesta primero");
    }
  };
  // Resetear todo
const handleReset = () => {
  if (validationResult === "incorrect" || validationResult === "" || validationResult === null) {
    setCarries([0, 0, 0, 0]);
    setAnswer(["", "", "", "", ""]);
  }
};



  // 'mujer' o 'hombre'

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
                        color: "#ffff",
                      }}
                    >
                      ¡Vamos a Sumar!
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
                      ¡Vamos a Restar!
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
                    ¡Vamos a Sumar!
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
                    ¡Vamos a Restar!
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

        <div className="grid grid-cols-4 grid-rows-4 gap-4 z-50 w-full h-full p-10 flex items-center justify-center">
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
              {/* Acumuladores de "llevo" - Solo 4, uno por cada dígito */}
              <div className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-1/2  gap-18 mb-4 pr-2 flex ">
                {/* Espacio extra para el 5to dígito */}
                {carries.map((carry, index) => (
                  <button
                    key={`carry-${index}`}
                    onClick={() => handleCarryClick(index)}
                    className="w-12 h-12  flex justify-center items-center border-1 border-black/10 rounded-2xl font-semibold text-4xl transition-all shadow-md 
                      text-white text-center hover:scale-110 cursor-pointer  cursor-pointer"
                    style={{
                      background: "#21b94aff",
                      fontFamily: "Sansation, cursive",
                    }}
                  >
                    {carry > 0 ? carry : ""}
                  </button>
                ))}
              </div>

              <div className="absolute  bottom-[50%] right-[15%]  gap-16">
                <span
                  className="text-[250px] font-bold text-white"
                  style={{ fontFamily: "Sansation, cursive" }}
                >
                  {operation}
                </span>
              </div>

              {/* Primera cifra */}
              <div className="absolute flex top-[18%] right-[35%]  gap-16 ">
                {/* Espacio extra para el 5to dígito */}
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

              {/* Signo y segunda cifra */}
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

              {/* Área de respuesta con selectores */}
              <div className=" absolute flex top-[65%] right-[32%]  gap-3">
                <div className="w-20"></div>
                {answer.map((digit, index) =>
                  validationResult === "incorrect" ? (
                    <button
                      key={`answer-${index}`}
                      onClick={() => handleAnswerClick(index)}
                      disabled={!isAnswerEnabled(index)}
                      className={`w-30 h-35 border-1 rounded-3xl font-semibold text-9xl  transition-all shadow-lg flex items-center justify-center  ${
                        isAnswerEnabled(index)
                          ? " bg-ground-custom-selector  border-black/10 border-2 text-white hover:scale-105 cursor-pointer"
                          : "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      style={{
                        fontFamily: "Sansation, cursive",
                      }}
                    >
                      {digit}
                    </button>
                  ) : validationResult === "correct" ? (
                    <button
                      key={`answer-${index}`}
                      onClick={() => handleAnswerClick(index)}
                      disabled={validationResult === "correct"}
                      className={`w-30 h-35 border-1 rounded-3xl font-semibold text-9xl  transition-all shadow-lg flex items-center justify-center  ${
                        isAnswerEnabled(index)
                          ? " bg-ground-custom-selector  border-black/10 border-2 text-white hover:scale-105 cursor-pointer"
                          : "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      style={{
                        fontFamily: "Sansation, cursive",
                      }}
                    >
                      {digit}
                    </button>
                  ) : (
                    <button
                      key={`answer-${index}`}
                      onClick={() => handleAnswerClick(index)}
                      disabled={!isAnswerEnabled(index)}
                      className={`w-30 h-35 border-1 rounded-3xl font-semibold text-9xl  transition-all shadow-lg flex items-center justify-center  ${
                        isAnswerEnabled(index)
                          ? " bg-ground-custom-selector  border-black/10 border-2 text-white hover:scale-105 cursor-pointer"
                          : "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      style={{
                        fontFamily: "Sansation, cursive",
                      }}
                    >
                      {digit}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {validationResult === "incorrect" ? (
        <div className="absolute bottom-70 right-130 w-45 h-50 z-50">
          <img
            src={Cross}
            draggable={false}
            alt="Background"
            className="absolute w-45 h-50 object-contain"
          />
        </div>
      ) : validationResult === "correct" ? (
        <>
          <div className="absolute bottom-20 right-100 w-60 h-60 z-50">
            <img
              src={Cat}
              draggable={false}
              alt="Background"
              className="absolute w-60 h-60 object-contain"
            />
          </div>

          <div className="absolute bottom-85 right-90 w-60 h-60 z-50">
            <img
              src={Check}
              draggable={false}
              alt="Background"
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
                  alt="Background"
                  className="absolute w-50 h-50 object-contain"
                />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {validationResult === "incorrect" ? (
        <div className=" absolute  bottom-40 right-110 z-30 ">
          {/* Botón regresar */}
          {genero === "mujer" ? (
            <button
              onClick={handleVerify}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
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
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#FFB212",
              }}
            >
              Verificar
            </button>
          )}
        </div>
      ) : validationResult === "correct" ? (
        <div className=" absolute  bottom-90 right-15 z-30 ">
          {/* Botón regresar */}
          {genero === "mujer" ? (
            <button
              onClick={""}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#ffffff",
              }}
            >
              Continuar<ChevronRight className="w-15 h-20 " strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={""}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#FFB212",
              }}
            >
              Continuar<ChevronRight className="w-15 h-20 " strokeWidth={3} />
            </button>
          )}
        </div>
      ) : (
        <div className=" absolute  bottom-40 right-110 z-30 ">
          {/* Botón regresar */}
          {genero === "mujer" ? (
            <button
              onClick={handleVerify}
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
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
              className=" text-5xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
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

      <div className=" absolute  bottom-10 right-25 z-30 ">
        {/* Botón regresar */}
        {genero === "mujer" ? (
          <button
            onClick={() => {
              navigate("/Seleccion");
            }}
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
            onClick={() => {
              navigate("/Seleccion");
            }}
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

        <div className=" absolute  top-58 right-105 z-30 ">       
        {/* Botón regresar */}
        {genero === "mujer" ? (
          <button
            onClick={handleReset}
            className=" text-4xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5 text-shadow-lg"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#ffffff",
            }}
          >
            Reiniciar <RotateCcw className="w-15 h-20 " strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className=" text-4xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-120 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFB212",
            }}
          >
            Reiniciar <RotateCcw className="w-10 h-10 " strokeWidth={3} />
           </button> 
        )}
      </div>






    </div>
  );
}
