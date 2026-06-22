import React, { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  EmptyState,
  SkeletonCard,
} from "../../components";
import { DemandaCard } from "../components/DemandaCard";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { obtainUserPermission } from "../../firebase";

export const ListDemandas = React.memo(() => {
  const [demandasTodos, setDemandasTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDemandasTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${apiUrl}/demandas`);
      if (!resp.ok) throw new Error("No se pudieron cargar las demandas");
      const data = await resp.json();
      const demandas = data?.rows || [];
      setDemandasTodos(demandas.filter((demanda) => demanda.IdEstadosOferta === 1));
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las demandas. Revisa que la API esté activa.");
      setDemandasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDemandasTodos();
    obtainUserPermission();
  }, []);

  const showEmptyArray = !loading && !error && demandasTodos.length === 0;

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />
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
              <b>Demandas en curso</b>
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
              action={<button className="btn btn--blue" onClick={getDemandasTodos}>Reintentar</button>}
            />
          )}

          {showEmptyArray && (
            <EmptyState
              icon="request_quote"
              title="Aún no hay demandas activas"
              message="Cuando un comprador publique una demanda en curso, podrás revisarla y enviar una propuesta."
            />
          )}

          {!loading && !error && demandasTodos.length > 0 && (
            <div className="comp-main-container__medCont__ofertas-list">
              {demandasTodos.map((demanda) => (
                <DemandaCard key={demanda?.IdDemanda} demanda={demanda} />
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
