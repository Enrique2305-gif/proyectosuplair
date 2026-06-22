import React from "react";
import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { Cargando } from "../generales";
import { ContFavTitle } from "./ContFavTitle";
import { ContListaFav } from "./ContListaFav";

export const ContFavoritos = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { authState } = useContext(AuthContext);
  const {
    user: { IdUsuario },
  } = authState;

  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getFavoritos = async () => {
    setIsLoading(true);

    const resp = await fetch(
      `${apiUrl}/provFavoritos?idUsuarioComp=${IdUsuario}`
    );

    const data = await resp.json();
    const { rows: favoritos } = data;

    const favoritosFiltrados = favoritos.filter(
      (fav) => Number(fav.IdUsuarioProv) !== Number(IdUsuario)
    );

    setFavoritos(favoritosFiltrados);
    setIsLoading(false);
  };

  useEffect(() => {
    getFavoritos();
    // eslint-disable-next-line
  }, [IdUsuario]);

  const onToggleFavoritos = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="favoritosProv">
      <ContFavTitle isOpen={isOpen} onToggle={onToggleFavoritos} />

      {isOpen && (
        <>
          <hr className="hrGeneral" />

          {isLoading ? (
            <Cargando />
          ) : (
            <ContListaFav favoritos={favoritos} />
          )}
        </>
      )}
    </div>
  );
};