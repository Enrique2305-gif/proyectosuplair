
import { ContListaMenu } from "./ContListaMenu"
import { ContListaDemands } from "./ContListaDemands"
import { useContext } from "react"
import { AuthContext } from "../../auth"
import React from "react"
import { ContListaDemandsProv } from "./ContListaDemandsProv"
export const ContMenu = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  // Determinar si el usuario es proveedor basándose en su IdRol
  const esProveedor = user?.Rol === "proveedor";
  return (
 <div>
  <div>{
    !esProveedor
        ?
      <div>
    <ContListaMenu/>
    <ContListaDemands/>
    </div>
        :
        <div>
      <ContListaMenu/>
      <ContListaDemandsProv />
      </div>
   }
    </div>
  </div>
  )
}
export default React.memo(ContMenu);