
import { Link } from "react-router-dom";

export const BotonPanelAdm = ({tipo, nombreLink, googleIcon}) => {
  return (
    <Link 
      to={`/${nombreLink}`} 
      key={nombreLink} 
      className="botonPanelAdm--box"
    >
      <span className="material-symbols-rounded botonPanelAdm--box--icon">
        {googleIcon}
      </span>
        <p className="paragraph--mid--2">{tipo}</p>
    </Link>
  )
}
