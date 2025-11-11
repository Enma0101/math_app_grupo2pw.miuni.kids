import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Seleccion from './pages/Seleccion';
import Game from './pages/Game';
import Exercise from './pages/Exercise';
import './index.css';
import { ProtectedRoute } from './context/AuthContext.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Seleccion" element={<ProtectedRoute><Seleccion /></ProtectedRoute>} />
        <Route path="/Game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/Exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />


      </Routes>
    </Router>
  );
}

export default App;
