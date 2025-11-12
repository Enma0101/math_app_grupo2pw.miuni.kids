import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

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

// Componente TypewriterText SIMPLIFICADO
const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  className,
  style,
  onStart,
  onFinish,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStarted(true);
      if (onStart) onStart();
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay, onStart]);

  useEffect(() => {
    if (!started || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex + 1 >= text.length) {
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, started, onFinish]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">▌</span>}
    </span>
  );
};

export default function Home() {
  const { playClick,playClickButton ,playAudio } = useAudio();
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  // Estado derivado del usuario autenticado
  const [genero, setGenero] = useState(user?.gender || "hombre");
  const [userName, setUserName] = useState(user?.full_name || user?.username || "");
  const [TotalStar] = useState(0); // TODO: conectar con progreso real
  // Navegación usa el valor pasado; no se conserva en estado local

  const [typewriterStarted, setTypewriterStarted] = useState(false);

  const handleActivity = (kindOperationValue) => {
    navigate("/Seleccion", {
      state: { kindOperation: kindOperationValue, genero },
    });
  };

  // Reproducir audio y refrescar datos del usuario (por si cambió algo en backend)
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio();
      refreshUser();
    }, 500);
    return () => clearTimeout(timer);
  }, [playAudio, refreshUser]);

  // Sincronizar cuando user cambie (login / refresh)
  useEffect(() => {
    if (user) {
      setGenero(user.gender || "hombre");
      setUserName(user.full_name || user.username);
    }
  }, [user]);

  const handleTypewriterStart = () => {
    if (!typewriterStarted) {
      setTypewriterStarted(true);
    }
  };

  const tomarPrimeraPalabra = (nombre) => {
    return nombre.trim().split(/\s+/)[0];
  };
  const primerNombre = tomarPrimeraPalabra(userName);

  return (
  <div className="h-screen bg-linear-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
        className={`absolute top-0 left-0 right-0 z-20 py-4 sm:py-6 md:py-15 lg:py-25 px-4 md:px-10 ${
          genero === "mujer" ? "bg-ground-custom-girl" : "bg-ground-custom"
        }`}
      >
        <nav
          className={`absolute top-0 left-0 right-0 z-30 py-4 sm:py-6 md:py-15 lg:py-25 px-4 md:px-10 ${
            genero === "mujer"
              ? "bg-custom-gradient-girl"
              : "bg-custom-gradient"
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
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-7xl font-bold"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFFFFF",
                    textShadow: "-10px 0px #852526",
                    filter: "url(#inner-shadow)",
                  }}
                >
                  Bienvenido
                </h1>
              ) : (
                <h1
                  className="sm:text-3xl md:text-5xl lg:text-7xl font-bold"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    color: "#FFB212",
                    textShadow: "-10px 0px #262A51",
                    filter: "url(#inner-shadow)",
                  }}
                >
                  Bienvenido
                </h1>
              )}
            </div>

            <div className="flex-1 flex justify-end items-start">
             
            </div>
          </div>
        </nav>
      </div>

      {/* Imagen numeros */}
      {genero === "mujer" ? (
        <div className="relative top-95 right-100 z-20">
          <img
            src={Number1}
            draggable={false}
            alt="Numbers"
            className="w-24 h-20 xl:w-50 xl:h-50 object-contain"
          />
        </div>
      ) : (
        <div className="relative top-80 right-100 z-20">
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
        <div className="rounded-3xl p-8 mb-8 relative top-45 left-10">
          <div>
            <h2
              className="text-5xl md:text-5xl mb-3"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#5F005C",
                filter: "url(#inner-shadow)",
              }}
            >
              <TypewriterText
                key={primerNombre}
                text={`¡Bienvenido, ${primerNombre}!`}
                speed={50}
                onStart={() => {
                  handleTypewriterStart();
                }}
              />
            </h2>
            <p
              className="text-4xl md:text-5xl mb-3"
              style={{
                color: "#5F005C",
                fontFamily: "Kavoon, cursive",
                filter: "url(#inner-shadow)",
              }}
            >
              <TypewriterText
                text="¿Qué realizaremos hoy?"
                speed={40}
                delay={1800}
              />
              <span style={{ display: "block" }}>
                <TypewriterText
                  text="realizaremos hoy?"
                  speed={40}
                  delay={2700}
                />
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl p-8 mb-8 relative top-35 left-10">
          <div>
            <h2
              className="text-5xl md:text-5xl mb-3"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#262A51",
                filter: "url(#inner-shadow)",
              }}
            >
              <TypewriterText
                key={primerNombre}
                text={`¡Bienvenido! "${primerNombre}"`}
                speed={50}
                onStart={() => {
                  handleTypewriterStart();
                }}
              />
            </h2>
            <p
              className="text-4xl md:text-5xl mb-3"
              style={{
                color: "#262A51",
                fontFamily: "Kavoon, cursive",
                filter: "url(#inner-shadow)",
              }}
            >
              <TypewriterText
                text="me encantaría saber que "
                speed={40}
                delay={1800}
              />
              <span style={{ display: "block" }}>
                <TypewriterText
                  text="realizaremos hoy?"
                  speed={40}
                  delay={2700}
                />
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Tarjeta de estrellas */}
      {genero === "mujer" ? (
        <div className="relative bottom-20 left-140 bg-ground-custom2girl bg-custom-gradient-girl2 rounded-3xl p-8 h-42 w-80 shadow-4xl z-40 subtle-bounce">
          <h3
            className="relative bottom-5 text-2xl md:text-4xl mb-2"
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
            className="relative text-2xl md:text-7xl mb-2 inline-block bg-clip-text text-transparent bottom-10"
            style={{
              fontFamily: "Kavoon, cursive",
              backgroundImage: "linear-gradient(to right, #ED06E5, #5F005C)",
            }}
          >
            {TotalStar}
          </h2>
        </div>
      ) : (
        <div className="relative bottom-30 left-140 bg-ground-custom2 bg-custom-gradient-girl2 rounded-3xl p-8 h-42 w-80 shadow-4xl z-40 subtle-bounce">
          <h3
            className="relative bottom-5 text-2xl md:text-4xl mb-2"
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
            className="relative text-2xl md:text-7xl mb-2 inline-block bg-clip-text text-transparent bottom-10"
            style={{
              fontFamily: "Kavoon, cursive",
              backgroundImage: "linear-gradient(to right, #FF9254, #FFB212)",
            }}
          >
            {TotalStar}
          </h2>
        </div>
      )}

      {/* Imagen estrellas */}
      {genero === "mujer" ? (
        <img
          src={StarPY}
          draggable={false}
          alt="Numbers"
          className="relative bottom-80 left-180 z-50 w-24 h-20 xl:w-50 xl:h-50 object-contain"
        />
      ) : (
        <img
          src={StarYG}
          draggable={false}
          alt="Numbers"
          className="relative bottom-85 left-180 z-50 w-24 h-20 xl:w-50 xl:h-50 object-contain"
        />
      )}

      {genero === "mujer" ? (
        <img
          src={StarG}
          draggable={false}
          alt="Numbers"
          className="relative bottom-110 right-180 z-50 w-30 h-30 object-contain"
        />
      ) : (
        <img
          src={StarP}
          draggable={false}
          alt="Numbers"
          className="relative bottom-110 right-180 z-50 w-30 h-30 object-contain"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-50">
        <button
          onClick={() => {
            playClickButton();
            handleActivity("Sumas");
          }}
          className={` group relative rounded-3xl p-10 bottom-80 w-150 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 mt-3 sm:mt-5 ${
            genero === "mujer"
              ? "bg-ground-custom2girl bg-custom-gradient-girl2"
              : "bg-ground-custom2 bg-custom-gradient"
          }`}
          onMouseEnter={() => playClick()}
        >
          <div className="flex items-center gap-15">
            <div className="w-35 h-35 rounded-full shrink-0 group-hover:rotate-12 transition-transform">
              {genero === "mujer" ? (
                <img
                  src={Plusgirl}
                  draggable={false}
                  alt="Background"
                  className="w-35 h-35 object-contain"
                />
              ) : (
                <img
                  src={plusboy}
                  draggable={false}
                  alt="plusboy"
                  className="w-35 h-35 object-contain"
                />
              )}
            </div>
            <div className="text-left">
              {genero === "mujer" ? (
                <>
                  <span
                    className="text-3xl md:text-4xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFFFFF",
                      textShadow: "-7px 0px #852526",
                    }}
                  >
                    Hoy vamos a
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFFFFF",
                      textShadow: "-7px 0px #852526",
                    }}
                  >
                    Sumar
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="text-3xl md:text-4xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFB212",
                      textShadow: "-7px 0px #262A51",
                    }}
                  >
                    Hoy vamos a
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFB212",
                      textShadow: "-7px 0px #262A51",
                    }}
                  >
                    Sumar
                  </span>
                </>
              )}
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            playClickButton();
            handleActivity("Restas");
          }}
          className={`group relative rounded-3xl p-10 bottom-80 w-150 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 mt-3 sm:mt-5 ${
            genero === "mujer"
              ? "bg-ground-custom2girl bg-custom-gradient-girl2"
              : "bg-ground-custom2 bg-custom-gradient"
          }`}
          onMouseEnter={() => playClick()}
        >
          <div className="flex items-center gap-15">
            <div className="w-35 h-35 rounded-full shrink-0 group-hover:-rotate-12 transition-transform">
              {genero === "mujer" ? (
                <img
                  src={resgirl}
                  draggable={false}
                  alt="resgirl"
                  className="w-35 h-35 object-contain"
                />
              ) : (
                <img
                  src={restboy}
                  draggable={false}
                  alt="restboy"
                  className="w-35 h-35 object-contain"
                />
              )}
            </div>
            <div className="text-left">
              {genero === "mujer" ? (
                <>
                  <span
                    className="text-3xl md:text-4xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFFFFF",
                      textShadow: "-7px 0px #852526",
                    }}
                  >
                    Hoy vamos a
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFFFFF",
                      textShadow: "-7px 0px #852526",
                    }}
                  >
                    Restar
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="text-3xl md:text-4xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFB212",
                      textShadow: "-7px 0px #262A51",
                    }}
                  >
                    Hoy vamos a
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-bold block"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      color: "#FFB212",
                      textShadow: "-7px 0px #262A51",
                    }}
                  >
                    Restar
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="absolute bottom-10 left-10">
        {genero === "mujer" ? (
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-6xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-transform duration-300 hover:scale-105 mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#5F005C",
              filter: "url(#inner-shadow)",
            }}
          >
            Cerrar sesión
            <LogOut className="w-20 h-20" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-6xl flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 transition-transform duration-300 hover:scale-105 mt-3 sm:mt-5"
            style={{
              fontFamily: "Kavoon, cursive",
              color: "#262A51",
              filter: "url(#inner-shadow)",
            }}
          >
            Cerrar sesión
            <LogOut className="w-20 h-20" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}