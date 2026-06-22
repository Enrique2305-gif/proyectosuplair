import { ContActividades } from "../../components"
import { FormSubirProducto } from "../components"
import { IzqPanelSubCrear } from "../components/IzqPanelSubCrear"

export const SubirProducto = () => {
  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <IzqPanelSubCrear esSubirProducto={true}/>
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid"><b>Datos del producto</b></p>
          </div>
          <hr className="hrGeneral"/>
          <FormSubirProducto/>
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades esProveedor={true}/>
      </div>
    </div>
  )
}
