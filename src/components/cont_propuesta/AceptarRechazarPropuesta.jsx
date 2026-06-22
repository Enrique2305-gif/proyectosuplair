import React from 'react';
import { apiUrl } from '../../apiUrl';
export const AceptarRechazarPropuesta = ({ idPropuesta, onEstadoCambiado }) => {
  const actualizarEstado = (nuevoEstado) => {
    fetch(`${apiUrl}/propuestas?.IdDemanda?`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdSolicitud: idPropuesta, Estado: nuevoEstado }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      onEstadoCambiado();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <button onClick={() => actualizarEstado('aprobada')}>Aceptar</button>
      <button onClick={() => actualizarEstado('rechazada')}>Rechazar</button>
    </div>
  );
};

