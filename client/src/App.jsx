import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Forgot from './pages/Forgot.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Profile from './pages/Profile.jsx'

function Nav() {
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    nav('/login');
  }
  return (
    <nav className="navbar">
      <Link to="/">USAC Reviews</Link>
      <Link to="/create">Crear Publicación</Link>
      <Link to="/profile/me">Mi Perfil</Link>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}

export default function App(){
  return (
    <div>
      <Nav />
      <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:registro" element={<Profile />} />
      </Routes>
      </div>
    </div>
  )
}
