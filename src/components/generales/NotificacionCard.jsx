import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import React from "react";

const getIconByTipo = (idTipoNotificacion) => {
  const id = Number(idTipoNotificacion);

  switch (id) {
    case 1:
      return "notifications";
    case 2:
      return "shopping_cart";
    case 3:
      return "local_offer";
    case 4:
      return "campaign";
    default:
      return "notifications";
  }
};

export const NotificacionCard = ({
  notificacion,
  esProveedor = false,
  onNotificacionLeida,
}) => {
  const navigate = useNavigate();

  const idNotificacion =
    notificacion?.IdNotificacion ?? notificacion?.idNotificacion;

  const idOferta = notificacion?.IdOferta ?? notificacion?.idOferta;

  const descripcion =
    notificacion?.Descripcion ??
    notificacion?.descripcion ??
    "Nueva notificación recibida";

  const idTipoNotificacion =
    notificacion?.IdTipoNotificacion ?? notificacion?.idTipoNotificacion;

  const fecha = notificacion?.FechaCrea ?? notificacion?.fechaCrea;

  const leida = Number(notificacion?.Leida ?? 0) === 1;

  const marcarComoLeida = async () => {
    if (!idNotificacion || leida) return;

    try {
      await fetch(`${apiUrl}/notificaciones/${idNotificacion}/leida`, {
        method: "PUT",
      });

      if (onNotificacionLeida) {
        onNotificacionLeida(idNotificacion);
      }

      window.dispatchEvent(new Event("notificaciones-actualizadas"));
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  const onClickNotificacion = async () => {
    await marcarComoLeida();

    if (!idOferta) return;

    if (esProveedor) {
      navigate(`/mi_oferta/${idOferta}`);
      return;
    }

    navigate(`/oferta/${idOferta}`);
  };

  return (
    <div
      className={`notificacionCard ${
        leida ? "notificacionCard--leida" : "notificacionCard--nueva"
      }`}
      onClick={onClickNotificacion}
    >
      <span className="material-symbols-rounded icon--md--2 notificacionCard__icon">
        {getIconByTipo(idTipoNotificacion)}
      </span>

      <div>
        <p className="paragraph--mid--2">{descripcion}</p>

        {fecha && (
          <p className="paragraph--sm">
            {new Date(fecha).toLocaleString()}
          </p>
        )}
      </div>

      {!leida && <span className="notificacionCard__punto"></span>}
    </div>
  );
};

export default React.memo(NotificacionCard);