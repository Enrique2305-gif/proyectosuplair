import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  OfertaCard,
} from "../../components";
import { apiUrl } from "../../apiUrl";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProdDemandaButtonBox } from "../components";
import { AuthContext } from "../../auth";

export const PerfilProveedor = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [q, setQ] = useState("");
  const [proveedor, setProveedor] = useState({});
  const [ofertasProv, setOfertasProv] = useState([]);
  const [loadingOfertas, setLoadingOfertas] = useState(false);

  const esProveedorLogueado =
    user?.IdRol === 2 ||
    user?.Rol === 2 ||
    user?.rol === "proveedor" ||
    user?.Rol === "proveedor";

  useEffect(() => {
    const query = queryString.parse(location.search);
    setQ(query.q);
  }, [location]);

  const getProveedor = async (idProveedor) => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${idProveedor}`);
    const data = await resp.json();
    const { rows } = data;

    setProveedor(rows?.[0] || {});
  };

  const getOfertasProv = async (idProveedor) => {
    try {
      setLoadingOfertas(true);

      const resp = await fetch(
        `${apiUrl}/ofertas?idProveedor=${idProveedor}&idEstadosOferta=1`
      );

      const data = await resp.json();
      const { rows } = data;

      setOfertasProv(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Error cargando ofertas del proveedor:", error);
      setOfertasProv([]);
    } finally {
      setLoadingOfertas(false);
    }
  };

  useEffect(() => {
    if (!q) return;

    getProveedor(q);
    getOfertasProv(q);
  }, [q]);

  const showError = !loadingOfertas && ofertasProv?.length === 0;

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />

        {!esProveedorLogueado && <ProdDemandaButtonBox />}

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
              <b>Perfil proveedor: {proveedor?.Nombre || "Cargando..."}</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          <div className="u-margin-top-small"></div>

          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">País: {proveedor?.Pais || "No registrado"}</p>
          </div>

          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">
              Ciudad: {proveedor?.Ciudad || "No registrada"}
            </p>
          </div>

          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">
              Dirección: {proveedor?.Direccion || "No registrada"}
            </p>
          </div>

          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">
              E-mail: {proveedor?.Email || "No registrado"}
            </p>
          </div>

          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">
              Celular: {proveedor?.Numero || "No registrado"}
            </p>
          </div>

          <div className="explorarCat__title u-margin-top-small">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>

            <p className="paragraph--mid">
              <b>Ofertas en curso</b>
            </p>
          </div>

          <hr className="hrGeneral" />

          {loadingOfertas && (
            <p className="paragraph u-margin-top-small">
              Cargando ofertas del proveedor...
            </p>
          )}

          {!loadingOfertas && ofertasProv?.length > 0 && (
            <div className="comp-main-container__medCont__ofertas">
              {ofertasProv.map((oferta) => (
                <OfertaCard
                  key={oferta.IdOferta}
                  oferta={oferta}
                  esProveedor={esProveedorLogueado}
                />
              ))}
            </div>
          )}

          <div
            className="busqueda__errorBusqueda"
            style={{ display: showError ? "" : "none" }}
          >
            <p className="paragraph">
              No se han encontrado ofertas en curso con este proveedor.
            </p>
          </div>
        </div>
      </div>

      <div className="comp-main-container__divSepDer"></div>

      <div className="comp-main-container__derCont">
        <ContActividades esProveedor={esProveedorLogueado} />
      </div>
    </div>
  );
};