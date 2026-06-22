import React, { useState } from "react";
import { apiUrl } from "../../apiUrl";
import { useFetch } from "../../hooks";
import { Cargando } from "../generales";
import { ContExpTitle } from "./ContExpTitle";
import { ContListaCat } from "./ContListaCat";

export const ContExplorar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(true);

  const { data, isLoading } = useFetch(`${apiUrl}/catProductos`);
  const { rows: categorias } = !!data && data;

  const onToggleExplorar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="explorarCat">
      <ContExpTitle isOpen={isOpen} onToggle={onToggleExplorar} />

      {isOpen && (
        <>
          <hr className="hrGeneral" />

          {isLoading ? (
            <Cargando />
          ) : (
            <ContListaCat categorias={categorias} />
          )}
        </>
      )}
    </div>
  );
});