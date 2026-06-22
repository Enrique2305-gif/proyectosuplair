import { useState } from "react";
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { apiUrl } from "../../apiUrl";
import { EtiquetaInvOferta } from "../../components";

export const ListaOrdenComp = ({oferta, esProveedor=false}) => {

  const [compra, setCompra] = useState();
  const [estadoOferta, setEstadoOferta] = useState([]);

  const [comprasProv, setComprasProv] = useState([]);

  const getEstadoOferta = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${compra?.IdEstado}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoOferta(estado[0]);
  }

  const getCompraByIdOferta = async() => {
    const resp = await fetch(`${apiUrl}/compras?idOferta=${oferta?.IdOferta}`);
    const data = await resp.json();
    const {rows: compra} = !!data && data;
    setCompra(compra[0]);
  }

  const getComprasByOferta = async() => {
    const resp = await fetch(`${apiUrl}/compras?idOferta=${oferta?.IdOferta}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    setComprasProv(compras);
  }

  useEffect(() => {
    !!compra && getEstadoOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compra])

  const showEmptyArray = comprasProv?.length === 0;

  useEffect(() => {
    esProveedor ? getComprasByOferta() : getCompraByIdOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])
  
  return (
    <>
    <div className="explorarCat__title u-margin-top-mid">
      <span className="material-symbols-rounded icon-grey icon--sm">
        arrow_forward_ios
      </span>
      <p className="paragraph--mid"><b>{ esProveedor ? "Órdenes de compra" : "Tu orden de compra"}</b></p>
    </div>
    <hr className="hrGeneral"/>
    {esProveedor
    ? 
    (showEmptyArray ? <p className="paragraph">Todavía no hay órdenes de compra</p> :
      comprasProv?.map((compra) =>   
      <div className="listaOrdenComp__orden u-margin-top-small" key={compra?.IdCompra}>
        <div className="u-padding-left-small u-margin-top-small listaOrdenComp__orden__izq">
            <p className="paragraph">Fecha: {(compra?.Fecha)?.split("T")[0]}</p>
            <p className="paragraph">Unidades adquiridas: {compra?.Cantidad}</p>
            <p className="paragraph">Total pagado: ${compra?.Total}</p>
            {/* <div className="listaOrdenComp__orden__izq__estadoBox">
              <p className="paragraph">Estado: </p>
              <EtiquetaInvOferta
                estado={estadoOferta?.Descripcion} 
              />
            </div> */}
        </div>
        <div className="listaOrdenComp__orden__der">
          <Link 
            to={`/venta_individual/${compra?.IdCompra}`} 
            key={compra?.IdCompra} 
          >
            <button className="btn btn--blue">
              Ver más
            </button>
          </Link>
        </div>
      </div>
    ))
    :
    <div className="listaOrdenComp__orden u-margin-top-small">
      <div className="u-padding-left-small u-margin-top-small listaOrdenComp__orden__izq">
          <p className="paragraph">Fecha: {(compra?.Fecha)?.split("T")[0]}</p>
          <p className="paragraph">Unidades adquiridas: {compra?.Cantidad}</p>
          <p className="paragraph">Total pagado: ${compra?.Total}</p>
          <div className="listaOrdenComp__orden__izq__estadoBox">
            <p className="paragraph">Estado: </p>
            <EtiquetaInvOferta
              estado={estadoOferta?.Descripcion} 
            />
          </div>
      </div>
      <div className="listaOrdenComp__orden__der">
        <Link 
          to={`/oferta_individual/${compra?.IdCompra}`} 
          key={compra?.IdCompra} 
        
        >
          <button className="btn btn--blue">
            Ver más
          </button>
        </Link>

      </div>
    </div>
    }
  
    </>
  )
}
