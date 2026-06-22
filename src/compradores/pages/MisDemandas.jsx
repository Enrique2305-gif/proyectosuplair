import React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth";
import { apiUrl } from "../../apiUrl";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
  DemandaCard,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { obtainUserPermission } from "../../firebase";
import { ProdDemandaButtonBox } from "../components/ProdDemandaButtonBox";
export const MisDemandas = React.memo(() => {
  const {authState} = useContext(AuthContext);
  const {user} = authState;
  const [demandasTodos, setDemandasTodos] = useState([]);

  const getDemandasTodos = async () => {
    const resp = await fetch(`${apiUrl}/demandas?IdComprador=${user?.IdUsuario}`);
    const data = await resp.json();
    const { rows: demandas } = !!data && data;
    setDemandasTodos(demandas.filter((demandas) => demandas.IdEstadosOferta === 1));
  };

  useEffect(() => {
    getDemandasTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  obtainUserPermission();

  const showEmptyArray = demandasTodos.length === 0;

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />
        <ProdDemandaButtonBox />
        <ContExplorar />
        <ContFavoritos />
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid">
              <b>Demandas en curso</b>
            </p>
          </div>
          <hr className="hrGeneral" />
          {showEmptyArray ? (
            <p className="paragraph">
              Aún no has creado ninguna demanda
            </p>
          ) : (
            demandasTodos?.map((demanda) => (
              <DemandaCard
              key={demanda?.IdDemanda}
              demanda={demanda}
              esComprador={true} />
            ))
          )}
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
});