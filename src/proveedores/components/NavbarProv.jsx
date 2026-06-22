import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PerfilTooltip from "../../components/generales/PerfilTooltip";
import ProfileCard from "../../components/generales/ProfileCard";
import { Buscador } from "../../ui";
import React from "react";

const NavbarProv = () => {
  const [showPerfilTooltip, setShowPerfilTooltip] = useState(false);
  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);

  const navigate = useNavigate();

  const onClickAlertas = () => {
    navigate("/notificaciones");
  };

  const onClickDemandas = () => {
    navigate("/demandas");
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
    <div className="navigation navigation-prov">
      <div className="navigation__icon">
        <Link to={"/proveedor"} className="navigation__icon__imgBox">
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
            <p className="paragraph--sm">Alertas</p>
          </div>

          <Link
              to="/demandas"
              className="navigation__leftButtons__box__indRespHidden"
            >
              <span className="material-symbols-rounded icon--bg">
                shopping_cart
              </span>
              <p className="paragraph--sm">Demandas</p>
            </Link>

          <div
            className="navigation__leftButtons__box__ind"
            onClick={onShowReportarTooltip}
          >
            <span className="material-symbols-rounded icon--bg">person</span>
            <p className="paragraph--sm">Cuenta</p>

            {showPerfilTooltip && (
              <PerfilTooltip
                onClickOutside={onClickOutside}
                onMiPerfilClick={openProfileCard}
              />
            )}
          </div>
        </div>
      </div>

      {isProfileCardVisible && <ProfileCard onClose={closeProfileCard} />}
    </div>
  );
};

export default React.memo(NavbarProv);