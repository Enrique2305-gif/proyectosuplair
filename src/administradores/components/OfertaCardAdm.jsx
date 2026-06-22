import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { ProgressBar } from "../../components"

export const OfertaCardAdm = ({oferta}) => {

  const navigate = useNavigate();

  const onClickOferta = () => {
    navigate(`/oferta_detalle/${oferta.IdOferta}`)
  }
  
  const {IdProducto,
        IdProveedor, 
        Maximo,
        ActualProductos,
        FechaLimite,
        IdEstadosOferta,
      } = !!oferta && oferta;

  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [estadoOferta, setEstadoOferta] = useState();
  const [nombreProveedor, setNombreProveedor] = useState();
  const [datosProd, setDatosProd] = useState({});

  const getProductoOferta = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getProveedorOferta = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?id=${IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  const getEstadoOferta = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${IdEstadosOferta}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoOferta(estado[0]);
  }

  useEffect(() => {
    !!oferta && getProductoOferta();
    !!oferta && getProveedorOferta();
    !!oferta && getEstadoOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])

  useEffect(() => {
    setNombreProveedor(proveedor?.Nombre);
  }, [proveedor])
  
  useEffect(() => {
    setDatosProd({
      nombreProd: producto?.Name,
      costoU: oferta?.ValorUProducto,
      urlImg: producto?.UrlImg,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto])
  
  return (
    <div 
      className="oferta-card-adm u-margin-top-small animate__animated animate__fadeIn" 
      onClick={onClickOferta}
    >
      <div className="oferta-card-adm__imgbox">
        <img className="oferta-card-adm__imgbox__img" src={producto?.UrlImg} alt={datosProd?.nombreProd}/>
      </div>
      <div className="oferta-card__datosbox">
        <div className="oferta-card-adm__datosbox__title u-margin-bottom-small">
          <p className="paragraph paragraph--bold paragraph--mid">{producto?.Name}</p>
          <p className="paragraph">{nombreProveedor}</p>
        </div>
        <div className="oferta-card__datosbox__otros">
          <div className="oferta-card-adm__datosbox__otros__der">
            <p className="paragraph u-padding-right-medium">Precio unitario: {"$" + datosProd?.costoU}</p>
            <p className="paragraph">En oferta: {Maximo - ActualProductos} / { Maximo }</p>
            <ProgressBar 
              actualProductos={ActualProductos} 
              cantMax={Maximo}
            />
            <p className="paragraph">Fecha vigencia: {FechaLimite?.split("T")[0]}</p>
            <p className="paragraph">Estado: {estadoOferta?.Descripcion}</p>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
