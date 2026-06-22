import { Link } from "react-router-dom"
import React from "react";
export const ContListaCat = React.memo(({categorias}) => {

  return (
    <div className="explorarCat__lista">
      {
        categorias?.map(cat => (
          <Link 
            to={`/categoria?q=${cat.IdCatProducto}`} 
            key={cat.IdCatProducto} 
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              {cat.GoogleCodeRoundedIcon}
            </span>
              <p className="paragraph--mid--2">{cat.Nombre}</p>
          </Link>
        ))
      }
    </div>
  )
});
