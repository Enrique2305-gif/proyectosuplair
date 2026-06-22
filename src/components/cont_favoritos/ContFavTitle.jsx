import React from "react";

export const ContFavTitle = ({ isOpen, onToggle }) => {
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
        grade
      </span>

      <p className="paragraph--mid--2">
        <b>Favoritos</b>
      </p>
    </div>
  );
};