import React from "react"
import { useEffect, useState } from "react";

export const EtiquetaOferta = ({estado, esOfertaDetalle = false, esAdm = false}) => {

  const [estiloSegunEstado, setEstiloSegunEstado] = useState("");

useEffect(() => {
  switch (estado) {
    case "En curso":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--green")
      break;
    case "Por confirmar cierre":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--red")
      break; 
    case "Verificando pagos":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--purple");
      break;
    case "Por despachar":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--red");
      break;
    case "Despachado":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--green");
      break;
    case "En revisión":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--lightblue");
      break;
    case "Por devolver pago":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--red");
      break;
    case "Pago devuelto":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--green");
      break;
    case "Finalizado":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--grey");
      break;
    case "Unido":
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta2");
      break;
    default:
      setEstiloSegunEstado("oferta-card__etiquetaBox__etiqueta oferta-card__etiquetaBox__etiqueta--grey")
      break;
  }
}, [estado])


  return (
    <div className={estiloSegunEstado}>
      <p className={esOfertaDetalle ? "paragraph--sm" : "paragraph"}>{estado}</p>
    </div>
  )
}
