import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PerfilTooltip from "../../components/generales/PerfilTooltip";
import ProfileCard from "../../components/generales/ProfileCard";
//import { onMessageListener } from "../../firebase";
import { Buscador } from "../../ui";
import { Notificaciones } from "../../components/notificaciones/Notificaciones";
//import { apiUrl } from "../../apiUrl";
import React from "react";
const NavbarComp = () => {
  const nagivate = useNavigate();

  const [showPerfilTooltip, setShowPerfilTooltip] = useState(false);
  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);
  const [showNotification] = useState(false);
  // eslint-disable-next-line
  const [notificacion, setNotificacion] = useState({ title: "", message: "" });

  //console.log(notificacion);

  /* onMessageListener()
     .then((payload) => {
       setShowNotification(true);
       setUsuariosIdNotif(payload.data);
     })
     .catch((error) => console.log(error));
 */
  // TODO: cuando se active Firebase Messaging, aquí se puede volver a conectar
  // onMessageListener() para mostrar la alerta y registrar notificaciones.

  const onClickOfertas = () => {
    nagivate("/historial_ofertas");
  };

  const onClickDemandas = () => {
  nagivate("/mis_demandas");
};

  const onClickAlertas = () => {
    nagivate("/notificaciones");
  };

  const onShowReportarTooltip = () => {
    setShowPerfilTooltip(!showPerfilTooltip);
  };

  const onClickOutside = () => {
    setShowPerfilTooltip(false);
  };

  const openProfileCard = () => {
    setIsProfileCardVisible(true);
    setShowPerfilTooltip(false);
  };

  const closeProfileCard = () => {
    setIsProfileCardVisible(false);
  };

  return (
    <div className="navigation">
      <div className="navigation__icon">
        <Link to={"/comprador"} className="navigation__icon__imgBox">
          <img
            src="suplaier_horizontal celeste.png"
            alt="logo_suplaier"
            className="navigation__icon__imgBox__img"
          />
        </Link>
      </div>
      <div className="navigation__search">
        <Buscador />
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
            {showNotification && <div className="notificacionDot">1</div>}
            <p className="paragraph--sm">Alertas</p>
            <Notificaciones />
            {/* {
        showNotification && <Notificacion title={notificacion.title} body={notificacion.body} />
      } */}
          </div>
          <div
            className="navigation__leftButtons__box__indRespHidden"
            onClick={onClickOfertas}
          >
            <span className="material-symbols-rounded icon--bg">
              import_contacts
            </span>
            <p className="paragraph--sm">Ofertas</p>
          </div>
                    <div
            className="navigation__leftButtons__box__indRespHidden"
            onClick={onClickDemandas}
          >
            <span className="material-symbols-rounded icon--bg">
              shopping_cart
            </span>
            <p className="paragraph--sm">Demandas</p>
          </div>
          <div
            className="navigation__leftButtons__box__ind"
            onClick={onShowReportarTooltip}
          >
            <span className="material-symbols-rounded icon--bg">person</span>
            <p className="paragraph--sm">Cuenta</p>
            {showPerfilTooltip && (
              <PerfilTooltip onClickOutside={onClickOutside} onMiPerfilClick={openProfileCard} />
            )}
          </div>
        </div>
      </div>
      {isProfileCardVisible && (
        <ProfileCard onClose={closeProfileCard} />
      )}
    </div>
  );
};
export default React.memo(NavbarComp);