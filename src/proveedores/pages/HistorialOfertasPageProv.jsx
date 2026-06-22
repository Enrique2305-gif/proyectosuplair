import { useContext } from "react";
import { AuthContext } from "../../auth";
import { ContActividades, ContExplorar, OfertaCard } from "../../components"
import { getOfertaByIdProveedor } from "../../helpers/getOfertaById";
import { ProdOfertaButtonBox } from "../components";

export const HistorialOfertasPageProv = () => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;
  
  const ofertas = getOfertaByIdProveedor(user.id);

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContExplorar/>
        <ProdOfertaButtonBox/>
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
        <div className="explorarCat__title">
          <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
          </span>
          <p className="paragraph--mid"><b>Historial de ofertas</b></p>
          </div>
          {ofertas.map(oferta => (
            <OfertaCard 
              key={oferta.idOferta}
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
