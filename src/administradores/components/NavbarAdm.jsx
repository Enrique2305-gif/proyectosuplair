import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth";

export const NavbarAdm = () => {

  const {logout} = useContext(AuthContext);

  const nagivate = useNavigate();

  const onClickAlertas = () => {
    nagivate("/notificaciones");
  }

  return (
    <div className="navigation navigation-adm">
      <div className="navigation__icon">
        <Link to={"/administrador"} className="navigation__icon__imgBox">
          <img src="suplaier_horizontal celeste.png" alt="logo_suplaier" className="navigation__icon__imgBox__img" />
        </Link>
      </div>
      <div className="buscadorAdm">
        <p className="paragraph paragraph--mid--1"><b>Panel de control</b></p>
      </div>
      <div className="navigation__leftButtons">
        <div className="navigation__leftButtons__box">
          <div 
            className="navigation__leftButtons__box__ind" 
            onClick={onClickAlertas}
          >
            <span className="material-symbols-rounded icon--bg">
              notifications
            </span>
            <p className="paragraph--sm">Alertas</p>
          </div>
          <div 
            className="navigation__leftButtons__box__ind"
            onClick={() => logout()}
          >
            <span className="material-symbols-rounded icon--bg">
              person
            </span>
            <p className="paragraph--sm">Cuenta</p>
          </div>
        </div>
      </div>
    </div>
  )
}
