//import { useContext } from "react";
import { apiUrl } from "../../apiUrl";
//import { AuthContext } from "../../auth";

export const ConfirmarCancelarOferta = ({oferta, setShowConfirmarCancelarOferta, setShowAccionExitosa}) => {
  //const {authState: {user}} = useContext(AuthContext);

  const actualizarOferta = async() => {
    const bodySolicitud = { 
        IdOferta: oferta,
        IdEstadosOferta: 7, //Id Estado DB
      }
      const resp = await fetch(`${apiUrl}/ofertas/estadoOferta`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodySolicitud)
      });
      const dataSolicitud = await resp.json()
      console.log(!!dataSolicitud && "Cancelando Oferta");
  }

  
  const onActualizarOferta = (e) => {
    e.preventDefault();
    actualizarOferta();
    setShowConfirmarCancelarOferta(false);
    setShowAccionExitosa(true);
  }

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="resumenProducto__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSupProv"></div>
        <div className="resumenProducto__ventana__contenido">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid"><b>Cancelar Oferta</b></p>
          </div>
          <hr className="hrGeneral"/>
          <div className="compraProducto__box">
              <p className="paragraph">¿Está seguro de cancelar la oferta?, los pagos serán devueltos a los compradores y podría existir una tarifa de cobro adicional.</p>         
          </div>
          <div className="metodoPago__btnBox">
            <button 
              type="button"
              onClick={() => setShowConfirmarCancelarOferta(false)}
              className="btn btn--red"
            >Retroceder</button>
            <button
              type="submit" 
              onClick={onActualizarOferta}
              className="btn btn--blue"
            >Aceptar</button>
          </div>
        </div>
        
      </div>
    </div>
  )
}
