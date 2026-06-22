import { Link } from "react-router-dom";
import React from "react"

export const ProdDemandaButtonBox = () => {
  return (
    <div className="prodOfertaButtonBox">
      <Link to={`/subir_producto`}>
        <button className="btn btn--green">Subir Producto</button>
      </Link>
      <Link to={`/crear_demanda`}>
        <button className="btn btn--purple">Nueva Demanda</button>
      </Link>
    </div>
  );
};
