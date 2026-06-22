import { useContext, useEffect, useState } from "react"
import { apiUrl } from "../../apiUrl"
import { AuthContext } from "../../auth";

export const ResumenOferta = ({formState: ofertaData, setShowResumenOferta, setShowAccionExitosa}) => {

  const [producto, setProducto] = useState();
  const {authState: {user}} = useContext(AuthContext);


  const getProductoByIdProducto = async(idProducto) => {
    const resp = await fetch(`${apiUrl}/productos?id=${parseInt(idProducto)}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const uploadOferta = async() => {
    //IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, Estado, ValorUProducto
    const body = {
      IdProducto: parseInt(ofertaData.idProducto),
      IdProveedor: user.IdUsuario,
      IdEstadosOferta: ofertaData.idEstadoOferta, 
      Minimo: parseInt(ofertaData.cantMin), 
      Maximo: parseInt(ofertaData.cantMax), 
      Descripcion: ofertaData.descripcion, 
      ActualProductos: 0, 
      FechaLimite: ofertaData.fechaLimite, 
      Estado: ofertaData.estado, 
      ValorUProducto: ofertaData.costoUnitario,
      ValorUInstantaneo: ofertaData.costoInstantaneo
    }

    const resp = await fetch(`${apiUrl}/ofertas`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(data);

  }

  useEffect(() => {
    getProductoByIdProducto(ofertaData.idProducto);
  }, [ofertaData])
  
  
  const onCrearOferta = (e) => {
    e.preventDefault();
    uploadOferta();
    setShowResumenOferta(false);
    setShowAccionExitosa(true);
  }

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="resumenProducto__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <div className="resumenProducto__ventana__contenido">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid"><b>Resumen de la oferta</b></p>
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
              <p className="paragraph">Costo unitario: $ {ofertaData?.costoUnitario}</p>
            </div>
            {
            ofertaData?.costoInstantaneo>0 &&
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Costo unitario instantáneo: $ {ofertaData?.costoInstantaneo}</p>
            </div>
}
{
            ofertaData?.costoInstantaneo<=0 &&
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Costo unitario instantáneo: Sin costo instantáneo</p>
            </div>
}
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Descripción oferta: {ofertaData?.descripcion}</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Cantidad mínima para cerrar oferta: {ofertaData?.cantMin} unidades</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Cantidad a vender en total: {ofertaData?.cantMax} unidades</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Fecha de vigencia: {ofertaData?.fechaLimite}</p>
            </div>
            
          </div>

          <div className="metodoPago__btnBox">
            <button 
              type="button"
              onClick={() => setShowResumenOferta(false)}
              className="btn btn--red"
            >Cancelar</button>
            <button
              type="submit" 
              onClick={onCrearOferta}
              className="btn btn--blue"
            >Crear oferta</button>
          </div>
        </div>
        
      </div>
    </div>
  )
}
