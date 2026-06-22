import { useNavigate } from "react-router-dom";

export const IzqPanelSubCrear = ({
  esSubirProducto = false,
  esCrearOferta = false,
}) => {
  const navigate = useNavigate();

  const onClickCancelar = () => {
    navigate(`/proveedor`);
  };

  return (
    <div className="explorarCat">
      <div className="explorarCat__title">
        <span className="material-symbols-rounded icon--md">expand_more</span>
        {esSubirProducto && (
          <p className="paragraph--mid--2">
            <b>Subir producto</b>
          </p>
        )}
        {esCrearOferta && (
          <p className="paragraph--mid--2">
            <b>Crear oferta</b>
          </p>
        )}
      </div>
      <hr className="hrGeneral" />
      <div className="izqPanelSubCrear__itemBox">
        <span className="material-symbols-rounded icon--md">navigate_next</span>
        {esSubirProducto && (
          <p className="paragraph paragraph--grey">Datos del producto</p>
        )}
        {esCrearOferta && <p className="paragraph paragraph--grey">Oferta</p>}
      </div>
      <div className="izqPanelSubCrear__btnBox u-margin-top-huge u-margin-bottom-small">
        <button className="btn btn--red" onClick={onClickCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
