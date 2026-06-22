import React, { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  OfertaCard,
  EmptyState,
  SkeletonCard,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components/ProdDemandaButtonBox";

export const MainCompPage = React.memo(() => {
  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOfertasTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${apiUrl}/ofertas`);
      if (!resp.ok) throw new Error("No se pudieron cargar las ofertas");
      const data = await resp.json();
      const ofertas = data?.rows || [];
      setOfertasTodos(ofertas.filter((oferta) => oferta.IdEstadosOferta === 1));
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las ofertas. Revisa que la API esté activa.");
      setOfertasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasTodos();
  }, []);

  const showEmptyArray = !loading && !error && ofertasTodos.length === 0;

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
              <b>Ofertas en curso</b>
            </p>
          </div>
          <hr className="hrGeneral" />

          {loading && (
            <div className="comp-main-container__medCont__ofertas-list">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {error && (
            <EmptyState
              icon="wifi_off"
              title="No se pudo conectar con la API"
              message={error}
              action={<button className="btn btn--blue" onClick={getOfertasTodos}>Reintentar</button>}
            />
          )}

          {showEmptyArray && (
            <EmptyState
              icon="storefront"
              title="No hay ofertas disponibles"
              message="Cuando un proveedor publique una oferta activa, aparecerá en esta sección."
            />
          )}

          {!loading && !error && ofertasTodos.length > 0 && (
            <div className="comp-main-container__medCont__ofertas-list">
              {ofertasTodos.map((oferta) => (
                <OfertaCard key={oferta.IdOferta} oferta={oferta} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
});
