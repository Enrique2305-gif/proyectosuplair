import { useNavigate } from "react-router-dom";

export const InstantaneaExitosa = ({setShowInstantaneaExitosa}) => {


  const navigate = useNavigate();


  

  const onClickAceptar = () => {
    setShowInstantaneaExitosa(false);
    navigate("/comprador",{
      replace: true,
    })
  }

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="metodoPago__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <p className="paragraph u-margin-top-mid">La compra Instantanea se ha realizado con éxito!</p>
        <div className="metodoPago__btnBox u-margin-top-mid">
          <button 
            type="button"
            onClick={onClickAceptar}
            className="btn btn--blue"
          >Aceptar</button>
        </div>
      </div>
    </div>
  )
}