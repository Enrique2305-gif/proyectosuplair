import React from "react"
import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { useForm } from "../../hooks";

export const ReportarCompra = ({setShowVentanaReportar, setShowReporteEnviado, oferta, producto}) => {

  const { motivoReporte, descripcion, onInputChange} = useForm({motivoReporte: "", descripcion: ""});

  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const [esMotivoValido, setEsMotivoValido] = useState(false);
  const [esDescripcionValido, setEsDescripcionValido] = useState(false);

  const validarTodosCampos = async() => {
    return new Promise((resolve, reject) => {
      const regexDescripcion = /^([a-zA-Z0-9 _-àáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ,.]){3,500}$/;
      const cond1 = regexDescripcion.test(descripcion);
      const cond2 = motivoReporte !== "Ninguno";

      if( cond1 && cond2)
        resolve(true);
      else {
        setEsDescripcionValido(cond1);
        setEsMotivoValido(cond2);
        reject(false);
      }
    })
  }

  const crearReporte = async() => {
    //IdComprador, IdOferta, Motivo, Descripcion, IdCompra
    const body = { 
      IdComprador: user?.IdUsuario,
      IdOferta: oferta?.IdOferta,
      Descripcion: descripcion, 
      Motivo: motivoReporte,
      IdCompra: null,
    }

    const resp = await fetch(`${apiUrl}/reportes`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(data);
  }

  const onClickReportarConfirmar = async(e) => {
    e.preventDefault();
    await validarTodosCampos()
      .then( async(res) => {
        await crearReporte();
        setShowVentanaReportar(false);
        setShowReporteEnviado(true);
      })
      .catch(res => console.warn(res));
  }

  useEffect(() => {
    setEsMotivoValido(true);
  }, [motivoReporte])
  

  useEffect(() => {
    setEsDescripcionValido(true);
  }, [descripcion])

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="reportaOferta__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <form onSubmit={onClickReportarConfirmar}>
          <div className="reportaOferta__box">
            <div className="explorarCat__title">
              <p className="paragraph--mid"><b>Reportar oferta: {producto?.Name}</b></p>
            </div>
            
            <label 
              htmlFor="formReporteMotivo" 
              align="left" 
              className="paragraph--sm reportaOferta__box__label"
            >
              Selecciona el motivo del reporte:
            </label>
            <select 
              id="formReporteMotivo"
              name="motivoReporte"
              className="formRegistrarComp__input paragraph"
              onChange={onInputChange}
            >
              <option defaultValue={"none"}> Ninguno </option> 
              <option value="ofensivo"> Publicación ofensiva </option>
              <option value="otro"> Otra razón</option>
            </select>
            {
              !esMotivoValido &&
              <p className="paragraph--red u-padding-left-small">Por favor seleccione un motivo</p>
            }
          
            <label 
              htmlFor="formReporteDesc" 
              align="left" 
              className="paragraph--sm reportaOferta__box__label"
            >
              Escribe más detalles del reporte:
            </label>
            <textarea
              id="formReporteDesc"
              type="text"
              placeholder="Descripción del reporte"
              className="formSubirProducto__inputBox__textArea paragraph reportaOferta__box__inputBox"
              name="descripcion"
              autoComplete="off"
              value={descripcion}
              onChange={onInputChange}
              required
            />
            {
              !esDescripcionValido &&
              <p className="paragraph--red u-padding-left-small">Descripción no válida</p>
            }
           
            <div className="reportaOferta__btnBox">
              <button 
                type="button"
                onClick={() => setShowVentanaReportar(false)}
                className="btn btn--blue"
              >Cancelar</button>
              <button
                type="submit" 
                className="btn btn--red"
              >Reportar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
