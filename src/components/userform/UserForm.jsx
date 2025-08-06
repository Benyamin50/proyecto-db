import React, { useState, useEffect } from 'react';
const UserForm = ({ onSubmit, usuarioEditando, onCancel }) => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    edad: ''
  });

  
  useEffect(() => {
    if (usuarioEditando) {
      setUsuario(usuarioEditando);
    } else {
      setUsuario({ nombre: '', correo: '', edad: '' });
    }
  }, [usuarioEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(usuario);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{usuarioEditando ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
      
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Correo:</label>
        <input
          type="email"
          name="correo"
          value={usuario.correo}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Edad:</label>
        <input
          type="number"
          name="edad"
          value={usuario.edad}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="submit">
          {usuarioEditando ? 'Actualizar' : 'Agregar'}
        </button>
        {usuarioEditando && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;