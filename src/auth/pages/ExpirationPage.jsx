

import { useNavigate } from "react-router-dom";

export const ExpirationPage = () => {
    const navigate = useNavigate();

    const handleClickAceptar = () => {
        navigate("/login", {
            replace: true,
          });
      
      }
    return ( 
        <div className="expiradaPage">
          <div className="expiradaPage__expiradaContainer">
                    <img 
                src="suplaier_horizontal_degradado.png" 
                alt="logo_suplaier" 
                className="loginPage__centralbox__izq__logoImg" 
              />
          <div className="expiradaContainer__textoExpiradaContainer">
          <p> <b>Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</b></p>
          </div>
          <div className="oferta-detalle__btnBoxResp">
          <button
            className="btn btn--blue"
            onClick={handleClickAceptar}>
            Aceptar
          </button>
          </div>
          <div className="expiradaPage__expiradaContainer__marginBottom"></div>
          </div>
        </div>
      );


}