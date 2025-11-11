import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
// Importa tus imágenes
import Background from '../assets/BackgroundLogin.svg';
import kidImage from '../assets/Child.png';
import Numbers837 from '../assets/Numeros 8-3-7.png';
import Resta from '../assets/Resta.png';
import Books from '../assets/Libros.png';
import Numbers102 from '../assets/numeros102 4.png';
import Star from '../assets/Star.png';
import notebook from '../assets/notebook.png';
import plus from '../assets/Plus.png';
import fondo from '../assets/Backgroundinicio 6.svg';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Usuario y contraseña son obligatorios' });
      return;
    }
    const res = await login(username, password);
    if (res.ok) {
      navigate('/Home');
    } else {
      Swal.fire({ icon: 'error', title: 'No se pudo iniciar sesión', text: res.message || 'Verifica tus credenciales' });
    }
  };
  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo */}
      <img 
        src={Background} 
        alt="Background" 
        draggable={false}
        className="absolute w-full h-full object-cover object-center"
      />
      
      <div className="absolute top-0 left-0 right-0 z-20 bg-ground-custom py-4 sm:py-6 md:py-12 lg:py-25 px-4 md:px-10"> 
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 bg-custom-gradient py-4 sm:py-6 md:py-10 lg:py-25 px-4 md:px-10">
            {/* Logo y Título */}
            <div className="absolute max-w-7xl mx-auto flex  top-3 left-30 justify-between">
            
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
            
            <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"   style={{
                fontFamily: 'Kavoon, cursive',
                color:'#FFB212',
                 textShadow: `
                    -10px 0px #262A51`,
                filter: 'url(#inner-shadow)'
                }}               
            >
               Math {' '}
            <span style={{ display: 'block', textIndent: '4ch' }}>
                School
            </span>

            </h1>
            </div>

            {/* Botón de registro */}
            <button
                onClick={handleRegisterClick}
                    className="absolute top-10 right-50 flex  gap-2 px-8 py-3 rounded-full border-2 border-white bg-[#3681C4] hover:bg-[#366bd6] transform hover:scale-105 transition-transform mt-4 sm:mt-6shadow-lg"
                    style={{
                        boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)',
                    }}
                    >
                    {/* Icono + */}
                   
                     <img
                        src={plus}
                        draggable={false}
                        alt="Plus"
                        className="items-center w-10 h-10 object-contain translate-y-2"
                        />

                    {/* Texto */}
                    <span
                        className="text-7xl sm:text-5xl font-bold"
                        style={{
                        color: '#FFB212',
                        fontFamily: 'Kavoon, cursive',
                         textShadow: `
                            -10px 0px #262A51`,
                            filter: 'url(#inner-shadow)'
                        }}
                    >
                        ¡Regístrate aquí!
                    </span>
                    </button>
        </nav>
      </div>

      {/* Star */}
      <div className="absolute top-20 sm:top-24 md:top-28 lg:top-40 left-12 sm:left-16 md:left-24 lg:left-32 z-20  subtle-bounce  ">
        <img 
          src={Star} 
          draggable={false}
          alt="Star" 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
        />
      </div>

      {/* Note-Book */}
      <div className="absolute top-22 sm:top-26 md:top-30 lg:top-34 right-12 sm:right-16 md:right-24 lg:right-32 z-20  subtle-bounce  .">
        <img 
          src={notebook} 
          draggable={false}
          alt="notebook" 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
        />
      </div>

      {/* Imagen numeros 0,1,2 */}
      <div className="absolute bottom-2/8 left-16 sm:left-24 md:left-32 lg:left-40 xl:left-60 transform -translate-x-1/2 z-20  ">
        <img 
          src={Numbers102} 
          draggable={false}
          alt="Numbers102" 
          className="w-32 h-28 sm:w-40 sm:h-36 md:w-52 md:h-44 lg:w-50 lg:h-50 xl:w-50 xl:h-50 object-contain"
        />
      </div>

   {/* FORMULARIO DE LOGIN  */}
                <div className="relative z-20 w-[90%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-xl ">
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
                        Iniciar
                    </h2>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Campo Usuario */}
                        <div>
                        <label
                            className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                            style={{
                            fontFamily: 'Kavoon, cursive',
                            textShadow: `-4px 0px #262A51`,
                            color: '#FFB212',
                            }}
                        >
                            usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-2xl sm:text-2xl md:text-3xl font-semibold bg-gray-100"
                            style={{ fontFamily: 'Kavoon, cursive' }}
                        />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="relative">
                        <label
                            className="block text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2"
                            style={{
                            fontFamily: 'Kavoon, cursive',
                            textShadow: `-4px 0px #262A51`,
                            color: '#FFB212',
                            }}
                        >
                            contraseña
                        </label>

                        <div className="relative">
                            <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-2xl sm:text-2xl md:text-3xl font-semibold bg-gray-100 pr-14"
                            style={{
                                fontFamily: 'Kavoon, cursive',
                            }}
                            placeholder=""
                            />

                            {/* Ícono visible solo cuando hay texto */}
                            {password && (
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center transition-opacity duration-300"
                            >
                                {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-600"
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
                                    className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-600"
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
                        </div>

                        {/* Botón Entrar */}
            <button
                        type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-green-800 font-black text-2xl sm:text-3xl py-2 sm:py-3 rounded-xl border-4 border-yellow-600 shadow-lg transform hover:scale-105 transition-transform mt-3 sm:mt-5"
                        style={{
                            fontFamily: 'Kavoon, cursive',
                        }}
                        >
            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    </div>
                </div>
                </div>


      {/* Imagen kid */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 xl:bottom-28 right-8 sm:right-12 md:right-16 lg:right-20 xl:right-24 z-50">
        <img 
          src={kidImage} 
          draggable={false}
          alt="kid with pencil" 
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-130 lg:h-130 object-contain"
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-custom-gradient-footer py-6 sm:py-8 md:py-10 lg:py-14 xl:py-16 px-4 md:px-10 text-white text-center">
        
        {/* Imagen Books */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8xl:bottom-8 left-20 sm:left-28 md:left-40 lg:left-52 xl:left-64 transform -translate-x-1/2 z-20  ">
          <img 
            src={Books} 
            alt="Books" 
            draggable={false}
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain"
          />
        </div>

        {/* Imagen resta */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 xl:bottom-8 left-1/2 transform -translate-x-1/2 z-20   ">
          <img 
          
            src={Resta} 
            alt="Resta" 
            draggable={false}
            className="w-40 h-16 sm:w-52 sm:h-20 md:w-64 md:h-24 lg:w-80 lg:h-28 xl:w-96 xl:h-32 2xl:w-[28rem] 2xl:h-36 object-contain"
          />
        </div>

        {/* Imagen numeros 8,3,7 */}
        <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 xl:bottom-10 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 z-20  ">
          <img 
            src={Numbers837} 
            draggable={false}
            alt="Numbers" 
            className="w-24 h-20 sm:w-32 sm:h-24 md:w-40 md:h-32 lg:w-48 lg:h-40 xl:w-56 xl:h-48 object-contain"
          />
        </div>
      </div>
    </div>
  );
}