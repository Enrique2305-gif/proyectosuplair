import React, { useState } from "react";
import ReactDOM from "react-dom";
// import { Terminos } from "../components"; // Descomenta si usas el componente de texto
export const TerminosPage = ({ uploadUser, setShowAccionExitosa, setShowTerminos }) => {

  const [acepta, setAcepta] = useState(true);
  const [checked, setChecked] = useState(false);

  const onAceptar = async () => {
    if (checked) {
      setShowTerminos(false);
      await uploadUser();
    } else {
      setAcepta(false);
    }
  };

  const onCancelar = () => {
    setShowTerminos(false);
  };

  const modalContent = (
    <div className="terminosModal animate__animated animate__fadeIn">
      <div className="terminosModal__ventana animate__animated animate__slideInUp">
        
        <div className="terminosModal__header">
          <h3>Términos y Condiciones</h3>
        </div>

        <div className="terminosModal__body">
          <p className="paragraph">
            Bienvenido a <strong>Suplaier</strong>. Al registrarse, usted acepta cumplir con los siguientes términos:
          </p>
          <br />
          <ol style={{ paddingLeft: '2rem' }}>
            <li className="paragraph"><strong>Uso de datos:</strong> Sus datos serán utilizados únicamente para fines comerciales dentro de la plataforma.</li>
            <li className="paragraph"><strong>Veracidad:</strong> Usted declara que la información proporcionada es real y verificable.</li>
            <li className="paragraph"><strong>Responsabilidad:</strong> Suplaier actúa como intermediario y no se hace responsable por acuerdos externos entre partes.</li>
            <li className="paragraph"><strong>Pagos:</strong> Las transacciones realizadas a través de la plataforma están sujetas a validación bancaria.</li>
            <li className="paragraph"><strong>Privacidad:</strong> Respetamos su privacidad y protegemos sus datos bajo estándares de seguridad internacionales.</li>
            <li className="paragraph"><strong>Conducta:</strong> Se espera un comportamiento profesional entre compradores y proveedores.</li>
          </ol>
          <br />
          <p className="paragraph">
            Al hacer clic en "Aceptar y Registrarse", confirma que ha leído y entendido este documento legal.
          </p>
        </div>

        {/* Footer con Checkbox y Botones */}
        <div className="terminosModal__footer">
          
          <div className="terminosModal__checkbox-container">
            <input 
                type="checkbox" 
                id="aceptBox"
                checked={checked}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    if(e.target.checked) setAcepta(true);
                }}
            />
            <label htmlFor="aceptBox">He leído y acepto los términos y condiciones</label>
          </div>

          {!acepta && (
             <p className="paragraph--sm" style={{color: '#E53E3E'}}>⚠️ Debes aceptar los términos para continuar</p>
          )}

          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
            <button 
                type="button" 
                onClick={onCancelar} 
                className="btn btn--red"
                style={{flex: 1}}
            >
                Cancelar
            </button>
            <button 
                type="button" 
                onClick={onAceptar} 
                className="btn btn--blue"
                style={{flex: 1}}
            >
                Registrarme
            </button>
          </div>

        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};