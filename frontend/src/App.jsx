import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './components/AudioManager';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Seleccion from './pages/Seleccion';
import Game from './pages/Game';
import Exercise from './pages/Exercise';
import './index.css';
import { ProtectedRoute, FlowRoute } from './context/AuthContext.jsx';

function App() {
  return (
    <AudioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home siempre accesible si está logueado */}
          <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Rutas internas controladas por FlowRoute */}
          <Route path="/Seleccion" element={<FlowRoute><Seleccion /></FlowRoute>} />
          <Route path="/Game" element={<FlowRoute><Game /></FlowRoute>} />
          <Route path="/Exercise" element={<FlowRoute><Exercise /></FlowRoute>} />
        </Routes>
      </Router>
    </AudioProvider>
  );
}

export default App;
