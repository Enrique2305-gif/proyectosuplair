import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { useForm } from "../../hooks";

export const CalificarProducto = ({compra, setShowAccionExitosa}) => {

  const navigate = useNavigate();

  const {rate, onInputChange} = useForm({});
  const [oferta, setOferta] = useState();
  const [producto, setProducto] = useState();

  const getOferta = async() => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${compra.IdOferta}`);
    const data = await resp.json();
    const {rows: oferta} = !!data && data;
    setOferta(oferta[0]);
  }

  const getProducto = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${oferta.IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    console.log(producto)
    setProducto(producto[0]);
  }

  useEffect(() => {
    !!oferta && getProducto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])
  

  useEffect(() => {
    getOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compra]);

  const changeProductRating = async() => {
    const nuevoRating = ((producto?.Valoracion + parseInt(rate))/2).toFixed(2);
    const nuevoRating2 = Math.floor(nuevoRating);

    const body = { 
      idProducto: oferta?.IdProducto,
      ValoracionNueva: nuevoRating2,
    }
    const resp = await fetch(`${apiUrl}/productos`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(!!data && "cambiando valoracion producto");
    setShowAccionExitosa(false);
    navigate(`/comprador`);
  }

  const onSubmitValoracion = (e) => {
    e.preventDefault();
    !!producto && 
      changeProductRating();
  }

  return (
    <form onSubmit={onSubmitValoracion}>
      <div className="calificarProductoBox__outer">
        <div className="calificarProductoBox">
          <input type="radio" id="star5" name="rate" value="5" onChange={onInputChange}/>
          <label htmlFor="star5" title="text">5 stars</label>
          <input type="radio" id="star4" name="rate" value="4" onChange={onInputChange}/>
          <label htmlFor="star4" title="text">4 stars</label>
          <input type="radio" id="star3" name="rate" value="3" onChange={onInputChange}/>
          <label htmlFor="star3" title="text">3 stars</label>
          <input type="radio" id="star2" name="rate" value="2" onChange={onInputChange}/>
          <label htmlFor="star2" title="text">2 stars</label>
          <input type="radio" id="star1" name="rate" value="1" onChange={onInputChange}/>
          <label htmlFor="star1" title="text">1 star</label>
        </div>
      </div>
      
      <div className="metodoPago__btnBox">
        <button 
          type="submit"
          className="btn btn--blue"
        >Aceptar</button>
      </div>
    </form>

  )
}
