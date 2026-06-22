import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";

export const ModalReporteInvitaciones = ({ usuario, onClose }) => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching reporte para usuario:', usuario.IdUsuario);
        console.log('URL:', `${apiUrl}/recompensas/reporte-invitaciones/${usuario.IdUsuario}`);
        
        const resp = await fetch(`${apiUrl}/recompensas/reporte-invitaciones/${usuario.IdUsuario}`);
        console.log('Response status:', resp.status);
        
        const data = await resp.json();
        console.log('Response data:', data);
        
        if (data.ok) {
          setReporte(data);
        } else {
          setError(data.message || "Error al cargar el reporte");
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(`Error al conectar con el servidor: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, [usuario.IdUsuario]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className="modalReporteInvitaciones">
        <div className="modalReporteInvitaciones__header">
          <h2>Reporte de Invitaciones</h2>
          <button className="modalReporteInvitaciones__closeBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading && (
          <div className="modalReporteInvitaciones__loading">
            <p>Cargando reporte...</p>
          </div>
        )}

        {error && (
          <div className="modalReporteInvitaciones__error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && reporte && (
          <div className="modalReporteInvitaciones__content">
            <div className="modalReporteInvitaciones__info">
              <div className="modalReporteInvitaciones__infoItem">
                <p className="paragraph"><strong>Comprador:</strong></p>
                <p className="paragraph">{reporte.comprador.nombre}</p>
              </div>
              <div className="modalReporteInvitaciones__infoItem">
                <p className="paragraph"><strong>Código de Invitación:</strong></p>
                <p className="paragraph modalReporteInvitaciones__codigo">
                  {reporte.comprador.codigoInvitacion || "No disponible"}
                </p>
              </div>
              <div className="modalReporteInvitaciones__infoItem">
                <p className="paragraph"><strong>Total de Invitados:</strong></p>
                <p className="paragraph">{reporte.totalInvitados}</p>
              </div>
            </div>

            <hr className="hrGeneral" />

            <div className="modalReporteInvitaciones__invitados">
              <h3>Usuarios Invitados</h3>
              {reporte.invitados.length === 0 ? (
                <p className="paragraph">No hay usuarios invitados por este comprador.</p>
              ) : (
                <div className="modalReporteInvitaciones__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Identificación</th>
                        <th>País</th>
                        <th>Ciudad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporte.invitados.map((invitado) => (
                        <tr key={invitado.IdUsuario}>
                          <td>{invitado.Nombre}</td>
                          <td>{invitado.Email}</td>
                          <td>{invitado.Identificacion || "N/A"}</td>
                          <td>{invitado.Pais || "N/A"}</td>
                          <td>{invitado.Ciudad || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
