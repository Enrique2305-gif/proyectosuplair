import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../../../auth";
import {
  ContActividades,
  OfertaCard,
  ContExplorar,
  ContFavoritos,
} from "../../../components";
import { ContMenu } from "../../../components/cont_menu/ContMenu";

export const OrdFinPageProv = () => {
  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const handleSeleccion = (event) => {
    setOpcionSeleccionada(event.target.value);
  };

  const getOfertasFinalizadasProveedor = async () => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);
      setError("");

      // 1. Traer compras/órdenes del proveedor
      const respCompras = await fetch(
        `${apiUrl}/compras?idProveedor=${user.IdUsuario}`
      );

      const dataCompras = await respCompras.json();
      const compras = dataCompras?.rows || [];

      // 2. Filtrar solo compras finalizadas
      const comprasFinalizadas = compras.filter(
        (compra) => Number(compra.IdEstado) === 9
      );

      // 3. Sacar los IdOferta de esas compras finalizadas
      const idsOfertas = [
        ...new Set(
          comprasFinalizadas
            .map((compra) => compra.IdOferta)
            .filter((idOferta) => idOferta !== null && idOferta !== undefined)
        ),
      ];

      if (idsOfertas.length === 0) {
        setOfertasTodos([]);
        return;
      }

      // 4. Buscar cada oferta por su ID
      const ofertasResp = await Promise.all(
        idsOfertas.map(async (idOferta) => {
          const respOferta = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
          const dataOferta = await respOferta.json();

          return dataOferta?.rows?.[0];
        })
      );

      let ofertasFinalizadas = ofertasResp.filter(Boolean);

      // 5. Filtros por fecha
      switch (opcionSeleccionada) {
        case "opcionFechaM":
          ofertasFinalizadas = ofertasFinalizadas.sort(
            (a, b) => new Date(b.FechaLimite) - new Date(a.FechaLimite)
          );
          break;

        case "opcionFecham":
          ofertasFinalizadas = ofertasFinalizadas.sort(
            (a, b) => new Date(a.FechaLimite) - new Date(b.FechaLimite)
          );
          break;

        default:
          break;
      }

      setOfertasTodos(ofertasFinalizadas);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las ofertas finalizadas.");
      setOfertasTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfertasFinalizadasProveedor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.IdUsuario, opcionSeleccionada]);

  const showEmptyArray = !loading && !error && ofertasTodos?.length === 0;

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
                <b>Ofertas Finalizadas</b>
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
                <option value="opcionFechaM">
                  Fecha de cierre - Mayor a menor
                </option>
                <option value="opcionFecham">
                  Fecha de cierre - Menor a mayor
                </option>
              </select>
            </div>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">
              Cargando ofertas finalizadas...
            </p>
          )}

          {error && (
            <p className="paragraph paragraph--red">
              {error}
            </p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no hay ofertas culminadas.
            </p>
          )}

          {!loading &&
            !error &&
            ofertasTodos?.map((oferta) => (
              <OfertaCard
                key={oferta.IdOferta}
                oferta={oferta}
                esProveedor={true}
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