import React, { useState, useEffect } from 'react';
import './App.css';
import UserForm from './components/userform/UserForm';
import UserList from './components/userlist/UserList';
import UserSearch from './components/usersearch/UserSearch';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Cambié solo esta línea:
  const API_URL = 'https://proyecto-db-slmz.onrender.com/api';

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const handleSubmit = async (usuario) => {
    try {
      const url = usuarioEditando 
        ? `${API_URL}/usuarios/${usuarioEditando.id}`
        : `${API_URL}/usuarios`;
      
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
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
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