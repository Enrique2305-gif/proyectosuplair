import { useCallback, useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import {
  ContActividades,
  NotificacionCard,
  ContExplorar,
  ContFavoritos,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";

export const NotificacionesProv = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const onNotificacionLeida = (idNotificacion) => {
  setNotificaciones((prev) =>
    prev.map((notif) =>
      notif.IdNotificacion === idNotificacion
        ? { ...notif, Leida: 1 }
        : notif
      )
    );
  };
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState("");

  const getNotificacionesByUser = useCallback(async () => {
    if (!user?.IdUsuario) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorApi("");

      const resp = await fetch(
        `${apiUrl}/notificaciones?idUsuario=${user.IdUsuario}`
      );

      if (!resp.ok) {
        throw new Error("No se pudieron cargar las notificaciones");
      }

      const data = await resp.json();
      setNotificaciones(Array.isArray(data?.rows) ? data.rows : []);
    } catch (error) {
      console.error(error);
      setErrorApi("No se pudieron cargar las notificaciones. Revisa que la API esté activa.");
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  }, [user?.IdUsuario]);

  useEffect(() => {
    getNotificacionesByUser();
  }, [getNotificacionesByUser]);

  const showEmptyArray = !loading && notificaciones.length === 0;

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
              <b>Notificaciones</b>
            </p>
          </div>

          <hr className="hrGeneral" />
          <div className="u-margin-top-small"></div>

          {loading && (
            <p className="paragraph">Cargando notificaciones...</p>
          )}

          {errorApi && (
            <p className="paragraph" style={{ color: "red" }}>
              {errorApi}
            </p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              No ha recibido notificaciones por el momento.
            </p>
          )}

          {!loading &&
            !errorApi &&
            notificaciones.map((notif) => (
            <NotificacionCard
              key={notif.IdNotificacion}
              notificacion={notif}
              esProveedor={true}
              onNotificacionLeida={onNotificacionLeida}
            />
          ))}
        </div>
      </div>

      <div className="comp-main-container__divSepDer"></div>

      <div className="comp-main-container__derCont">
        <ContActividades esProveedor={true} />
      </div>
    </div>
  );
};