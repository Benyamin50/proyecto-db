import React, { useState } from 'react';
const UserList = ({ usuarios, busqueda, onDelete, onEdit }) => {
  const truncarNombre = (nombre) => {
    return nombre.length > 10 ? `${nombre.substring(0, 10)}...` : nombre;
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="user-list">
      <h2>Lista de Usuarios ({usuarios.length})</h2>
      
      {usuariosFiltrados.length === 0 ? (
        <p className="no-users">No hay usuarios registrados</p>
      ) : (
        <ul>
          {usuariosFiltrados.map(usuario => (
            <li key={usuario.id} className="user-item">
              <div className="user-info">
                <span className="user-name">{truncarNombre(usuario.nombre)} </span>
                <span className="user-email">{usuario.correo} </span>
                <span className="user-age">{usuario.edad} años</span>
              </div>
              
              <div className="user-actions">
               <button className="edit-btn" onClick={() => onEdit(usuario)}>Editar</button>
               <button className="delete-btn" onClick={() => onDelete(usuario.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;