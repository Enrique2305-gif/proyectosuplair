import { useState } from "react";
import { ModalReporteInvitaciones } from "./ModalReporteInvitaciones";

export const CardUsuario = ({ usuario }) => {
  const [showModalReporte, setShowModalReporte] = useState(false);

  const onEditarUsuario = () => {
    console.log("Editando usuario");
  };

  const onBloquearUsuario = () => {
    console.log("Bloqueando usuario");
  };

  const onVerReporte = () => {
    setShowModalReporte(true);
  };

  const onCloseModal = () => {
    setShowModalReporte(false);
  };

  const esComprador = usuario.IdRol === 1;
  const estrellas = usuario.estrellas_acumuladas ?? 0;

  return (
    <>
      <div className="cardUsuarioContainer">
        <div className="cardUsuarioContainer__main">
          <div className="cardUsuarioContainer__info">
            <h3 className="cardUsuarioContainer__nombre">{usuario.Nombre}</h3>
            <h5 className="cardUsuarioContainer__email">{usuario.Email}</h5>
          </div>

          <div className="cardUsuarioContainer__actions">
            {esComprador && (
              <>
                <div className="cardUsuarioContainer__badge">
                  <span>⭐</span>
                  <p>Estrellas: {estrellas}</p>
                </div>

                <button
                  onClick={onVerReporte}
                  className="cardUsuarioContainer__btn cardUsuarioContainer__btn--secondary"
                >
                  Reporte
                </button>
              </>
            )}

            <button
              onClick={onEditarUsuario}
              className="cardUsuarioContainer__btn"
            >
              Editar
            </button>

            <button
              onClick={onBloquearUsuario}
              className="cardUsuarioContainer__btn cardUsuarioContainer__btn--danger"
            >
              Bloquear
            </button>
          </div>
        </div>
      </div>

      {showModalReporte && (
        <ModalReporteInvitaciones usuario={usuario} onClose={onCloseModal} />
      )}
    </>
  );
};