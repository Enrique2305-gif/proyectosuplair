import { Link } from "react-router-dom";

export const ProdOfertaButtonBox = () => {

  return (
    <div className="prodOfertaButtonBox">
      <Link
        to={`/subir_producto`}
      >
        <button 
          className="btn btn--green"
        >
          Subir Producto
        </button>
      </Link>
      <Link
        to={`/crear_nueva_oferta`}
      >
        <button 
          className="btn btn--blue"
        >
          Nueva Oferta
        </button>
      </Link>
      
    </div>
  )
}
