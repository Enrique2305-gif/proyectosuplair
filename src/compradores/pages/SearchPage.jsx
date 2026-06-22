import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { ProdDemandaButtonBox } from "../components";

export const SearchPage = () => {
  const location = useLocation();
  const { q = "" } = queryString.parse(location.search);
  const query = String(q || "").trim();
  const [ofertasBusqueda, setOfertasBusqueda] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOfertasTodos = async () => {
    if (!query) {
      setOfertasBusqueda([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${apiUrl}/ofertaByProducto?q=${encodeURIComponent(query)}`);
      if (!resp.ok) throw new Error("Error al buscar ofertas");
      const data = await resp.json();
      const ofertas = data?.rows || [];
      setOfertasBusqueda(ofertas.filter((oferta) => oferta.IdEstadosOferta === 1));
    } catch (err) {
      console.error(err);
      setError("No se pudo realizar la búsqueda. Revisa que la API esté activa.");
      setOfertasBusqueda([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const showError = query.length > 0 && !loading && !error && ofertasBusqueda.length === 0;

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
              <b>Resultado de búsqueda: {query || "sin término"}</b>
            </p>
          </div>
          <hr className="hrGeneral" />
          <div className="u-margin-top-small"></div>

          {loading && <SkeletonCard />}

          {error && (
            <EmptyState
              icon="wifi_off"
              title="No se pudo conectar con la API"
              message={error}
              action={<button className="btn btn--blue" onClick={getOfertasTodos}>Reintentar</button>}
            />
          )}

          {ofertasBusqueda.length > 0 && (
            <div className="comp-main-container__medCont__ofertas-list">
              {ofertasBusqueda.map((oferta) => (
                <OfertaCard key={oferta.IdOferta} oferta={oferta} />
              ))}
            </div>
          )}

          {showError && (
            <EmptyState
              icon="search_off"
              title="No se encontraron ofertas"
              message="Prueba con una palabra más general o revisa la categoría del producto."
            />
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
