import React from "react"
import { ConFavItem } from "./ConFavItem";

export const ContListaFav = ({favoritos}) => {
  
  return (
    <div className="explorarCat__lista">
      {
        favoritos.map(fav => 
          <ConFavItem 
            fav={fav} 
            key={fav.IdProvFavorito}
          />)
      }
    </div>
  )
}
