import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";

export const Historial = ({ idOferta, setShowHistorial }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const estadosOferta = {
    1: "En curso",
    2: "Por confirmar cierre",
    3: "Verificando pagos",
    9: "Finalizada",
    10: "Cerrada",
    11: "Pendiente",
  };

  const tiposCambio = {
    INSERT: "Creación de oferta",
    UPDATE: "Actualización",
    DELETE: "Eliminación",
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "--";

    return new Date(fecha).toLocaleString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cerrarHistorial = () => {
    setShowHistorial(false);
  };

  useEffect(() => {
    const getHistorial = async () => {
      try {
        setLoading(true);

        const resp = await fetch(
          `${apiUrl}/historialOferta?idOferta=${idOferta}`
        );

        const responseData = await resp.json();
        setData(responseData?.rows || []);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (idOferta) {
      getHistorial();
    }
  }, [idOferta]);

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="historialOferta animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>

        <div className="historialOferta__header">
          <div>
            <p className="paragraph--mid">
              <b>Historial de la oferta</b>
            </p>
            <p className="paragraph--sm">
              Movimientos registrados de esta oferta.
            </p>
          </div>

          <button
            type="button"
            className="historialOferta__close"
            onClick={cerrarHistorial}
          >
            ×
          </button>
        </div>

        <div className="historialOferta__content">
          {loading && (
            <p className="paragraph">Cargando historial...</p>
          )}

          {!loading && data.length === 0 && (
            <p className="paragraph">
              No hay movimientos registrados para esta oferta.
            </p>
          )}

          {!loading &&
            data.map((row) => (
              <div
                key={row.AuditLogId}
                className="historialOferta__card"
              >
                <div className="historialOferta__cardHeader">
                  <span className="historialOferta__badge">
                    {tiposCambio[row.ChangeType] || row.ChangeType}
                  </span>

                  <span className="historialOferta__date">
                    {formatearFecha(row.ChangeTime)}
                  </span>
                </div>

                <div className="historialOferta__infoGrid">
                  <div className="historialOferta__infoItem">
                    <span>Estado de oferta</span>
                    <b>
                      {estadosOferta[row.OldIdEstadosOferta] ||
                        `Estado ${row.OldIdEstadosOferta}`}
                    </b>
                  </div>

                  <div className="historialOferta__infoItem">
                    <span>Cambio de productos</span>
                    <b>
                      {row.ActualProductosChange === null
                        ? "--"
                        : row.ActualProductosChange}
                    </b>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="historialOferta__btnBox">
          <button
            type="button"
            onClick={cerrarHistorial}
            className="btn btn--blue"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};