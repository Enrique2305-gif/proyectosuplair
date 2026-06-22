import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { AuthContext } from "../../auth";
import { apiUrl } from "../../apiUrl";

const getRows = (data) => {
  if (Array.isArray(data)) return data;
  return data?.rows || [];
};

const isOfertaActiva = (oferta) => {
  const estado = String(
    oferta?.Estado ||
      oferta?.NombreEstado ||
      oferta?.EstadoOferta ||
      ""
  ).toLowerCase();

  return (
    oferta?.IdEstadosOferta === 1 ||
    oferta?.IdEstadoOferta === 1 ||
    estado.includes("curso") ||
    estado.includes("activa")
  );
};

const isOrdenPendiente = (orden) => {
  const estado = String(
    orden?.Estado ||
      orden?.NombreEstado ||
      orden?.EstadoCompra ||
      ""
  ).toLowerCase();

  return (
    orden?.IdEstadoCompra === 1 ||
    orden?.IdEstado === 1 ||
    estado.includes("pendiente") ||
    estado.includes("confirmar")
  );
};

const esDelMesActual = (item) => {
  const fecha =
    item?.FechaCompra ||
    item?.FechaCreacion ||
    item?.FechaPago ||
    item?.createdAt;

  if (!fecha) return false;

  const fechaItem = new Date(fecha);
  const hoy = new Date();

  return (
    fechaItem.getMonth() === hoy.getMonth() &&
    fechaItem.getFullYear() === hoy.getFullYear()
  );
};

export const PanelPrincipalProv = React.memo(() => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const [stats, setStats] = useState({
    ofertasActivas: 0,
    ventasMes: 0,
    ordenesPendientes: 0,
    demandasNuevas: 0,
  });

  const fetchPanelData = useCallback(async () => {
    if (!user?.IdUsuario) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setApiError(false);

      const idProveedor = user.IdUsuario;

      const resultados = await Promise.allSettled([
        fetch(`${apiUrl}/ofertas?idProveedor=${idProveedor}`).then((resp) =>
          resp.ok ? resp.json() : Promise.reject(resp)
        ),

        fetch(`${apiUrl}/demandas`).then((resp) =>
          resp.ok ? resp.json() : Promise.reject(resp)
        ),

        fetch(`${apiUrl}/compras?idProveedor=${idProveedor}`).then((resp) =>
            resp.ok ? resp.json() : Promise.reject(resp)
        ),
      ]);

      const ofertas =
        resultados[0].status === "fulfilled"
          ? getRows(resultados[0].value)
          : [];

      const demandas =
        resultados[1].status === "fulfilled"
          ? getRows(resultados[1].value)
          : [];

      const compras =
        resultados[2].status === "fulfilled"
          ? getRows(resultados[2].value)
          : [];

      const ofertasActivas = ofertas.filter(isOfertaActiva).length;

      const ventasMes = compras
        .filter(esDelMesActual)
        .reduce((total, compra) => {
          return (
            total +
            Number(
              compra?.Total ||
                compra?.TotalPagado ||
                compra?.MontoTotal ||
                compra?.PrecioTotal ||
                0
            )
          );
        }, 0);

      const ordenesPendientes = compras.filter(isOrdenPendiente).length;

      setStats({
        ofertasActivas,
        ventasMes,
        ordenesPendientes,
        demandasNuevas: demandas.length,
      });

      const huboError = resultados.some(
        (resultado) => resultado.status === "rejected"
      );

      setApiError(huboError);
    } catch (error) {
      console.error(error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, [user?.IdUsuario]);

  useEffect(() => {
    fetchPanelData();
  }, [fetchPanelData]);

  const nombreProveedor = user?.Nombre || "Proveedor";

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />
        <ContExplorar />
        <ContFavoritos />
      </div>

      <div className="comp-main-container__divSepIzq"></div>

      <div className="comp-main-container__medCont">
        <div className="panelProv">
          <div className="panelProv__header">
            <div>
              <p className="panelProv__subtitle">Panel principal</p>
              <h1 className="panelProv__title">
                Buenas tardes, {nombreProveedor}
              </h1>
              <p className="panelProv__description">
                Consulta tus ofertas, ventas, órdenes pendientes y demandas de
                compradores desde un solo lugar.
              </p>
            </div>

            <button
              type="button"
              className="btn btn--blue"
              onClick={() => navigate("/crear_nueva_oferta")}
            >
              Nueva Oferta
            </button>
          </div>

          {apiError && (
            <div className="panelProv__warning">
              Algunos datos no se pudieron cargar. Revisa que la API esté
              activa.
            </div>
          )}

          {loading ? (
            <div className="dashboardLoading">
              <p>Cargando información del proveedor...</p>
            </div>
          ) : (
            <>
              <div className="panelProv__stats">
                <div className="panelProv__card">
                  <span className="material-symbols-rounded panelProv__cardIcon">
                    local_offer
                  </span>
                  <p className="panelProv__cardValue">
                    {stats.ofertasActivas}
                  </p>
                  <p className="panelProv__cardLabel">Ofertas activas</p>
                </div>

                <div className="panelProv__card">
                  <span className="material-symbols-rounded panelProv__cardIcon">
                    payments
                  </span>
                  <p className="panelProv__cardValue">
                    ${stats.ventasMes.toFixed(2)}
                  </p>
                  <p className="panelProv__cardLabel">Ventas del mes</p>
                </div>

                <div className="panelProv__card">
                  <span className="material-symbols-rounded panelProv__cardIcon">
                    pending_actions
                  </span>
                  <p className="panelProv__cardValue">
                    {stats.ordenesPendientes}
                  </p>
                  <p className="panelProv__cardLabel">Órdenes pendientes</p>
                </div>

                <div className="panelProv__card">
                  <span className="material-symbols-rounded panelProv__cardIcon">
                    campaign
                  </span>
                  <p className="panelProv__cardValue">
                    {stats.demandasNuevas}
                  </p>
                  <p className="panelProv__cardLabel">Demandas disponibles</p>
                </div>
              </div>

              <div className="panelProv__quickActions">
                <h2>Acciones rápidas</h2>

                <div className="panelProv__actionsGrid">
                  <button
                    type="button"
                    className="panelProv__action"
                    onClick={() => navigate("/crear_nueva_oferta")}
                  >
                    <span className="material-symbols-rounded">add_box</span>
                    <div>
                      <b>Crear oferta</b>
                      <p>Publica una nueva oferta para compradores.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="panelProv__action"
                    onClick={() => navigate("/mis_ofertas")}
                  >
                    <span className="material-symbols-rounded">inventory_2</span>
                    <div>
                      <b>Ver mis ofertas</b>
                      <p>Consulta y administra tus ofertas creadas.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="panelProv__action"
                    onClick={() => navigate("/demandas")}
                  >
                    <span className="material-symbols-rounded">search</span>
                    <div>
                      <b>Explorar demandas</b>
                      <p>Revisa lo que los compradores necesitan.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="panelProv__action"
                    onClick={() => navigate("/subir_producto")}
                  >
                    <span className="material-symbols-rounded">upload</span>
                    <div>
                      <b>Subir producto</b>
                      <p>Registra productos para crear ofertas.</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
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