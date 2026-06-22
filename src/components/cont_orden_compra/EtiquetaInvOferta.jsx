import React from "react"
import { useEffect, useState } from "react";

export const EtiquetaInvOferta = ({estado}) => {

  const [estiloSegunEstado, setEstiloSegunEstado] = useState("");

  useEffect(() => {
    switch (estado) {
      case "En curso":
        setEstiloSegunEstado("paragraph--tag--green")
        break;
      case "Por confirmar cierre":
        setEstiloSegunEstado("paragraph--tag--red")
        break; 
      case "Verificando pagos":
        setEstiloSegunEstado("paragraph--tag--purple");
        break;
      case "Por despachar":
        setEstiloSegunEstado("paragraph--tag--red");
        break;
      case "Despachado":
        setEstiloSegunEstado("paragraph--tag--green");
        break;
      case "En revisión":
        setEstiloSegunEstado("paragraph--tag--lightblue");
        break;
      case "Por devolver pago":
        setEstiloSegunEstado("paragraph--tag--red");
        break;
      case "Pago devuelto":
        setEstiloSegunEstado("paragraph--tag--green");
        break;
      case "Finalizado":
        setEstiloSegunEstado("paragraph--tag--grey");
        break;
      default:
        setEstiloSegunEstado("paragraph--tag--grey")
        break;
    }
  }, [estado])

  return (
    <div className={estiloSegunEstado}>
      <p className={"paragraph"}>{estado}</p>
    </div>
    
  )
}
