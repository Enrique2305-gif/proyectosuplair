import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { EtiquetaOferta, ProgressBar, ValoracionStar } from "../../components";
import { ContNavegar } from "../components"

export const OfertaDetalleAdm = () => {

  const {idOferta} = useParams();
  const [oferta, setOferta] = useState();
  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [estadoOferta, setEstadoOferta] = useState();

  const getOferta = async() => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
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

  const getProveedor = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${oferta.IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  const getEstadoOferta = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${oferta.IdEstadosOferta}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoOferta(estado[0]);
  }

  useEffect(() => {
    getOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOferta])

  useEffect(() => {
    !!oferta && getProducto();
    !!oferta && getProveedor();
    !!oferta && getEstadoOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])

  const handleClickCerrarOferta = () => {
    console.log("cerrando oferta")
  }


  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Oferta detalle  &gt; {producto?.Name}</h1>
        <hr className="hrGeneral"/>
        <div className="admPrincipalContainer">
        <div className="oferta-card__etiquetaBox">
          <EtiquetaOferta estado={estadoOferta?.Descripcion} esOfertaDetalle={true}/>
          </div>
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
                <p className="paragraph"><b>Precio unitario:</b> {"$" + oferta?.ValorUProducto}</p>
              </div>
            </div>
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">Unidades restantes:&nbsp;
                  {oferta?.Maximo - oferta?.ActualProductos}&nbsp;/&nbsp;
                  {oferta?.Maximo}
                </p>
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">Fecha de cierre: {!!oferta?.FechaLimite && (oferta.FechaLimite).split("T")[0]}</p>
              </div>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">{oferta?.Descripcion}</p>
            </div>

            <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph paragraph--blue">Unidades restantes para completar el mínimo:&nbsp;
                {(oferta?.Minimo - oferta?.ActualProductos) >= 0 
                ? oferta?.Minimo - oferta?.ActualProductos
                : 0
                }
              </p>
            </div>
            
            <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph">Progreso de unidades vendidas: </p>
              <div className="oferta-detalle__productoProgress__barbox">
                <ProgressBar
                  cantMax={oferta?.Maximo} 
                  actualProductos={oferta?.ActualProductos}
                />
              </div>
              <p 
                className="paragraph paragraph--blue"
              >
                {((oferta?.ActualProductos / oferta?.Maximo) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="oferta-detalle__btnBox u-margin-top-small">
              <button
                className="btn btn--red"
                onClick={handleClickCerrarOferta}>
                Cerrar oferta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
