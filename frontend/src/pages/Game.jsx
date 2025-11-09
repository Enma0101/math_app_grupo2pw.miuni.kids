import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
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

export default function Game() {
  // Estado para almacenar el género seleccionado

  const [TotalStar, setTotalStar] = useState(100);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { kindOperation, genero } = state || {};
  const resultado = kindOperation === "Sumas" ? "+" : "-";
  const [validationResult, setValidationResult] = useState(null);
  const [current_streak, setcurrent_streak] = useState(5);
  const [num1] = useState("4598");
  const [num2] = useState("8956");

  const handlegoback = () => {
    navigate("/Seleccion", {
      state: { kindOperation: kindOperation, genero: genero },
    });
  };

   const handlegoExercise = (n) => {
    navigate("/Seleccion", {
      state: { kindOperation: kindOperation, genero: genero },
    });
  };
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

        <div className="absolute z-50 w-full h-full p-10 flex items-center justify-center">
          <div className="absolute grid grid-cols-4 grid-rows-2 gap-x-10  -translate-y-10">
            {Bloked[0] ? (
              <div className=" absolute w-20 h-20 top-50  left-70 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[1] ? (
              <div className=" absolute w-20 h-20 top-50  left-172 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[2] ? (
              <div className=" absolute w-20 h-20 top-50  left-270 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[3] ? (
              <div className=" absolute w-20 h-20 top-50  left-368 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
             {Bloked[4] ? (
              <div className=" absolute w-20 h-20 top-130  left-70 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[5] ? (
              <div className=" absolute w-20 h-20 top-130  left-172 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[6] ? (
              <div className=" absolute w-20 h-20 top-130  left-270 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}
            {Bloked[7] ? (
              <div className=" absolute w-20 h-20 top-130  left-368 z-100">
                <img
                  src={Check}
                  draggable={false}
                  alt="Background"
                  className="absolute w-20 h-20 object-cover object-center"
                />
              </div>
            ) : null}

            {/* Contenedor 1 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-7 shadow-inner transition-transform mt-3 sm:mt-5 ml-4 ${
                !Bloked[0] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[0] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[0]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  {num1} <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  19998
                </p>
              </div>
            </button>

            {/* Contenedor 2 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-8 ${
                !Bloked[1] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[1] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[1]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  19998
                </p>
              </div>
            </button>

            {/* Contenedor 3 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-8 ${
                !Bloked[2] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[2] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[2]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>

            {/* Contenedor 4 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-8 ${
                !Bloked[3] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[3] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[3]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>

            {/* Contenedor 5 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-4 ${
                !Bloked[4] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[4] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[4]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>

            {/* Contenedor 6 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-8 ${
                !Bloked[5] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[5] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[5]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>

            {/* Contenedor 7 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-3 sm:mt-5 ml-8 ${
                !Bloked[6] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[6] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[6]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>

            {/* Contenedor 8 */}
            <button
              className={`relative backdrop-blur-sm rounded-4xl w-80 h-75 flex flex-col border-3 border-black/20 px-6 shadow-inner transition-transform mt-10 sm:mt-5 ml-8 ${
                !Bloked[7] ? "transition-all duration-300 hover:scale-110" : ""
              }`}
              style={{
                fontFamily: "Sansation, cursive",
                color: "#FFFFFF",
                filter: Bloked[7] ? "grayscale(20%) brightness(0.70)" : "none",
              }}
              disabled={Bloked[7]}
            >
              <div className="relative z-10">
                <p className="text-white text-6xl font-bold leading-tight text-right">
                  4598 <span className="text-8xl">{resultado}</span>
                </p>
                <p className="text-white text-6xl font-bold leading-tight text-right mr-13">
                  8956
                </p>
                <div className="w-full h-2 bg-white mt-2 opacity-80"></div>
                <p className="text-white text-6xl font-bold leading-tight opacity-90 text-right mr-13">
                  9998
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className=" absolute  bottom-10 right-20 z-30 ">
        {/* Botón regresar */}
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
