import { useNavigate } from "react-router-dom";

export const AccionExitosa = ({
  texto,
  showAccionErronea,
  setShowAccionExitosa,
  setShowAccionErronea,
}) => {
  const navigate = useNavigate();

  const modalClass = showAccionErronea ? "accionError" : "accionExitosa";
  const iconName = showAccionErronea ? "cancel" : "check_circle";

  const onClickContinuar = () => {
    setShowAccionExitosa(false);

    if (setShowAccionErronea) {
      setShowAccionErronea(false);
    }

    navigate("/comprador");
  };

  return (
    <div className={`${modalClass} animate__animated animate__fadeIn`}>
      <div className={`${modalClass}__ventana animate__animated animate__slideInDown`}>
        <div className="metodoPago__barraSup"></div>

        <div className={`${modalClass}__textoBox`}>
          <span className={`material-symbols-rounded ${modalClass}__textoBox__icon`}>
            {iconName}
          </span>

          <p
            className={`paragraph paragraph--bold ${modalClass}__textoBox__texto`}
            align="center"
          >
            {texto}
          </p>
        </div>

        <div className="metodoPago__btnBox">
          <button
            type="button"
            onClick={onClickContinuar}
            className="btn btn--blue"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};