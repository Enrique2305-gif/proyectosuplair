import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../../../auth";
import { ContActividades, OfertaCard, ContExplorar, ContFavoritos } from "../../../components"
import { ContMenu } from "../../../components/cont_menu/ContMenu"

export const OfeCanPageProv = () => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const idsEstadosOferta = [7,8]; // IDs que deseas buscar
  const idsQueryString = idsEstadosOferta.join(',');
  const [ofertasTodos, setOfertasTodos] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const handleSeleccion = (event) => {
    const opcionSeleccionada = event.target.value;
    setOpcionSeleccionada(opcionSeleccionada);
  };

  const getOfertasTodos = async() => {
    //ofertas finalizadas
    const resp = await fetch(`${apiUrl}/ofertas?idProveedor=${user.IdUsuario}&idsEstadosOferta=${idsQueryString}`);
    const data = await resp.json();
    const {rows: ofertas} = !!data && data;
    setOfertasTodos(ofertas);
  }

  const getOfertasPorFechaMayor = async() => {
    const resp = await fetch(`${apiUrl}/ofertas/orderFechaMayor?idProveedor=${user.IdUsuario}&idsEstadosOferta=${idsQueryString}`);
    const data = await resp.json();
    const {rows: ofertasM} = !!data && data;
    setOfertasTodos(ofertasM);
  }

  const getOfertasPorFechaMenor = async() => {
    const resp = await fetch(`${apiUrl}/ofertas/orderFechaMenor?idProveedor=${user.IdUsuario}&idsEstadosOferta=${idsQueryString}`);
    const data = await resp.json();
    const {rows: ofertasm} = !!data && data;
    setOfertasTodos(ofertasm);
  }

  const getOfertasSoloDevolver = async() => {
    //ofertas finalizadas
    const resp = await fetch(`${apiUrl}/ofertas?idProveedor=${user.IdUsuario}&idEstadosOferta=${7}`);
    const data = await resp.json();
    const {rows: ofertas} = !!data && data;
    setOfertasTodos(ofertas);
  }

  const getOfertasSoloDevuelto = async() => {
    //ofertas finalizadas
    const resp = await fetch(`${apiUrl}/ofertas?idProveedor=${user.IdUsuario}&idEstadosOferta=${8}`);
    const data = await resp.json();
    const {rows: ofertas} = !!data && data;
    setOfertasTodos(ofertas);
  }

  const seleccionFilter = async(opcionSeleccionada) => {
    switch (opcionSeleccionada) {
      case "opcionFechaM":
        getOfertasPorFechaMayor()
        break;
      case "opcionFecham":
        getOfertasPorFechaMenor()
        break;
      case "opcionDevolver":
        getOfertasSoloDevolver()
        break;
      case "opcionDevuelto":
        getOfertasSoloDevuelto()
        break;              
      default:
        getOfertasTodos();
      break;
    }
  }

  useEffect(() => {
    seleccionFilter(opcionSeleccionada);
    // eslint-disable-next-line
  }, [opcionSeleccionada]);


  useEffect(() => {
    getOfertasTodos();
    // eslint-disable-next-line
  }, [])

  const showEmptyArray = ofertasTodos?.length === 0;

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
          <p className="paragraph--mid"><b>Ofertas Canceladas</b></p>
          </div>
          <div></div>
          <div className="explorarCat__titleCardOferta__filtrarBox">
              <span className="material-symbols-rounded icon-grey icon--bg">
              filter_list
            </span>
                   <select value={opcionSeleccionada} onChange={handleSeleccion} className="formSubirProducto__inputBox__selectFilter">
                     <option value="todos">Todas</option>
                     <option value="opcionFechaM">Fecha de cierre - Mayor a menor</option>
                     <option value="opcionFecham">Fecha de cierre - Menor a mayor</option>
                     <option value="opcionDevolver">Solo por devolver pago</option>
                     <option value="opcionDevuelto">Solo pago devuelto</option>
                   </select>
                   </div>
                 
        </div>
        <hr className="hrGeneral"/>
        {showEmptyArray
        ? <p className="paragraph">Por el momento no hay ofertas canceladas.</p>
        :
        ofertasTodos?.map(oferta => (
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
      <ContActividades esProveedor={true}/>
    </div>
  </div>
  )
}
