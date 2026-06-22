import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";

export const ResumenDemanda = ({
  formState: demandaData,
  setShowResumenDemanda,
  setShowAccionExitosa,
  setShowAccionErronea,
}) => {
  const [producto, setProducto] = useState();
  const {
    authState: { user },
  } = useContext(AuthContext);

  const getProductoByIdProducto = async (idProducto) => {
    const resp = await fetch(`${apiUrl}/productos?id=${parseInt(idProducto)}`);
    const data = await resp.json();
    const { rows: producto } = !!data && data;
    setProducto(producto[0]);
  };

  const uploadDemanda = async () => {
    console.log(demandaData.fechaLimite);
    //IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, Estado, ValorUProducto
    const body = {
      IdProducto: parseInt(demandaData.idProducto),
      IdComprador: user.IdUsuario,
      IdEstadosOferta: demandaData.idEstadoOferta,
      Minimo: parseInt(demandaData.cantMin),
      Maximo: parseInt(demandaData.cantMax),
      Descripcion: demandaData.descripcion,
      ActualProductos: 0,
      FechaLimite: demandaData.fechaLimite,
      Estado: demandaData.estado,
      PrecioMinimo: demandaData.precioMinimo,
      PrecioMaximo: demandaData.precioMaximo,
    };

    const resp = await fetch(`${apiUrl}/demandas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    setShowResumenDemanda(false);
    if (resp.ok) {
      setShowAccionExitosa(true);
      const data = await resp.json();
      console.log(data);
    } else {
      setShowAccionErronea(true);
    }
  };

  useEffect(() => {
    getProductoByIdProducto(demandaData.idProducto);
  }, [demandaData]);

  const onCrearDemanda = (e) => {
    e.preventDefault();
    uploadDemanda();
  };

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="resumenProducto__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <div className="resumenProducto__ventana__contenido">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid">
              <b>Resumen de la oferta</b>
            </p>
          </div>
          <div className="compraProducto__box">
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Nombre del producto: {producto?.Name}</p>
            </div>
            {/* <div className="oferta-detalle__productoBox u-margin-top-small">
              <img src={producto?.UrlImg} alt={producto?.Name} className="resumenProducto__ventana__img" />
              <div className="resumenProducto__ventana__descBox">
                <div className="resumenProducto__ventana__descBox__texto">
                  <p className="paragraph">{producto?.Descripcion}</p>
                </div>
              </div>
            </div> */}
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Precio mínimo por producto: $ {demandaData?.precioMinimo}
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Precio máximo por producto: $ {demandaData?.precioMaximo}
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Descripción oferta: {demandaData?.descripcion}
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Cantidad mínima para cerrar la demanda: {demandaData?.cantMin}{" "}
                unidades
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Cantidad a pedir en total: {demandaData?.cantMax} unidades
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Fecha de vigencia: {demandaData?.fechaLimite}
              </p>
            </div>
          </div>

          <div className="metodoPago__btnBox">
            <button
              type="button"
              onClick={() => setShowResumenDemanda(false)}
              className="btn btn--red"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={onCrearDemanda}
              className="btn btn--blue"
            >
              Crear demanda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
