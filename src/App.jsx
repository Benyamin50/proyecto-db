import React, { useState, useEffect } from 'react';
import './App.css';
import UserForm from './components/userform/UserForm';
import UserList from './components/userlist/UserList';
import UserSearch from './components/usersearch/UserSearch';


const API_BASE_URL = 'https://proyecto-db-2fjt.onrender.com';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const handleSubmit = async (usuario) => {
    try {
      const url = usuarioEditando 
        ? `${API_BASE_URL}/api/usuarios/${usuarioEditando.id}`
        : `${API_BASE_URL}/api/usuarios`;
      
      const method = usuarioEditando ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error('Error al guardar');
      
      fetchUsuarios(); 
      setUsuarioEditando(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar');
      fetchUsuarios(); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioEditando(usuario);
  };

  return (
    <div className="app-container">
      <h1>CRUD en React de Usuarios</h1>
      <div className="app-content">
        <div className="form-section">
          <UserForm
            onSubmit={handleSubmit}
            usuarioEditando={usuarioEditando}
            onCancel={() => setUsuarioEditando(null)}
          />
        </div>
        <div className="search-section">
          <UserSearch onSearch={setBusqueda} />
        </div>
        <div className="list-section">
          <UserList
            usuarios={usuarios}
            busqueda={busqueda}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default App;