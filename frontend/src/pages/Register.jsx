import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa tus imágenes
import Background from '../assets/BackgroundLogin.svg';
import Numbers102 from '../assets/numeros102 4.png';
import Stars from '../assets/Stars (2).png';
import notebook from '../assets/notebook.png';
import symbol from '../assets/simbolos.png';
import Calculater from '../assets/calculetor.png';
import fondo from '../assets/Backgroundinicio 6.svg';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [mes, setMes] = useState('');
  const [dia, setDia] = useState('');
  const [año, setAño] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState(''); // 'mujer' o 'hombre'
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [contraseñaConfirma, setContraseñaConfirma] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMes, setErrorMes] = useState("");
  const [errorDia, setErrorDia] = useState("");
  const [errorAño, setErrorAño] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
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
    if (!contraseñaConfirma) nuevosErrores.contraseñaConfirma = "Confirmar contraseña es obligatorio";
    
    // Validar que las contraseñas coincidan
    if (contraseña && contraseñaConfirma && contraseña !== contraseñaConfirma) {
      nuevosErrores.contraseñaConfirma = "Las contraseñas no coinciden";
    }

    // Validar longitud mínima de contraseña
    if (contraseña && contraseña.length < 6) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    if (validarCampos()) {
      // Si no hay errores, proceder con el envío del formulario
      console.log("Formulario válido, enviando datos...");
      console.log({
        nombre,
        usuario,
        fechaNacimiento: `${dia}/${mes}/${año}`,
        edad,
        genero,
        contraseña
      });
      
  
      
    } else {

    }
  };

  const handleLoginClick = () => {
    navigate('/login'); 
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
        setEdad('');
      }
    } else {
      setEdad('');
    }
  }, [dia, mes, año]);

  // Limpiar errores cuando el usuario comience a escribir
  const limpiarError = (campo) => {
    setErrores(prev => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[campo];
      return nuevosErrores;
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo */}
      <img 
        src={Background} 
        alt="Background" 
        className="absolute w-full h-full object-cover object-center"
      />
      
      <div className="absolute top-0 left-0 right-0 z-20 bg-ground-custom py-4 sm:py-6 md:py-12 lg:py-20 px-4 md:px-10"> 
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 bg-custom-gradient py-4 sm:py-6 md:py-10 lg:py-20 px-4 md:px-10">
          {/* Logo y Título */}
          <div className="absolute max-w-7xl mx-auto flex top-3 left-30 justify-between">
            <svg width="0" height="0">
              <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset dx="3" dy="3"/>
                <feGaussianBlur stdDeviation="3" result="offset-blur"/>
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                <feFlood floodColor="rgba(0,0,0,0.5)" result="color"/>
                <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
              </filter>
            </svg>
            
            <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold" style={{
              fontFamily: 'Kavoon, cursive',
              color:'#FFB212',
              textShadow: `-10px 0px #262A51`,
              filter: 'url(#inner-shadow)'
            }}>
              Math {' '}
              <span style={{ display: 'block', textIndent: '4ch' }}>
                School
              </span>
            </h1>
          </div>
        </nav>
      </div>

      {/* Star */}
      <div className="absolute top-20 sm:top-24 md:top-28 lg:top-40 left-12 sm:left-16 md:left-40 lg:left-50 z-20 ">
        <img 
          src={Stars} 
          alt="Star" 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
        />
      </div>

         {/* Calculadora */}
      <div className="absolute bottom-20 sm:bottom-20 md:bottom-20 lg:bottom-20 left-12 sm:left-20 md:left-20 lg:left-20 z-20 ">
        <img 
          src={Calculater} 
          alt="Star" 
          className="w-20 h-20 sm:w-80 sm:h-80 md:w-80 md:h-80 lg:w-80 lg:h-80 xl:w-80 xl:h-80 object-contain"
        />
      </div>

      {/* Note-Book */}
      <div className="absolute bottom-14 sm:bottom-16 md:bottom-20 lg:bottom-24 right-12 sm:right-16 md:right-24 lg:right-32 z-20 ">
        <img 
          src={notebook} 
          alt="notebook" 
          className="w-20 h-20 sm:w-70 sm:h-70 md:w-70 md:h-70 lg:w-70 lg:h-70 xl:w-70 xl:h-70 object-contain"
        />
      </div>

      {/* Imagen numeros 0,1,2 */}
      <div className="absolute top-14 sm:top-16 md:top-30 lg:top-60 right-20 sm:right-30 md:right-50 lg:right-60 z-60 ">
        <img 
          src={Numbers102} 
          alt="Numbers102" 
          className="w-32 h-28 sm:w-40 sm:h-36 md:w-52 md:h-44 lg:w-50 lg:h-50 xl:w-50 xl:h-50 object-contain"
        />
      </div>

      
      {/* simbolos*/}
      <div className="absolute top-0 sm:top-0 md:top-0 lg:top-0 right-0 sm:right-15 md:right-20 lg:right-20 z-60 ">
        <img 
          src={symbol} 
          alt="symbol" 
          className="w-32 h-28 sm:w-40 sm:h-36 md:w-52 md:h-44 lg:w-50 lg:h-50 xl:w-50 xl:h-50 object-contain"
        />
      </div>

    {/* FORMULARIO DE Registro */}
      <div className="relative z-50 top-16 w-[90%] max-w-md sm:max-w-5xl md:max-w-5xl lg:max-w-5xl ">
        {/* Borde naranja exterior */}
        <div className="bg-custom-gradient-footer p-3 sm:p-4 md:p-5 rounded-3xl shadow-2xl">
          {/* Fondo verde */}
          <div
            className="bg-cover bg-center rounded-2xl p-5 sm:p-6 md:p-8"
            style={{ backgroundImage: `url(${fondo})` }}
          >
            {/* Título Iniciar */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-5 sm:mb-7"
              style={{
                fontFamily: 'Kavoon, cursive',
                textShadow: `-8px 0px #262A51`,
                color: '#FFB212',
                filter: 'url(#inner-shadow)',
              }}
            >
              Crea tu usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fila 1: Nombre y Usuario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: 'Kavoon, cursive',
                      textShadow: `-4px 0px #262A51`,
                      color: '#FFB212',
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
                      limpiarError('nombre');
                    }}
                    className={`w-full px-3 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white ${
                      errores.nombre ? 'ring-2 ring-red-500' : ''
                    }`}
                    style={{ fontFamily: 'Kavoon, cursive' }}
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-md font-semibold mt-1" style={{
                      fontFamily: 'Kavoon, cursive',
                    }}>
                      {errores.nombre}
                    </p>
                  )}
                </div>

                {/* Usuario */}
                <div>
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: 'Kavoon, cursive',
                      textShadow: `-4px 0px #262A51`,
                      color: '#FFB212',
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
                      limpiarError('usuario');
                    }}
                    autoComplete="username"
                    className={`w-full px-3 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white ${
                      errores.usuario ? 'ring-2 ring-red-500' : ''
                    }`}
                    style={{ fontFamily: 'Kavoon, cursive' }}
                  />
                  {errores.usuario && (
                    <p className="text-red-500 text-md font-semibold mt-1" style={{
                      fontFamily: 'Kavoon, cursive',
                    }}>
                      {errores.usuario}
                    </p>
                  )}
                </div>
              </div>

              {/* Fila 2: Fecha de nacimiento y Edad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha de nacimiento */}
                <div>
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: "Kavoon, cursive",
                      textShadow: `-4px 0px #262A51`,
                      color: "#FFB212",
                    }}
                  >
                    Fecha de nacimiento
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Mes */}
                    <div>
                      <input
                        type="text"
                        placeholder="Mes"
                        value={mes}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setErrorMes("");
                          if (value === "" || (Number(value) >= 1 && Number(value) <= 12)) {
                            setMes(value);
                            limpiarError('mes');
                          } else {
                            setErrorMes("El mes debe estar entre 1 y 12");
                          }
                        }}
                        maxLength={2}
                        className={`w-full px-3 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white ${
                          errores.mes ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorMes && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>{errorMes}</p>
                      )}
                      {errores.mes && !errorMes && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>
                          {errores.mes}
                        </p>
                      )}
                    </div>

                    {/* Día */}
                    <div>
                      <input
                        type="text"
                        placeholder="Día"
                        value={dia}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setErrorDia("");
                          if (value === "" || (Number(value) >= 1 && Number(value) <= 31)) {
                            setDia(value);
                            limpiarError('dia');
                          } else {
                            setErrorDia("El día debe estar entre 1 y 31");
                          }
                        }}
                        maxLength={2}
                        className={`w-full px-3 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white ${
                          errores.dia ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorDia && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>{errorDia}</p>
                      )}
                      {errores.dia && !errorDia && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>
                          {errores.dia}
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
                            limpiarError('año');
                          }
                        }}
                        onBlur={() => {
                          if (año !== "") {
                            const numYear = Number(año);
                            if (numYear < 1900 || numYear > currentYear) {
                              setErrorAño(`El año debe estar entre 1900 y ${currentYear}`);
                              setAño("");
                            }
                          }
                        }}
                        maxLength={4}
                        className={`w-full px-3 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white ${
                          errores.año ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{ fontFamily: "Kavoon, cursive" }}
                      />
                      {errorAño && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>{errorAño}</p>
                      )}
                      {errores.año && !errorAño && (
                        <p className="text-red-500 text-md font-semibold mt-1" style={{
                          fontFamily: "Kavoon, cursive",
                        }}>
                          {errores.año}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edad */}
                <div>
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: 'Kavoon, cursive',
                      textShadow: `-4px 0px #262A51`,
                      color: '#FFB212',
                    }}
                  >
                    Edad
                  </label>
                  <input
                    type="text"
                    value={edad}
                    readOnly
                    className={`w-1/3 px-3 py-3 rounded-lg border-0 focus:outline-none text-lg font-semibold bg-gray-100 cursor-not-allowed ${
                      errores.edad ? 'ring-2 ring-red-500' : ''
                    }`}
                    style={{ fontFamily: 'Kavoon, cursive' }}
                  />
                  {errores.edad && (
                    <p className="text-red-500 text-md font-semibold mt-1" style={{
                      fontFamily: 'Kavoon, cursive',
                    }}>
                      {errores.edad}
                    </p>
                  )}
                </div>
              </div>

              {/* Fila 3: Contraseña y Género */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div className="relative">
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: 'Kavoon, cursive',
                      textShadow: `-4px 0px #262A51`,
                      color: '#FFB212',
                    }}
                  >
                    Contraseña
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={contraseña}
                      onChange={(e) => {
                        setContraseña(e.target.value);
                        limpiarError('contraseña');
                      }}
                      className={`w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white pr-12 ${
                        errores.contraseña ? 'ring-2 ring-red-500' : ''
                      }`}
                      style={{ fontFamily: 'Kavoon, cursive' }}
                    />

                      {contraseña && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 flex items-center justify-center"
                                style={{
                                top: '50%',
                                transform: 'translateY(-50%)',
                                }}
                            >
                                {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7 h-7 text-yellow-600"
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
                                    className="w-7 h-7 text-yellow-600"
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
                    <p className="text-red-500 text-md font-semibold mt-1" style={{
                      fontFamily: 'Kavoon, cursive',
                    }}>
                      {errores.contraseña}
                    </p>
                  )}
                </div>
                

                {/* Género */}
                <div>
                  <label
                    className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                    style={{
                      fontFamily: 'Kavoon, cursive',
                      textShadow: `-4px 0px #262A51`,
                      color: '#FFB212',
                    }}
                  >
                    Selecciona tu género:
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGenero('mujer');
                        limpiarError('genero');
                      }}
                      className={`flex items-center gap-1 px-5 py-5 rounded-lg transition-all ${
                        genero === 'mujer'
                          ? 'bg-pink-400 text-white scale-105'
                          : 'bg-white text-gray-700'
                      } ${errores.genero ? 'ring-2 ring-red-500' : ''}`}
                      style={{ fontFamily: 'Kavoon, cursive' }}
                    >
                      ♀ Mujer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenero('hombre');
                        limpiarError('genero');
                      }}
                      className={`flex gap-3 px-5 py-5 rounded-lg transition-all ${
                        genero === 'hombre'
                          ? 'bg-blue-400 text-white scale-105'
                          : 'bg-white text-gray-700'
                      } ${errores.genero ? 'ring-2 ring-red-500' : ''}`}
                      style={{ fontFamily: 'Kavoon, cursive' }}
                    >
                      ♂ Hombre
                    </button>
                  </div>
                  {errores.genero && (
                    <p className="text-red-500 text-md font-semibold mt-1" style={{
                      fontFamily: 'Kavoon, cursive',
                    }}>
                      {errores.genero}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="relative">
                <label
                  className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                  style={{
                    fontFamily: 'Kavoon, cursive',
                    textShadow: `-4px 0px #262A51`,
                    color: '#FFB212',
                  }}
                >
                  Confirmar Contraseña
                </label>

                <div className="relative flex items-center">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña nuevamente"
                    value={contraseñaConfirma}
                    onChange={(e) => {
                      setContraseñaConfirma(e.target.value);
                      limpiarError('contraseñaConfirma');
                    }}
                    className={`w-1/2 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg font-semibold bg-white pr-12 ${
                      errores.contraseñaConfirma ? 'ring-2 ring-red-500' : ''
                    }`}
                    style={{ fontFamily: 'Kavoon, cursive' }}
                  />

                  {contraseñaConfirma && (
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute  left-105 flex items-center justify-center"
                                style={{
                                top: '50%',
                                transform: 'translateY(-50%)',
                                }}
                            >
                                {showPasswordConfirm ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7 h-7 text-yellow-600"
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
                                    className="w-7 h-7 text-yellow-600"
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
                  <p className="text-red-500 text-md font-semibold mt-1" style={{
                    fontFamily: 'Kavoon, cursive',
                  }}>
                    {errores.contraseñaConfirma}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                onClick={ handleLoginClick }
                  type="button"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-black text-xl py-3 rounded-xl border-4 border-yellow-600 shadow-lg transform hover:scale-105 transition-transform"
                  style={{ fontFamily: 'Kavoon, cursive' }}
                >
                  Salir
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-black text-xl py-3 rounded-xl border-4 border-yellow-600 shadow-lg transform hover:scale-105 transition-transform"
                  style={{ fontFamily: 'Kavoon, cursive' }}
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-custom-gradient-footer py-6 sm:py-8 md:py-10 lg:py-14 xl:py-16 px-4 md:px-10 text-white text-center">
      </div>
    </div>
  );
}