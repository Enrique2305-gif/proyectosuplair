import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  OrdenCard,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components";

export const OrdCompPage = () => {
  const [comprasPorConf, setComprasPorConf] = useState([]);

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const getComprasPorConf = async () => {
    if (!user?.IdUsuario) return;

    const resp = await fetch(`${apiUrl}/compras?idComprador=${user.IdUsuario}`);
    const data = await resp.json();
    const compras = data?.rows || [];

    setComprasPorConf(compras);
  };

  useEffect(() => {
    getComprasPorConf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.IdUsuario]);

  const showEmptyArray = comprasPorConf?.length === 0;

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
              <b>Tus órdenes de compra</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no tienes órdenes de compra.
            </p>
          )}

          {comprasPorConf?.map((compra) => (
            <OrdenCard key={compra.IdCompra} compra={compra} />
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