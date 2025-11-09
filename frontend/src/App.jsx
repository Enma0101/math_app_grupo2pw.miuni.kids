import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Seleccion from './pages/Seleccion';
import Game from './pages/Game';
import Exercise from './pages/Exercise';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/Home" element={<Home />} />
          <Route path="/Seleccion" element={<Seleccion />} />
            <Route path="/Game" element={<Game />} />
             <Route path="/Exercise" element={<Exercise />} />


      </Routes>
    </Router>
  );
}

export default App;
