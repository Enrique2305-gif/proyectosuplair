import React from "react";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components";
import {CargarPropuestas} from '../../components/cont_propuesta/CargarPropuestas'
import { useLocation } from "react-router-dom";
export const PropuestasRecibidas = React.memo(() => {
  const location = useLocation();
  const IdDemanda = location.state?.IdDemanda;
  const Producto = location.state?.Producto
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
              <b>Propuestas recibidas para el producto {Producto}</b>
            </p>
          </div>
          <hr className="hrGeneral" />
          <div className="u-margin-top-small"></div>
            <CargarPropuestas IdDemanda={IdDemanda}/>
            
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
});