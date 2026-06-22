import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  ContActividades,
  OfertaCard,
  ContExplorar,
  ContFavoritos,
  EmptyState,
  SkeletonCard,
} from "../../components";
import { AuthContext } from "../../auth";
import { apiUrl } from "../../apiUrl";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { obtainUserPermission } from "../../firebase";

export const MainProvPage = React.memo(() => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [ofertasProv, setOfertasProv] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSeleccion = (event) => {
    setOpcionSeleccionada(event.target.value);
  };

  const fetchOfertas = useCallback(async (endpoint) => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(endpoint);
      if (!resp.ok) throw new Error("No se pudieron cargar tus ofertas");
      const data = await resp.json();
      setOfertasProv(data?.rows || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus ofertas. Revisa que la API esté activa.");
      setOfertasProv([]);
    } finally {
      setLoading(false);
    }
  }, [user?.IdUsuario]);

  const seleccionFilter = useCallback((opcion) => {
    const idProveedor = user?.IdUsuario;
    if (!idProveedor) return;

    switch (opcion) {
      case "opcionFechaM":
        fetchOfertas(`${apiUrl}/ofertas/orderFechaMayor?idProveedor=${idProveedor}`);
        break;
      case "opcionFecham":
        fetchOfertas(`${apiUrl}/ofertas/orderFechaMenor?idProveedor=${idProveedor}`);
        break;
      case "opcionSoloCurso":
        fetchOfertas(`${apiUrl}/ofertas?idProveedor=${idProveedor}&idEstadosOferta=1`);
        break;
      default:
        fetchOfertas(`${apiUrl}/ofertas?idProveedor=${idProveedor}`);
        break;
    }
  }, [fetchOfertas, user?.IdUsuario]);

  useEffect(() => {
    seleccionFilter(opcionSeleccionada);
  }, [opcionSeleccionada, seleccionFilter]);

  useEffect(() => {
    obtainUserPermission();
  }, []);

  const showEmptyArray = !loading && !error && ofertasProv.length === 0;

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
          <div className="explorarCat__titleCardOferta">
            <div className="explorarCat__titleCardOferta__tituloBox">
              <span className="material-symbols-rounded icon-grey icon--sm">
                arrow_forward_ios
              </span>
              <p className="paragraph--mid">
                <b>Mis ofertas</b>
              </p>
            </div>
            <div></div>
            <div className="explorarCat__titleCardOferta__filtrarBox">
              <span className="material-symbols-rounded icon-grey icon--bg">
                filter_list
              </span>
              <select
                value={opcionSeleccionada}
                onChange={handleSeleccion}
                className="formSubirProducto__inputBox__selectFilter"
              >
                <option value="todos">Todas</option>
                <option value="opcionFechaM">Fecha de cierre - Mayor a menor</option>
                <option value="opcionFecham">Fecha de cierre - Menor a mayor</option>
                <option value="opcionSoloCurso">Solo en curso</option>
              </select>
            </div>
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
              action={<button className="btn btn--blue" onClick={() => seleccionFilter(opcionSeleccionada)}>Reintentar</button>}
            />
          )}

          {showEmptyArray && (
            <EmptyState
              icon="inventory_2"
              title="Aún no tienes ofertas creadas"
              message="Publica productos y crea ofertas para que los compradores puedan encontrarte."
            />
          )}

          {!loading && !error && ofertasProv.length > 0 && (
            <div className="comp-main-container__medCont__ofertas-list">
              {ofertasProv.map((oferta) => (
                <OfertaCard key={oferta?.IdOferta} oferta={oferta} esProveedor={true} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades esProveedor={true} />
      </div>
    </div>
  );
});
