import { useNavigate } from "react-router-dom";

export const AccionExitosa = ({ texto, setShowAccionExitosa }) => {
  const navigate = useNavigate();

  const onClickContinuar = () => {
    setShowAccionExitosa(false);
    navigate("/proveedor");
  };

  return (
    <div className="accionExitosa animate__animated animate__fadeIn">
      <div className="accionExitosa__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>

        <div className="accionExitosa__textoBox">
          <span className="material-symbols-rounded accionExitosa__textoBox__icon">
            check_circle
          </span>

          <p
            className="paragraph paragraph--bold accionExitosa__textoBox__texto"
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