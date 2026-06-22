import { useEffect, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import { ContActividades, OrdenCard, ContExplorar, ContFavoritos } from "../../../components"
import { ContMenu } from "../../../components/cont_menu/ContMenu"

export const OrdConfPageProv = () => {
  const [comprasPorConf, setComprasPorConf] = useState([]);
  const [comprasPorConf2, setComprasPorConf2] = useState([]);

  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const handleSeleccion = (event) => {
    const opcionSeleccionada = event.target.value;
    setOpcionSeleccionada(opcionSeleccionada);
  };

  const getComprasPorConf = async() => {
    const resp = await fetch(`${apiUrl}/compras?idEstado=${5}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    setComprasPorConf(compras);
  }

  const getComprasPorConf2 = async() => {
    const resp = await fetch(`${apiUrl}/compras?idEstado=${8}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    setComprasPorConf2(compras);
  }

  useEffect(() => {
    getComprasPorConf();
    getComprasPorConf2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showEmptyArray = !!comprasPorConf && comprasPorConf?.length === 0;
  const showEmptyArray2 = !!comprasPorConf2 && comprasPorConf2?.length === 0;

  return (
    <div className="comp-main-container u-margin-top-navbar">
    <div className="comp-main-container__izqCont">
      <ContMenu/>
      <ContExplorar />
      <ContFavoritos />
    </div>
    <div className="comp-main-container__divSepIzq"></div>
    <div className="comp-main-container__medCont">
      <div className="comp-main-container__medCont__ofertas">
        <div className="explorarCat__titleCardOferta">
          <div  className="explorarCat__titleCardOferta__tituloBox">
          <span className="material-symbols-rounded icon-grey icon--sm">
            arrow_forward_ios
          </span>
          <p className="paragraph--mid"><b>Órdenes de compra por confirmar</b></p>
          </div>
          <div className="explorarCat__titleCardOferta__filtrarBox">
          <span className="material-symbols-rounded icon-grey icon--bg">
              filter_list
            </span>
                   <select value={opcionSeleccionada} onChange={handleSeleccion} className="formSubirProducto__inputBox__selectFilter">
                     <option value="todos">Todas</option>
                     <option value="opcionFechaM">Fecha - Mayor a menor</option>
                     <option value="opcionFecham">Fecha - Menor a mayor</option>
                   </select>
                   </div>
        </div>
        <hr className="hrGeneral"/>
        {
          (showEmptyArray && showEmptyArray2) 
          && 
          <p className="paragraph">Por el momento no hay órdenes de compra por confirmar.</p>
        }
        {
        comprasPorConf?.map(compra => (
          <OrdenCard 
            key={compra.IdCompra}
            compra={compra}
          />
        ))}
        {
        comprasPorConf2?.map(compra => (
          <OrdenCard 
            key={compra.IdCompra}
            compra={compra}
          />
        ))}
      </div>
    </div>
    <div className="comp-main-container__divSepDer"></div>
    <div className="comp-main-container__derCont">
      <ContActividades esProveedor={true}/>
    </div>
  </div>
  )
}
