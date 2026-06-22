import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";

export const AccionExitosaAuth = ({ texto, setShowAccionExitosa }) => {

  const navigate = useNavigate();

  const onClickContinuar = () => {
    setShowAccionExitosa(false);
    navigate('/login'); 
  }

  const modalContent = (
    <div className="accionExitosa animate__animated animate__fadeIn">
      
      <div className="accionExitosa__ventana animate__animated animate__slideInUp">
        
        <div className="accionExitosa__textoBox">
          <span className="material-symbols-rounded accionExitosa__textoBox__icon">
            check_circle
          </span>
          <p className="accionExitosa__textoBox__texto">{texto}</p>
        </div>

        <div style={{ width: '100%', marginTop: '2rem' }}>
          <button 
            type="button"
            onClick={onClickContinuar}
            className="btn btn--blue"
            style={{ width: '100%' }}
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
}