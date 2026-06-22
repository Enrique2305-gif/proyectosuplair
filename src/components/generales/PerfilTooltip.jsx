import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth";
import { getHomeByUser } from "../../auth/helpers";
import React from "react";

const PerfilTooltip = ({ onClickOutside, onMiPerfilClick }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const { authState, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  const onClickPanelPrincipal = () => {
    navigate(getHomeByUser(authState?.user));
    onClickOutside && onClickOutside();
  };

  const onClickCerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div ref={ref} className="perfiltooltip">
      <div
        onClick={onClickPanelPrincipal}
        className="perfiltooltip__option"
        style={{ cursor: "pointer" }}
      >
        <span className="material-symbols-rounded">dashboard</span>
        <p className="paragraph--sm">Panel principal</p>
      </div>

      <hr className="hrGeneral" />

      <div
        onClick={onMiPerfilClick}
        className="perfiltooltip__option"
        style={{ cursor: "pointer" }}
      >
        <span className="material-symbols-rounded">account_circle</span>
        <p className="paragraph--sm">Mi perfil</p>
      </div>

      <hr className="hrGeneral" />

      <div
        className="perfiltooltip__option"
        onClick={onClickCerrarSesion}
        style={{ cursor: "pointer" }}
      >
        <span className="material-symbols-rounded">logout</span>
        <p className="paragraph--sm">Cerrar sesión</p>
      </div>
    </div>
  );
};

export default React.memo(PerfilTooltip);