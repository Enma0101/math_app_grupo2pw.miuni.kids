import { useState } from 'react'

import './App.css'

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Hola equipo, soy su mejor amigo: la IA 🤖
      </h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Equipo:</h2>
        <ul className="text-lg text-gray-700 space-y-1">
          <li>👤 Enmanuel Fuenmayor</li>
          <li>👤 Edymar Chacín</li>
          <li>👤 Samuel Rodríguez</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
