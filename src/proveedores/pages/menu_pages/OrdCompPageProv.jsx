import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../../../auth";
import {
  ContActividades,
  OrdenCard,
  ContExplorar,
  ContFavoritos,
} from "../../../components";
import { ContMenu } from "../../../components/cont_menu/ContMenu";

export const OrdCompPageProv = () => {
  const [compras, setCompras] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(false);

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const handleSeleccion = (event) => {
    setOpcionSeleccionada(event.target.value);
  };

  const ordenarCompras = (comprasLista) => {
    const comprasOrdenadas = [...comprasLista];

    switch (opcionSeleccionada) {
      case "opcionFechaM":
        return comprasOrdenadas.sort(
          (a, b) => new Date(b.Fecha) - new Date(a.Fecha)
        );

      case "opcionFecham":
        return comprasOrdenadas.sort(
          (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
        );

      default:
        return comprasOrdenadas;
    }
  };

  const getComprasProveedor = async () => {
    if (!user?.IdUsuario) return;

    try {
      setLoading(true);

      const resp = await fetch(
        `${apiUrl}/compras?idProveedor=${user.IdUsuario}`
      );

      const data = await resp.json();
      const comprasData = data?.rows || [];

      const comprasOrdenadas = ordenarCompras(comprasData);
      setCompras(comprasOrdenadas);
    } catch (error) {
      console.error(error);
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComprasProveedor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.IdUsuario, opcionSeleccionada]);

  const showEmptyArray = !loading && compras?.length === 0;

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
                <b>Órdenes de compra</b>
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
                <option value="opcionFechaM">Fecha - Mayor a menor</option>
                <option value="opcionFecham">Fecha - Menor a mayor</option>
              </select>
            </div>
          </div>

          <hr className="hrGeneral" />

          {loading && (
            <p className="paragraph">
              Cargando órdenes de compra...
            </p>
          )}

          {showEmptyArray && (
            <p className="paragraph">
              Por el momento no tienes órdenes de compra.
            </p>
          )}

          {!loading &&
            compras?.map((compra) => (
              <OrdenCard
                key={compra.IdCompra}
                compra={compra}
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