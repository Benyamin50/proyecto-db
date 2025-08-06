import React, { useState } from 'react';
const UserSearch = ({ onSearch }) => {
  return (
    <div className="user-search">
      <h2>Buscar Usuario</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;