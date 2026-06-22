import React from "react"
import { ContListaOfeSim } from "./ContListaOfeSim"
import { ContOfeSimTitle } from "./ContOfeSimTitle"

export const ContOfertasSimilares = ({nombreProducto, idOferta}) => {
  return (
    <div className="actividadesRec">
      <ContOfeSimTitle/>
      <hr className="hrGeneral"/>
      <ContListaOfeSim 
        nombreProducto={nombreProducto} 
        idOferta={idOferta}
      />
    </div>
  )
}
