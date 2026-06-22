import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { BuscadorAdm, CardUsuario, ContNavegar } from "../components"

export const UsuariosPage = () => {

  const [compradoresTodos, setCompradoresTodos] = useState();
  const showEmptyCTArray = compradoresTodos?.length === 0;

  const [proveedoresTodos, setProveedoresTodos] = useState();
  const showEmptyPTArray = proveedoresTodos?.length === 0;

  const [usuariosTodos, setUsuariosTodos] = useState([]);

  const getUsuariosTodos = async() => {
    const resp = await fetch(`${apiUrl}/usuarios`);
    const data = await resp.json();
    const {rows: usuarios} = !!data && data;
    setUsuariosTodos(usuarios);
  }

  const getCompradoresTodos = () => {
    setCompradoresTodos(usuariosTodos.filter(user => user.IdRol === 1));
  }

  const getProveedoresTodos = () => {
    setProveedoresTodos(usuariosTodos.filter(user => user.IdRol === 2));
  }

  useEffect(() => {
    getUsuariosTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getCompradoresTodos();
    getProveedoresTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuariosTodos])
  

  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Usuarios</h1>
        <hr className="hrGeneral"/>
        <div className="admBusquedaBox">
          <BuscadorAdm tipoBusqueda={"usuarios"}/>
        </div>
        <div className="usuariosContainer">
          <div className="usuariosContainer--col">
            <p className="paragraph"><b>Compradores</b></p>
            <hr className="hrGeneral"/>
            {
              showEmptyCTArray
              ? <p className="paragraph">No hay compradores registrados</p>
              : compradoresTodos?.map(comprador => {
                return <CardUsuario usuario={comprador} key={comprador.IdUsuario}/>
              })
            }
          </div>
          <div className="usuariosContainer--col">
            <p className="paragraph"><b>Proveedores</b></p>
            <hr className="hrGeneral"/>
            {
              showEmptyPTArray
              ? <p className="paragraph">No hay proveedores registrados</p>
              : proveedoresTodos?.map(proveedor => {
                return <CardUsuario usuario={proveedor} key={proveedor.IdUsuario}/>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
