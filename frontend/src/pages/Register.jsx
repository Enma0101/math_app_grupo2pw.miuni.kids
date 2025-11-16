import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
// Importa tus imágenes
import Background from "../assets/BackgroundLogin.svg";
import Numbers102 from "../assets/numeros102 4.png";
import Stars from "../assets/Stars (2).png";
import notebook from "../assets/notebook.png";
import symbol from "../assets/simbolos.png";
import Calculater from "../assets/calculetor.png";
import fondo from "../assets/Backgroundinicio 6.svg";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [año, setAño] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState(""); // 'mujer' o 'hombre'
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [contraseñaConfirma, setContraseñaConfirma] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMes, setErrorMes] = useState("");
  const [errorDia, setErrorDia] = useState("");
  const [errorAño, setErrorAño] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const currentYear = new Date().getFullYear();

  // Función para validar todos los campos
  const validarCampos = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio";
    if (!mes) nuevosErrores.mes = "El mes es obligatorio";
    if (!dia) nuevosErrores.dia = "El día es obligatorio";
    if (!año) nuevosErrores.año = "El año es obligatorio";
    if (!edad) nuevosErrores.edad = "La edad es obligatoria";
    if (!genero) nuevosErrores.genero = "El género es obligatorio";
    if (!contraseña) nuevosErrores.contraseña = "La contraseña es obligatoria";
    if (!contraseñaConfirma)
      nuevosErrores.contraseñaConfirma = "Confirmar contraseña es obligatorio";

    // Validar que las contraseñas coincidan
    if (contraseña && contraseñaConfirma && contraseña !== contraseñaConfirma) {
      nuevosErrores.contraseñaConfirma = "Las contraseñas no coinciden";
    }

    // Validar longitud mínima de contraseña
    if (contraseña && contraseña.length < 6) {
      nuevosErrores.contraseña =
        "La contraseña debe tener al menos 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;
    const date_birthday = `${String(año).padStart(4, "0")}-${String(
      mes
    ).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const payload = {
      age: parseInt(edad, 10),
      date_birthday,
      full_name: nombre,
      gender: genero,
      password: contraseña,
      username: usuario,
      // full_name: nombre,
      // username: usuario,
      // password: contraseña,
      // age: parseInt(edad, 10),
      // gender: genero,
      // date_birthday
    };
    const res = await register(payload);
    if (res.ok) {
      if (res.loginOk) {
        Swal.fire({
          icon: "success",
          title: "Registro y acceso exitosos",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/Home");
      } else {
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "Inicia sesión para continuar",
          timer: 2000,
          showConfirmButton: true,
        });
        navigate("/login");
      }
    } else {
      navigate("/Home");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Calcular edad automáticamente al cambiar día, mes o año
  useEffect(() => {
    if (dia && mes && año) {
      const hoy = new Date();
      const fechaNacimiento = new Date(`${año}-${mes}-${dia}`);
      let edadCalculada = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const diferenciaMes = hoy.getMonth() - fechaNacimiento.getMonth();

      if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < fechaNacimiento.getDate())
      ) {
        edadCalculada--;
      }

      // Validar que la edad no sea negativa o absurda
      if (edadCalculada >= 0 && edadCalculada < 120) {
        setEdad(edadCalculada);
      } else {
        setEdad("");
      }
    } else {
      setEdad("");
    }
  }, [dia, mes, año]);

  // Limpiar errores cuando el usuario comience a escribir
  const limpiarError = (campo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[campo];
      return nuevosErrores;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={Background}
        alt="Background"
        className="absolute w-full h-full object-cover object-center"
      />

      {/* Navbar - Más compacto */}
      <div className="absolute top-0  left-0 right-0 z-20 bg-ground-custom py-2 sm:py-3 md:py-5 lg:py-30 px-5 md:px-10">
        <nav className="absolute top-0 left-0 right-0 z-20 bg-custom-gradient py-2 sm:py-3 md:py-4 lg:py-30 px-4 md:px-10">
          <div className="absolute max-w-7xl mx-auto flex top-2 left-20 sm:left-30 justify-between">
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

            <h1
              className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold"
              style={{
                fontFamily: "Kavoon, cursive",
                color: "#FFB212",
                textShadow: `-6px 0px #262A51`,
                filter: "url(#inner-shadow)",
              }}
            >
              Math{" "}
              <span style={{ display: "block", textIndent: "3ch" }}>
                School
              </span>
            </h1>
          </div>
        </nav>
      </div>

      {/* Elementos decorativos - Más grandes y mejor responsive */}
      {/* Star */}
      <div className="absolute top-12 sm:top-16 md:top-20 lg:top-60 left-6 sm:left-10 md:left-14 lg:left-20 z-20">
        <img
          src={Stars}
          alt="Star"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-45 lg:h-45 xl:w-60 xl:h-60 object-contain  "
        />
      </div>

      {/* Calculadora */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 left-6 sm:left-10 md:left-14 lg:left-20 z-20">
        <img
          src={Calculater}
          alt="Calculator"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-80 xl:h-80 object-contain"
        />
      </div>

      {/* Note-Book */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-6 sm:right-10 md:right-14 lg:right-20 z-20">
        <img
          src={notebook}
          alt="Notebook"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-80 xl:h-80 object-contain"
        />
      </div>

      {/* Imagen numeros 0,1,2 */}
      <div className="absolute top-12 sm:top-16 md:top-20 lg:top-60 right-8 sm:right-12 md:right-16 lg:right-40 z-20">
        <img
          src={Numbers102}
          alt="Numbers102"
          className="w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 lg:w-36 lg:h-32 xl:w-50 xl:h-50 object-contain"
        />
      </div>

      {/* Simbolos */}
      <div className="absolute top-2 sm:top-4 md:top-6 lg:top-8 right-2 sm:right-4 md:right-6 lg:right-8 z-20">
        <img
          src={symbol}
          alt="Symbol"
          className="w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 lg:w-32 lg:h-28 xl:w-60 xl:h-60 object-contain"
        />
      </div>

      {/* FORMULARIO DE REGISTRO - Más compacto */}
      <div className="relative z-50 w-[95%] sm:w-[90%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mt-16 sm:mt-20">
        {/* Borde naranja exterior */}
        <div className="bg-custom-gradient-footer p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-xl">
          {/* Fondo verde */}
          <div
            className="bg-cover bg-center rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7"
            style={{ backgroundImage: `url(${fondo})` }}
          >
            {/* Título */}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-4 sm:mb-5 md:mb-6"
              style={{
                fontFamily: "Kavoon, cursive",
                textShadow: `-5px 0px #262A51`,
                color: "#FFB212",
                filter: "url(#inner-shadow)",
              }}
            >
              Crea tu usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Fila 1: Nombre y Usuario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Nombre */}
                <div>
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      limpiarError("nombre");
                    }}
                    className={`w-full px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white ${
                      errores.nombre ? "ring-2 ring-red-500" : ""
                    }`}
                    style={{ fontFamily: "Kavoon, cursive" }}
                  />
                  {errores.nombre && (
                    <p
                      className="text-white text-lg sm:text-lg mt-1"
                      style={{
                        fontFamily: "Kavoon, cursive",
                      }}
                    >
                      {errores.nombre}
                    </p>
                  )}
                </div>

                {/* Usuario */}
                <div>
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Usuario
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={(e) => {
                      setUsuario(e.target.value);
                      limpiarError("usuario");
                    }}
                    autoComplete="username"
                    className={`w-full px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white ${
                      errores.usuario ? "ring-2 ring-red-500" : ""
                    }`}
                    style={{ fontFamily: "Kavoon, cursive" }}
                  />
                  {errores.usuario && (
                    <p
                      className="text-white text-lg sm:text-lg mt-1"
                      style={{
                        fontFamily: "Kavoon, cursive",
                      }}
                    >
                      {errores.usuario}
                    </p>
                  )}
                </div>
              </div>

              {/* Fila 2: Fecha de nacimiento y Edad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Fecha de nacimiento */}
                <div>
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Fecha de nacimiento
                  </label>

                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {/* Día */}
                    <div>
                      <input
                        type="text"
                        placeholder="Día"
                        value={dia}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setErrorDia("");
                          if (
                            value === "" ||
                            (Number(value) >= 1 && Number(value) <= 31)
                          ) {
                            setDia(value);
                            limpiarError("dia");
                          } else {
                            setErrorDia("1-31");
                          }
                        }}
                        maxLength={2}
                        className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white ${
                          errores.dia ? "ring-2 ring-red-500" : ""
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorDia && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errorDia}
                        </p>
                      )}
                      {errores.dia && !errorDia && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errores.dia}
                        </p>
                      )}
                    </div>

                    {/* Mes */}
                    <div>
                      <input
                        type="text"
                        placeholder="Mes"
                        value={mes}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setErrorMes("");
                          if (
                            value === "" ||
                            (Number(value) >= 1 && Number(value) <= 12)
                          ) {
                            setMes(value);
                            limpiarError("mes");
                          } else {
                            setErrorMes("1-12");
                          }
                        }}
                        maxLength={2}
                        className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white ${
                          errores.mes ? "ring-2 ring-red-500" : ""
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorMes && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errorMes}
                        </p>
                      )}
                      {errores.mes && !errorMes && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errores.mes}
                        </p>
                      )}
                    </div>

                    {/* Año */}
                    <div>
                      <input
                        type="text"
                        placeholder="Año"
                        value={año}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setErrorAño("");
                          if (value.length <= 4) {
                            setAño(value);
                            limpiarError("año");
                          }
                        }}
                        onBlur={() => {
                          if (año !== "") {
                            const numYear = Number(año);
                            if (numYear < 1900 || numYear > currentYear) {
                              setErrorAño(`1900-${currentYear}`);
                              setAño("");
                            }
                          }
                        }}
                        maxLength={4}
                        className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white ${
                          errores.año ? "ring-2 ring-red-500" : ""
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorAño && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errorAño}
                        </p>
                      )}
                      {errores.año && !errorAño && (
                        <p
                          className="text-white text-lg sm:text-lg mt-1"
                          style={{ fontFamily: "Kavoon, cursive" }}
                        >
                          {errores.año}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edad */}
                <div>
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Edad
                  </label>
                  <input
                    type="text"
                    value={edad}
                    readOnly
                    className={`w-full sm:w-1/2 px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none text-base sm:text-lg bg-gray-100 cursor-not-allowed ${
                      errores.edad ? "ring-2 ring-red-500" : ""
                    }`}
                    style={{ fontFamily: "Kavoon, cursive" }}
                  />
                  {errores.edad && (
                    <p
                      className="text-white text-lg sm:text-lg mt-1"
                      style={{
                        fontFamily: "Kavoon, cursive",
                      }}
                    >
                      {errores.edad}
                    </p>
                  )}
                </div>
              </div>

              {/* Fila 3: Contraseña y Género */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Contraseña */}
                <div className="relative">
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Contraseña
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={contraseña}
                      onChange={(e) => {
                        setContraseña(e.target.value);
                        limpiarError("contraseña");
                      }}
                      className={`w-full  px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white pr-10 sm:pr-12 ${
                        errores.contraseña ? "ring-2 ring-red-500" : ""
                      }`}
                      style={{ fontFamily: "Kavoon, cursive" }}
                    />

                    {contraseña && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 flex items-center justify-center"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.682-7 .885-2.577 2.8-4.746 5.253-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3l18 18"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  {errores.contraseña && (
                    <p
                      className="text-white text-lg sm:text-lg mt-1"
                      style={{
                        fontFamily: "Kavoon, cursive",
                      }}
                    >
                      {errores.contraseña}
                    </p>
                  )}
                </div>

                {/* Género */}
                <div>
                  <label
                    className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-3px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Selecciona tu género:
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGenero("mujer");
                        limpiarError("genero");
                      }}
                      className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                        genero === "mujer"
                          ? "bg-pink-400 text-white scale-105"
                          : "bg-white text-gray-700"
                      } ${errores.genero ? "ring-2 ring-red-500" : ""}`}
                      style={{ fontFamily: "Kavoon, cursive" }}
                    >
                      ♀ Mujer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenero("hombre");
                        limpiarError("genero");
                      }}
                      className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                        genero === "hombre"
                          ? "bg-blue-400 text-white scale-105"
                          : "bg-white text-gray-700"
                      } ${errores.genero ? "ring-2 ring-red-500" : ""}`}
                      style={{ fontFamily: "Kavoon, cursive" }}
                    >
                      ♂ Hombre
                    </button>
                  </div>
                  {errores.genero && (
                    <p
                      className="text-white text-lg sm:text-lg mt-1"
                      style={{
                        fontFamily: "Kavoon, cursive",
                      }}
                    >
                      {errores.genero}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="relative">
                <label
                  className="block text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                  style={{
                    fontFamily: "Kavoon, cursive",
                    textShadow: `-3px 0px #262A51`,
                    color: "#FFB212",
                  }}
                >
                  Confirmar Contraseña
                </label>

                <div className="relative flex items-center">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Ingresa tu contraseña nuevamente"
                    value={contraseñaConfirma}
                    onChange={(e) => {
                      setContraseñaConfirma(e.target.value);
                      limpiarError("contraseñaConfirma");
                    }}
                    className={`w-full md:w-98 px-3 py-2 sm:py-3 rounded-lg border-0 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400 text-base sm:text-lg bg-white pr-12 sm:pr-12 ${
                      errores.contraseñaConfirma ? "ring-2 ring-red-500" : ""
                    }`}
                    style={{ fontFamily: "Kavoon, cursive" }}
                  />

                  {contraseñaConfirma && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute right-2 sm:right-105 flex items-center justify-center"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {showPasswordConfirm ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.682-7 .885-2.577 2.8-4.746 5.253-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {errores.contraseñaConfirma && (
                  <p
                    className="text-white text-lg sm:text-lg mt-1"
                    style={{
                      fontFamily: "Kavoon, cursive",
                    }}
                  >
                    {errores.contraseñaConfirma}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button
                  onClick={handleLoginClick}
                  type="button"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-black text-base sm:text-lg py-2 sm:py-3 rounded-xl border-3 sm:border-4 border-yellow-600 shadow-lg transform hover:scale-105 transition-transform"
                  style={{ fontFamily: "Kavoon, cursive" }}
                >
                  Salir
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-green-800 font-black text-base sm:text-lg py-2 sm:py-3 rounded-xl border-3 sm:border-4 border-yellow-600 shadow-lg transform hover:scale-105 transition-transform"
                  style={{ fontFamily: "Kavoon, cursive" }}
                >
                  {loading ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-custom-gradient-footer py-4 sm:py-6 md:py-8 lg:py-10 px-4 text-white text-center"></div>
    </div>
  );
}
