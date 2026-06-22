import React from "react";

export const ContExpTitle = ({ isOpen, onToggle }) => {
  return (
    <div
      className="explorarCat__title"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <span className="material-symbols-rounded icon--md">
        {isOpen ? "expand_more" : "chevron_right"}
      </span>

      <span className="material-symbols-rounded icon--md">
        explore
      </span>

      <p className="paragraph--mid--2">
        <b>Explorar</b>
      </p>
    </div>
  );
};