import { useEffect, useState } from "react";
import { useContext } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  OfertaCard,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components";
export const HistorialOfertasPage = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  // Compra = Compra individual = Orden de compra
  // ---- Aqui se deben poner las ofertas colaborativas
  // ---- a las que se ha unido el comprador (no las ordenes de compra)
  // ---- entonces, se hacen las peticiones => get oferta by compra individual by usuario

  const [ofertasByCompra, setOfertasByCompra] = useState([]);
  const [comprasByUser, setComprasByUser] = useState([]);

  const getComprasByUser = async () => {
    const resp = await fetch(
      `${apiUrl}/compras?idComprador=${user?.IdUsuario}`
    );
    const data = await resp.json();
    const { rows: compras } = !!data && data;
    setComprasByUser(compras);
  };

  const getOfertasByCompra = () => {
    comprasByUser.forEach(async (compra) => {
      const resp = await fetch(`${apiUrl}/ofertas?id=${compra?.IdOferta}`);
      const data = await resp.json();
      const { rows: oferta } = !!data && data;
      setOfertasByCompra((ofertas) => {
        return [oferta[0], ...ofertas];
      });
    });
  };

  useEffect(() => {
    getComprasByUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setOfertasByCompra([]);
    !!comprasByUser && getOfertasByCompra();
    // eslint-disable-next-line
  }, [comprasByUser]);

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
              <b>Historial de ofertas colaborativas</b>
            </p>
          </div>
          {ofertasByCompra?.map((oferta) => (
            <OfertaCard key={oferta?.IdOferta} oferta={oferta} />
          ))}
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
};
