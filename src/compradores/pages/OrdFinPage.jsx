import { useContext, useEffect, useState } from "react";
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

export const OrdFinPage = () => {
  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const getOfertasFinalizadas = async () => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);

      // 1. Buscar compras finalizadas del comprador
      const respCompras = await fetch(
        `${apiUrl}/compras?idComprador=${user.IdUsuario}&idEstado=9`
      );

      const dataCompras = await respCompras.json();
      const compras = dataCompras?.rows || [];

      // 2. Obtener los IdOferta de esas compras
      const idsOfertas = [
        ...new Set(
          compras
            .map((compra) => compra.IdOferta)
            .filter((idOferta) => idOferta !== null && idOferta !== undefined)
        ),
      ];

      if (idsOfertas.length === 0) {
        setOfertasTodos([]);
        return;
      }

      // 3. Buscar cada oferta
      const ofertasResp = await Promise.all(
        idsOfertas.map(async (idOferta) => {
          const respOferta = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
          const dataOferta = await respOferta.json();
          return dataOferta?.rows?.[0];
        })
      );

      setOfertasTodos(ofertasResp.filter(Boolean));
    } catch (error) {
      console.error(error);
      setOfertasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasFinalizadas();
    // eslint-disable-next-line
  }, [user?.IdUsuario]);

  const showEmptyArray = !loading && ofertasTodos?.length === 0;

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
              <b>Ofertas Finalizadas</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">Cargando ofertas finalizadas...</p>
          )}

          {showEmptyArray ? (
            <p className="paragraph">
              Por el momento no hay ofertas culminadas.
            </p>
          ) : (
            ofertasTodos?.map((oferta) => (
              <OfertaCard
                key={oferta.IdOferta}
                oferta={oferta}
              />
            ))
          )}
        </div>
      </div>

      <div className="comp-main-container__divSepDer"></div>

      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
};