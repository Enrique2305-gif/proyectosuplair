import React from "react";

export const ContMenuTitleDemands = ({ isOpen, onToggle }) => {
  return (
    <div
      className="explorarCat__title"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <span className="material-symbols-rounded icon--md">
        {isOpen ? "expand_more" : "chevron_right"}
      </span>

      <p className="paragraph--mid--2">
        <b>Menú de demandas</b>
      </p>
    </div>
  );
};