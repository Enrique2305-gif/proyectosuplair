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

export const OrdConfPage = () => {
  const [comprasPorConf, setComprasPorConf] = useState([]);
  const [comprasPorConf2, setComprasPorConf2] = useState([]);
  const [loading, setLoading] = useState(false);

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const getComprasPorConf = async () => {
    if (!user?.IdUsuario) return;

    const resp = await fetch(
      `${apiUrl}/compras?idComprador=${user.IdUsuario}&idEstado=5`
    );

    const data = await resp.json();
    const compras = data?.rows || [];

    setComprasPorConf(compras);
  };

  const getComprasPorConf2 = async () => {
    if (!user?.IdUsuario) return;

    const resp = await fetch(
      `${apiUrl}/compras?idComprador=${user.IdUsuario}&idEstado=8`
    );

    const data = await resp.json();
    const compras = data?.rows || [];

    setComprasPorConf2(compras);
  };

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      await Promise.all([
        getComprasPorConf(),
        getComprasPorConf2(),
      ]);
    } catch (error) {
      console.error(error);
      setComprasPorConf([]);
      setComprasPorConf2([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.IdUsuario]);

  const showEmptyArray =
    !loading &&
    comprasPorConf?.length === 0 &&
    comprasPorConf2?.length === 0;

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
              <b>Órdenes de compra por confirmar</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">
              Cargando órdenes de compra por confirmar...
            </p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no hay órdenes de compra por confirmar.
            </p>
          )}

          {!loading &&
            comprasPorConf?.map((compra) => (
              <OrdenCard
                key={compra.IdCompra}
                compra={compra}
              />
            ))}

          {!loading &&
            comprasPorConf2?.map((compra) => (
              <OrdenCard
                key={compra.IdCompra}
                compra={compra}
              />
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