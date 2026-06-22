import React from 'react';

const PopupAceptado = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popupAceptado">
      <div className="popupAceptado-content">
        <p>Registro aceptado exitosamente</p>
        <div className="button-container">
          <button onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export {PopupAceptado};