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

export const OfePenPage = () => {
  const ESTADOS_PENDIENTES = [2, 3, 11];

  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const getOfertasPendientes = async () => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);
      setError("");

      // 1. Traer las compras/uniones del comprador logueado
      const respCompras = await fetch(
        `${apiUrl}/compras?idComprador=${user.IdUsuario}`
      );

      const dataCompras = await respCompras.json();
      const compras = dataCompras?.rows || [];

      // 2. Sacar solo los IdOferta donde participó el comprador
      const comprasPendientes = compras.filter(
        (compra) => Number(compra.IdEstado) !== 9
      );

      // 3. Sacar solo los IdOferta de compras pendientes
      const idsOfertas = [
        ...new Set(
          comprasPendientes
            .map((compra) => compra.IdOferta)
            .filter((idOferta) => idOferta !== null && idOferta !== undefined)
        ),
      ];


      if (idsOfertas.length === 0) {
        setOfertasTodos([]);
        return;
      }

      // 3. Buscar cada oferta por su ID
      const ofertasResp = await Promise.all(
        idsOfertas.map(async (idOferta) => {
          const respOferta = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
          const dataOferta = await respOferta.json();

          return dataOferta?.rows?.[0];
        })
      );

      // 4. Mostrar solo las ofertas pendientes del comprador
      const ofertasPendientes = ofertasResp
        .filter(Boolean)
        .filter((oferta) =>
          ESTADOS_PENDIENTES.includes(Number(oferta.IdEstadosOferta))
        );

      
      setOfertasTodos(ofertasPendientes);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las ofertas pendientes.");
      setOfertasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasPendientes();
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
              <b>Ofertas Pendientes</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">
              Cargando ofertas pendientes...
            </p>
          )}

          {error && (
            <p className="paragraph paragraph--red">
              {error}
            </p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no tienes ofertas pendientes.
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