import { useState, useEffect } from "react";
import { useNavigate , useLocation, Navigate } from "react-router-dom";
import { LogOut, Undo } from "lucide-react";

// Importa tus imágenes
import Background from "../assets/BackgroundLogin.svg";
import Backgroundgirl from "../assets/BackgroundLoginGirl.svg";
import Number2 from "../assets/Number2.png";
import Number1 from "../assets/Number1.png";
import plusboy from "../assets/Plusboy.png";
import restboy from "../assets/restboy.png";
import Plusgirl from "../assets/Plusgirl.png";
import resgirl from "../assets/restgirl.png";
import StarPY from "../assets/starPY.png";
import StarYG from "../assets/StarYG.png";
import StarP from "../assets/StarPink.png";
import StarG from "../assets/StarGreen.png";

import { useAudio, AudioControl } from "../components/AudioManager";
import { useAuth } from "../context/AuthContext";
import { apiSelectExercise } from "../services/api";

export default function Seleccion() {
   const { playClick,playClickButton ,playAudio } = useAudio();
 // Auth
  const { token, user } = useAuth();
 // Estado para almacenar el género seleccionado
 
  const [userName, setUserName] = useState("Enmanuel");
  const [TotalStar, setTotalStar] = useState(100);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { kindOperation, genero } = state || {};

  const handleActivity = async (nivel) => {
    // Mapear nivel a id
    const levelMap = { "Facil": 1, "Medio": 2, "Dificil": 3 };
    const levelId = levelMap[nivel] || 1;
    // Enviar selección al backend (no bloqueante para la UX)
    try {
      if (token && user?.id_user && kindOperation) {
        await apiSelectExercise(token, {
          user_id: user.id_user,
          level_id: levelId,
          operation_type: kindOperation
        });
      }
    } catch (e) {
      // No alterar la lógica/flujo de front; seguimos navegando igual
      console.warn('No se pudo registrar la selección:', e?.message);
    } finally {
      navigate("/Game", {
        state: { kindOperation: kindOperation, genero: genero, nivel: nivel },
      });
    }
  };

  // 'mujer' o 'hombre'

  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo */}
      <AudioControl genero={genero} />
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
        className={`absolute top-0 left-0 right-0 z-20  py-4 sm:py-6 md:py-15 lg:py-25 px-4 md:px-10"
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
          className={`absolute top-0 left-0 right-0 z-30 py-4 sm:py-6 md:py-15 lg:py-25 px-4 md:px-10"
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
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
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
                  className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
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
               kindOperation === "Sumas" ? (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-6xl "
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
                ) : (<h1
                  className="sm:text-3xl md:text-5xl lg:text-6xl "
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
                </h1>)


              ) : (
                kindOperation === "Sumas" ? (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-6xl "
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
                ) : (<h1
                  className="sm:text-3xl md:text-5xl lg:text-6xl "
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
                </h1>)
              )}

            </div>

            <div className="flex-1 flex justify-end items-start">
           
            </div>
          </div>
        </nav>
      </div>

      {/* Imagen numeros 2*/}

      {genero === "mujer" ? (
        <div className="relative top-80 right-100  z-20  ">
          <img
            src={Number1}
            draggable={false}
            alt="Numbers"
            className="w-24 h-20 xl:w-50 xl:h-50 object-contain"
          />
        </div>
      ) : (
        <div className="relative top-75 right-100  z-20  ">
          <img
            src={Number2}
            draggable={false}
            alt="Numbers"
            className="w-24 h-20 xl:w-50 xl:h-50 object-contain"
          />
        </div>
      )}

      {/* Tarjeta de bienvenida */}
      {genero === "mujer" ? (
        <div className="rounded-3xl p-8 mb-8 relative top-40  ">
          {/* Mensaje de bienvenida */}
          <div>
            <h2
              className="text-5xl md:text-7xl  mb-3"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#5F005C",
                filter: "url(#inner-shadow)",
              }}
            >
              Niveles {kindOperation}
            </h2>
            
          </div>
        </div>
      ) : (
        <div className="rounded-3xl p-8 mb-8 relative top-40  ">
          {/* Mensaje de bienvenida */}
          <div>
            <h2
              className="text-5xl md:text-7xl  mb-3"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#262A51",
                filter: "url(#inner-shadow)",
              }}
            >
              Niveles {kindOperation}
            </h2>
            
          </div>
        </div>
      )}

      {genero === "mujer" ? (
        <div className="relative bottom-15 left-140 bg-ground-custom2girl bg-custom-gradient-girl2 rounded-3xl p-8 h-42 w-80 shadow-4xl z-40 subtle-bounce  ">
          {/* Título de la tarjeta */}
          <h3
            className=" relative bottom-5 text-2xl md:text-4xl  mb-2"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFFFFF",
              textShadow: "-8px 0px #5F005C",
              filter: "url(#inner-shadow)",
            }}
          >
            Total{" "}
            <span style={{ display: "block", textIndent: "4ch" }}>
              Estrellas
            </span>
          </h3>
          <h2
            className=" relative text-2xl md:text-7xl mb-2 inline-block bg-clip-text text-transparent bottom-10 text-2xl md:text-7xl mb-2"
            style={{
              fontFamily: "Kavoon, cursive",
              backgroundImage: "linear-gradient(to right, #ED06E5, #5F005C)",
            }}
          >
            {TotalStar}
          </h2>
        </div>
      ) : (
        <div className="relative bottom-20 left-140 bg-ground-custom2 bg-custom-gradient-girl2 rounded-3xl p-8 h-42 w-80 shadow-4xl z-40 subtle-bounce ">
          {/* Título de la tarjeta */}
          <h3
            className=" relative bottom-5 text-2xl md:text-4xl  mb-2"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#FFB212",
              textShadow: "-8px 0px #262A51",
              filter: "url(#inner-shadow)",
            }}
          >
            Total{" "}
            <span style={{ display: "block", textIndent: "4ch" }}>
              Estrellas
            </span>
          </h3>
          <h2
            className=" relative text-2xl md:text-7xl mb-2 inline-block bg-clip-text text-transparent bottom-10 text-2xl md:text-7xl mb-2"
            style={{
              fontFamily: "Kavoon, cursive",
              backgroundImage: "linear-gradient(to right, #FF9254, #FFB212)",
            }}
          >
            {TotalStar}
          </h2>
        </div>
      )}

      {/* Imagen estrellas 2*/}

      {genero === "mujer" ? (
        <img
          src={StarPY}
          draggable={false}
          alt="Numbers"
          className="relative bottom-75 left-180 z-50 w-24 h-20 xl:w-50 xl:h-50 object-contain "
        />
      ) : (
        <img
          src={StarYG}
          draggable={false}
          alt="Numbers"
          className="relative bottom-75 left-180 z-50 w-24 h-20 xl:w-50 xl:h-50 object-contain"
        />
      )}

      {/* Imagen estrellas 1*/}

      {genero === "mujer" ? (
        <img
          src={StarG}
          draggable={false}
          alt="Numbers"
          className="relative bottom-100 right-180 z-50 w-30 h-30 object-contain "
        />
      ) : (
        <img
          src={StarP}
          draggable={false}
          alt="Numbers"
          className=" relative bottom-100 right-180 z-50 w-30 h-30 object-contain"
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-30">
        {/* Botón Sumar */}
        <button
          onClick={() =>{ handleActivity("Facil"); playClickButton()}}
          className={` group relative rounded-3xl  bottom-70 w-100 h-60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            ${
              genero === "mujer"
                ? "bg-ground-custom2girl bg-custom-gradient-girl2"
                : genero === "hombre"
                ? "bg-ground-custom2 bg-custom-gradient"
                : "bg-gray-400"
            }`}
            onMouseEnter={() => playClick()}
        >
          {/* Contenedor flex para alinear imagen y texto */}
          <div className="flex justify-center ">
            {/* Texto del lado derecho */}
            {genero === "mujer" ? (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFFFFF",
                    textShadow: "-5px 0px #852526",
                  }}
                >
                  Facil
                </span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                    textShadow: "-8px 0px #262A51",
                  }}
                >
                  Facil
                </span>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() =>{ handleActivity("Medio"); playClickButton()}}
          className={`group relative rounded-3xl p-10 bottom-50 w-110 h-60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            ${
              genero === "mujer"
                ? "bg-ground-custom2girl bg-custom-gradient-girl2"
                : genero === "hombre"
                ? "bg-ground-custom2 bg-custom-gradient"
                : "bg-gray-400"
            }`}
            onMouseEnter={() => playClick()}
        >
          {/* Contenedor flex para alinear imagen y texto */}
          <div className="flex justify-center ">
            {/* Texto del lado derecho */}
            {genero === "mujer" ? (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFFFFF",
                    textShadow: "-5px 0px #852526",
                  }}
                >
                  Medio
                </span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                    textShadow: "-8px 0px #262A51",
                  }}
                >
                  Medio
                </span>
              </div>
            )}
          </div>
        </button>
        <button
          onClick={() => {handleActivity("Dificil"); playClickButton();  } }
          className={` group relative rounded-3xl p-10 bottom-70 w-100 h-60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            ${
              genero === "mujer"
                ? "bg-ground-custom2girl bg-custom-gradient-girl2"
                : genero === "hombre"
                ? "bg-ground-custom2 bg-custom-gradient"
                : "bg-gray-400"
            }`}
            onMouseEnter={() => playClick()}
        >
          {/* Contenedor flex para alinear imagen y texto */}
          <div className="flex justify-center ">
            {/* Texto del lado derecho */}
            {genero === "mujer" ? (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFFFFF",
                    textShadow: "-5px 0px #852526",
                  }}
                >
                  Dificil
                </span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span
                  className="text-3xl md:text-7xl  block"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                    textShadow: "-8px 0px #262A51",
                  }}
                >
                  Dificil
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
      <div className=" absolute bottom-10 left-10 ">
        {/* Botón Cerrar sesión */}
        {genero === "mujer" ? (
          <button
            onClick={() => {
              // Tu lógica aqui
            }}
            className=" text-6xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#5F005C",
              filter: "url(#inner-shadow)",
            }}
          >
            Cerrar sesión
            <LogOut className="w-20 h-20 " strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => {
              // Tu lógica aqui
            }}
            className=" text-6xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#262A51",
              filter: "url(#inner-shadow)",
            }}
          >
            Cerrar sesión
            <LogOut className="w-20 h-20 " strokeWidth={3} />
          </button>
        )}
      </div>

      <div className=" absolute  bottom-10 right-10 ">
        {/* Botón regresar */}
        {genero === "mujer" ? (
          <button
            onClick={() => {
             navigate ("/Home");
             playClickButton();
            }}
            className=" text-6xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#5F005C",
              filter: "url(#inner-shadow)",
            }}
            onMouseEnter={() => playClick()}
          >
            <Undo className="w-20 h-20 " strokeWidth={3} />
           Regresar
           
          </button>
        ) : (
          <button
           onClick={() => {
             navigate ("/Home");
              playClickButton();
            }}
            className=" text-6xl  flex items-center gap-2  bg-transparent border-none cursor-pointer p-0 transition-all duration-300 hover:scale-105 transition-transform mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#262A51",
              filter: "url(#inner-shadow)",
            }}
            onMouseEnter={() => playClick()}
          > 
          <Undo className="w-20 h-20 " strokeWidth={3} />
            Regresar
           
          </button>
        )}
        
      </div>
    </div>
  );
}
