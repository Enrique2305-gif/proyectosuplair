import { useState } from "react";
import { Link } from "react-router-dom";
import { ContMenuTitle } from "./ContMenuTitle";
import React from "react";

export const ContListaMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const onToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="actividadesRec">
      <hr className="hrGeneral" />

      <ContMenuTitle isOpen={isOpen} onToggle={onToggleMenu} />

      {isOpen && (
        <div className="explorarCat__lista">
          <Link
            to={`/ofertas_pendientes`}
            key={1}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              autorenew
            </span>
            <p className="paragraph--mid--2">Ofertas pendientes</p>
          </Link>

          <Link
            to={`/ofertas_canceladas`}
            key={2}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              cancel
            </span>
            <p className="paragraph--mid--2">Ofertas canceladas</p>
          </Link>

          <Link
            to={`/ordenes_finalizadas`}
            key={5}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              check_circle
            </span>
            <p className="paragraph--mid--2">Ofertas finalizadas</p>
          </Link>

          <Link
            to={`/ordenes_compra`}
            key={3}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              shopping_bag
            </span>
            <p className="paragraph--mid--2">Órdenes de compra</p>
          </Link>

          <Link
            to={`/ordenes_por_confirmar`}
            key={4}
            className="explorarCat__lista__item"
          >
            <span className="material-symbols-rounded icon--sm">
              thumb_up
            </span>
            <p className="paragraph--mid--2">Órdenes por confirmar</p>
          </Link>
        </div>
      )}
    </div>
  );
};