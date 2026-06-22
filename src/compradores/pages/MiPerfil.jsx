import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../auth";
import { ContActividades, ContExplorar, ContFavoritos } from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components";
export const MiPerfil = React.memo(() => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />
        <ProdDemandaButtonBox />
        <ContExplorar />
        <ContFavoritos />
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid">
              <b>Mi perfil: {user?.Nombre}</b>
            </p>
          </div>
          <hr className="hrGeneral" />

          <div className="u-margin-top-small"></div>

          <div className="perfil">
            <div className="perfil__twoColumn">
              <div className="perfil__twoColumn__left">
                <div className="perfil__imgBox u-margin-top-small">
                  <img
                    src="user_icon.png"
                    alt="user_icon"
                    className="perfil__imgBox__img"
                  />
                </div>
              </div>
              <div className="perfil__twoColumn__right">
                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">País: {user?.Pais}</p>
                </div>

                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">Ciudad: {user?.Ciudad}</p>
                </div>

                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">Celular: {user?.Numero}</p>
                </div>

                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">Usuario: comprador</p>
                </div>
                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">Dirección: {user?.Direccion}</p>
                </div>

                <div className="perfil__dataBox u-margin-top-small">
                  <p className="paragraph">E-mail: {user?.Email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
});
