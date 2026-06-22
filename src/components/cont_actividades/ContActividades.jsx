import React from "react";
import { ContListaActProv } from "../../proveedores/components/ContListaActProv";
import { ContActTitle } from "./ContActTitle";
import { ContListaAct } from "./ContListaAct";

export const ContActividades = React.memo(({esProveedor = false}) => {

  return (
    <div className="actividadesRec">
      <ContActTitle/>
      <hr className="hrGeneral"/>
      {
        !esProveedor
        ?
        <ContListaAct />
        :
        <ContListaActProv />
      }
      
    </div>
  )
});
