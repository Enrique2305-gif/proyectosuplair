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

export const OfeCanPage = () => {
  const ESTADOS_CANCELADOS = [7, 8];

  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const getOfertasCanceladas = async () => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);
      setError("");

      // 1. Traer compras/uniones del comprador logueado
      const respCompras = await fetch(
        `${apiUrl}/compras?idComprador=${user.IdUsuario}`
      );

      const dataCompras = await respCompras.json();
      const compras = dataCompras?.rows || [];

      // 2. Sacar solo las ofertas donde este comprador participó
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

      // 3. Buscar esas ofertas
      const ofertasResp = await Promise.all(
        idsOfertas.map(async (idOferta) => {
          const respOferta = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
          const dataOferta = await respOferta.json();

          return dataOferta?.rows?.[0];
        })
      );

      // 4. Mostrar solo las ofertas canceladas
      const ofertasCanceladas = ofertasResp
        .filter(Boolean)
        .filter((oferta) =>
          ESTADOS_CANCELADOS.includes(Number(oferta.IdEstadosOferta))
        );

      setOfertasTodos(ofertasCanceladas);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las ofertas canceladas.");
      setOfertasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasCanceladas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.IdUsuario]);

  const showEmptyArray = !loading && !error && ofertasTodos?.length === 0;

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
              <b>Ofertas Canceladas</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">Cargando ofertas canceladas...</p>
          )}

          {error && (
            <p className="paragraph paragraph--red">{error}</p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no hay ofertas canceladas.
            </p>
          )}

          {!loading &&
            !error &&
            ofertasTodos?.map((oferta) => (
              <OfertaCard
                key={oferta.IdOferta}
                oferta={oferta}
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