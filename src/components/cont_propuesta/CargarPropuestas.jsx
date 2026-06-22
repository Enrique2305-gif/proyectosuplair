import React, { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { PropuestaCard } from "./PropuestaCard";
import { useNavigate } from "react-router-dom";
import { AccionExitosa } from "../../compradores/components/AccionExitosa";

export const CargarPropuestas = ({ IdDemanda }) => {
  const navigate = useNavigate();

  const [showExitosa, setShowExitosa] = useState(false);
  const [showErronea, setShowErronea] = useState(false);
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const cargarPropuestas = async () => {
    if (!IdDemanda) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/propuestas?idDemanda=${IdDemanda}&estado=pendiente`
      );

      const data = await response.json();
      const rows = Array.isArray(data?.rows) ? data.rows : [];

      const propuestasFiltradas = rows.filter(
        (propuesta) => Number(propuesta.IdDemanda) === Number(IdDemanda)
      );

      setPropuestas(propuestasFiltradas);
    } catch (error) {
      console.error("Error cargando propuestas:", error);
      setPropuestas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPropuestas();
  }, [IdDemanda]);

  const actualizarEstadoPropuesta = async (idPropuesta, nuevoEstado) => {
    try {
      setLoadingAction(true);

      const response = await fetch(
        `${apiUrl}/propuestas/${idPropuesta}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Estado: nuevoEstado }),
        }
      );

      const data = await response.json();
      console.log("Respuesta al actualizar propuesta:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Error al actualizar propuesta");
      }

      setShowExitosa(true);

      setPropuestas((prevPropuestas) =>
        prevPropuestas.filter(
          (propuesta) => Number(propuesta.IdPropuesta) !== Number(idPropuesta)
        )
      );

      window.dispatchEvent(new Event("notificaciones-actualizadas"));

      if (nuevoEstado === "aprobada") {
        setTimeout(() => {
          navigate("/demandas_aprobadas");
        }, 1200);
      }
    } catch (error) {
      console.error("Error al actualizar la propuesta:", error);
      setShowErronea(true);
      setShowExitosa(true);
    } finally {
      setLoadingAction(false);
    }
  };

  const showEmptyArray = !loading && propuestas.length === 0;

  return (
    <div>
      {loading && (
        <p className="paragraph">Cargando propuestas recibidas...</p>
      )}

      {showEmptyArray && (
        <p className="paragraph">
          Aún no has recibido ninguna propuesta por este producto
        </p>
      )}

      {!loading &&
        propuestas.map((propuesta) => (
          <PropuestaCard
            key={propuesta.IdPropuesta}
            propuesta={propuesta}
            disabled={loadingAction}
            onActualizarEstado={(idPropuesta, nuevoEstado) => {
              actualizarEstadoPropuesta(idPropuesta, nuevoEstado);
            }}
            showExitosa={showExitosa}
            showErronea={showErronea}
            setShowExitosa={setShowExitosa}
            setShowErronea={setShowErronea}
          />
        ))}

      {showExitosa && (
        <AccionExitosa
          texto={
            showErronea
              ? "No se pudo actualizar la propuesta"
              : "La propuesta fue actualizada correctamente"
          }
          showAccionErronea={showErronea}
          setShowAccionExitosa={setShowExitosa}
          setShowAccionErronea={setShowErronea}
        />
      )}
    </div>
  );
};


