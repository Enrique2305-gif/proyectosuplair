import { useState } from "react"
import { ContListaNav } from "./ContListaNav"

export const ContNavegar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button 
        className="hamburguesaBtn" 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="material-symbols-rounded icon--lg">
          {isMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isMenuOpen && (
        <div 
          className="menuOverlay" 
          onClick={toggleMenu}
        />
      )}

      {/* Menú de navegación */}
      <div className={`contNavegarAdm ${isMenuOpen ? 'contNavegarAdm--open' : ''}`}>
        <div className="explorarCat__title">
          <span className="material-symbols-rounded icon--md">
            moving
          </span>
          <p className="paragraph--mid--2"><b>Navegación</b></p>
        </div>
        <hr className="hrGeneral"/>
        <ContListaNav/>
      </div>
    </>
  )
}
