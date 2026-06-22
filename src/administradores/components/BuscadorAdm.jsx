import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks";
import queryString from "query-string";

export const BuscadorAdm = ({tipoBusqueda}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const {q = ""} = queryString.parse(location.search);
  const {searchText, onInputChange} = useForm({searchText: q})

  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`search?q=${searchText}`);
  }

  return (
    <div className="buscador-Adm">
      <form className="buscador__form" onSubmit={onSearchSubmit}>
        <input 
          type="text"
          placeholder={`Buscar ${tipoBusqueda}`}
          className="buscador__input paragraph"
          name="searchText"
          value={searchText}
          onChange={onInputChange}
          autoComplete="off"
        />
        <button 
          className="buscador-Adm__searchBtn" 
          type="submit"
        >
          <span className="material-symbols-rounded icon-white">search</span>
        </button>
      </form>
    </div>
  )
}
