import React from 'react'
import { Link } from 'react-router-dom';

export const ContListaNav = () => {

  const listaOpcionesNav = [
    {
      title: "Panel Principal",
      nombreLink: "administrador",
      googleIcon: "dashboard",
    },
    {
      title: "Reportes",
      nombreLink: "reportes",
      googleIcon: "flag",
    }, 
    {
      title: "Usuarios",
      nombreLink: "usuarios",
      googleIcon: "group",
    }, 
    {
      title: "Registros",
      nombreLink: "solicitudes_registro",
      googleIcon: "person_add",
    }, 
    {
      title: "Ofertas",
      nombreLink: "ofertas",
      googleIcon: "local_library",
    }, 
    {
      title: "Pagos",
      nombreLink: "pagos",
      googleIcon: "payments",
    }
  ];

  const showEmptyArray = listaOpcionesNav?.length === 0;

  return (
    <div className="actividadesRec__lista">
      {showEmptyArray
        ? <p className="paragraph">No hay opciones</p>
        :
        listaOpcionesNav?.map(opcion => {
          return( 
            <Link 
                to={`/${opcion.nombreLink}`} 
                key={opcion.title}
                className="ContListaNav--Item" 
              >
              <div className="explorarCat__title">
                <span className="material-symbols-rounded icon--md">
                  {opcion.googleIcon}
                </span>
                <p className="paragraph">{opcion.title}</p>
              </div>
            </Link>)
        })
      }
    </div>
  )
}
