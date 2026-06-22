import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { ContActividades, EtiquetaOferta, ValoracionStar } from "../../components"
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { AccionExitosa, ConfirmarDespachoProv, ConfirmarPagoProv, ProdOfertaButtonBox } from "../components";

export const VentaIndDetalle = () => {
  const {idCompra} = useParams();

  const [oferta, setOferta] = useState();
  const [compra, setCompra] = useState();
  const [producto, setProducto] = useState();
  const [estadoCompra, setEstadoCompra] = useState();
  const [proveedor, setProveedor] = useState();
  //const [llegaMinimo, setLlegaMinimo] = useState(false);
  const [showConfirmarPagoProv, setShowConfirmarPagoProv] = useState(false);
  const [showPagoRecibidoExitoso, setShowPagoRecibidoExitoso] = useState(false);
  const [showConfirmarDespachoProv, setShowConfirmarDespachoProv] = useState(false);
  const [showDespachoExitoso, setShowDespachoExitoso] = useState(false);

  const getCompra = async() => {
    const resp = await fetch(`${apiUrl}/compras?id=${idCompra}`);
    const data = await resp.json();
    const {rows: comp} = !!data && data;
    setCompra(comp[0]);
  }

  const getOferta = async() => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${compra?.IdOferta}`);
    const data = await resp.json();
    const {rows: oferta} = !!data && data;
    setOferta(oferta[0]);
  }

  const getProducto = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${oferta.IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getEstadoCompra = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${compra?.IdEstado}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoCompra(estado[0]);
  }

  const getProveedor = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${compra?.IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  const onConfirmarDespacho = () => {
    setShowConfirmarDespachoProv(true);
  }

  const onConfirmarPagoRecibido = () => {
    setShowConfirmarPagoProv(true);
  }

  useEffect(() => {
    getCompra();
    // eslint-disable-next-line
  }, [idCompra])
  
  useEffect(() => {
    !!compra && getOferta();
    !!compra && getProveedor();
    // eslint-disable-next-line
  }, [compra])

  useEffect(() => {
    !!compra && getProducto();
    !!compra && getEstadoCompra();
    // eslint-disable-next-line
  }, [oferta])
  

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        {/* <ContExplorar/> */}
        <ContMenu/>
        <ProdOfertaButtonBox/>
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid"><b>Orden de compra: {producto?.Name}</b></p>
            <div className="oferta-card__etiquetaBox">
              <EtiquetaOferta
                estado={
                  (estadoCompra?.Descripcion === "Verificando pagos" ||
                    (
                      estadoCompra?.Descripcion === "En curso" &&
                      [2, 3, 11].includes(Number(oferta?.IdEstadosOferta))
                    )
                  ) && 
                    <div className="oferta-detalle__btnBox">
                      <button
                        className="btn btn--blue"
                        onClick={onConfirmarPagoRecibido}
                      >
                        Confirmar pago recibido
                      </button>
                    </div>
                }
                esOfertaDetalle={true}
              />
            </div>
          </div>
          <hr className="hrGeneral"/>
          <div className="oferta-detalle__productoBox u-margin-top-small">
            <div className="oferta-detalle__productoBox__imgBox">
              <img 
                className="oferta-detalle__productoBox__imgBox__img" 
                src={producto?.UrlImg === "no-img.jpeg" ? "/no-img.jpeg" : producto?.UrlImg} 
                alt={producto?.Name}
              />
            </div>
            <div className="oferta-detalle__productoBox__desc">
              <ValoracionStar cant_estrellas={producto?.Valoracion}/>
              <div className="oferta-detalle__productoBox__desc__text">
                <p className="paragraph">{producto?.Descripcion}</p>
              </div>
            </div>
          </div>
          <div>
          <div className="oferta-detalle__productoBox__twoColumn">
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph"><b>Proveedor: {proveedor?.Nombre}</b></p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Precio unitario: {"$" + oferta?.ValorUProducto}</p>
            </div>
          </div>
          <div className="oferta-detalle__productoBox__twoColumn">
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Cantidad de unidades vendidas: {compra?.Cantidad}</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Total: {"$" + compra?.Total}</p>
            </div>
          </div>
          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">{oferta?.Descripcion}</p>
          </div>
          <div className="oferta-detalle__productoBox u-margin-top-small">
            <p className="paragraph">Fecha de cierre: {!!oferta?.FechaLimite && (oferta.FechaLimite).split("T")[0]}</p>
          </div>
            { estadoCompra?.Descripcion === "Verificando pagos" && 
            <div className="oferta-detalle__btnBox">
              <button
                className="btn btn--blue"
                onClick={onConfirmarPagoRecibido}>
                Confirmar pago recibido
              </button>
            </div>}
            { estadoCompra?.Descripcion === "Por despachar" && 
            <div className="oferta-detalle__btnBox">
              <button
                className="btn btn--blue"
                onClick={onConfirmarDespacho}>
                Confirmar despacho
              </button>
            </div>}
            {
              showConfirmarPagoProv &&
              <ConfirmarPagoProv
                compra={compra}
                setShowConfirmarPagoProv={setShowConfirmarPagoProv}
                setShowPagoRecibidoExitoso={setShowPagoRecibidoExitoso}
              />
            }
            {
              showPagoRecibidoExitoso &&
              <AccionExitosa 
                texto="Gracias por confirmar el pago. Por favor, continúa con el despacho de productos." 
                setShowAccionExitosa={setShowPagoRecibidoExitoso}
              />
            }
            {
              showConfirmarDespachoProv &&
              <ConfirmarDespachoProv
                compra={compra}
                setShowConfirmarDespachoProv={setShowConfirmarDespachoProv}
                setShowDespachoExitoso={setShowDespachoExitoso}
              />
            }
            {
             showDespachoExitoso &&
             <AccionExitosa 
              texto="Despacho del producto confirmado. Espere la confirmación del comprador de haber recibido el producto, y dar así culminada la transacción." 
              setShowAccionExitosa={setShowPagoRecibidoExitoso}
            />
            }

          </div>
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades esProveedor={true}/>
      </div>
    </div>
  )
}
