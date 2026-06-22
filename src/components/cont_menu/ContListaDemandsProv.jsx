import { useState } from "react";
import { ContMenuTitleDemands } from "./ContMenuTitleDemands";
import { Link } from "react-router-dom";
import React from "react";

export const ContListaDemandsProv = () => {
  const [isOpen, setIsOpen] = useState(true);

  const onToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="actividadesRec">
      <hr className="hrGeneral" />

      <ContMenuTitleDemands isOpen={isOpen} onToggle={onToggleMenu} />

      {isOpen && (
        <div className="explorarCat__lista">
          <Link
            to={`/demandas`}
            key={1}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              autorenew
            </span>
            <p className="paragraph--mid--2">Explorar demandas</p>
          </Link>
        </div>
      )}
    </div>
  );
};