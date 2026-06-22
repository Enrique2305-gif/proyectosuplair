import React from "react"

export const ValoracionStar = ({cant_estrellas}) => {

  return (
    <div className="estrellasbox">
      <div className="estrellasbox__starOnbox">
      {
        Array.from({length: cant_estrellas}, (_, i) => (
          <span 
            key={i}
            className="material-symbols-rounded estrellasbox__starOn icon--md--2"
          >star</span>
        ))
      }
      </div>
      <div className="estrellasbox__starOffbox">
      {
        Array.from({length: 5 - cant_estrellas}, (_, i) => (
          <span 
            key={i}
            className="material-symbols-rounded estrellasbox__starOff icon--md--2"
          >star</span>
        ))
      }
      </div>
    </div>
  )
}
