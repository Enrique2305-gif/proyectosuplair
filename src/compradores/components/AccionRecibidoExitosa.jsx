import { CalificarProducto } from "./CalificarProducto";

export const AccionRecibidoExitosa = ({compra, texto, setShowAccionExitosa}) => {
  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="accionExitosa__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <div className="accionExitosa__ventana__textoBox">
          <span className="material-symbols-rounded accionExitosa__ventana__textoBox__icon">
            check_circle
          </span>
          <p className="paragraph paragraph--bold accionExitosa__ventana__textoBox__texto" align="center">{texto}</p>
        </div>
        <CalificarProducto compra={compra} setShowAccionExitosa={setShowAccionExitosa}/>
        
      </div>
    </div>
  )
}
