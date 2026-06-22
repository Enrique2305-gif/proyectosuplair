import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { useForm } from "../../hooks";
import { AccionExitosa } from "./AccionExitosa";
import { ResumenProducto } from "./ResumenProducto";

export const FormSubirProducto = () => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const [imgExists, setImgExists] = useState(false);
  const [imagen, setImagen] = useState();
  const [showResumenProducto, setShowResumenProducto] = useState(false);
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);
  const [categorias, setCategorias] = useState([]);

  //validaciones
  const [esNombreProductoValido, setEsNombreProductoValido] = useState(false);
  const [esDescripcionValido, setEsDescripcionValido] = useState(false);
  const [esCategoriaValido, setEsCategoriaValido] = useState(false);

  const getImg = async (urlImg) => {
    const reader = new FileReader();
    reader.readAsDataURL(urlImg);
    reader.onloadend = () => {
      const base64data = reader.result;
      setImagen(base64data);
    };
  };

  const {
      formState, nombreProducto, descripcion, urlImg, categoria, onInputChange, setNameValueEmpty} = useForm({
        nombreProducto: "", descripcion: "", costoUnitario: 0.00, nombreProveedor: user.Nombre,
        stock: 0, categoria: "Seleccionar categoría", urlImg: "no-img.jpeg",
      });

  const getCategorias = async() => {
    const resp = await fetch(`${apiUrl}/catProductos`);
    const data = await resp.json();
    const {rows: categorias} = !!data && data;
    setCategorias(categorias);
  }

  const onDeleteImg = () => {
    setImgExists(false);
    const inp = document.getElementById("formSubirProdImagen");
    inp.value = "";
    setNameValueEmpty("urlImg");
  }

  useEffect(() => {
    getCategorias();
  }, [])

  useEffect(() => {
    setEsNombreProductoValido(true);
  }, [nombreProducto])
  
  useEffect(() => {
    setEsDescripcionValido(true);
  }, [descripcion])
  
  useEffect(() => {
    setEsCategoriaValido(true);
  }, [categoria])
  
  useEffect(() => {
    //aqui se debe validar el url
    if(urlImg !== "no-img.jpeg"){
      setImgExists(true);
      getImg(urlImg);
    } else {
      setImgExists(false);
    }
  }, [urlImg])

  const validarTodosCampos = () => {
    return new Promise((resolve, reject) => {
      const regexNombreProducto = /^([a-zA-Z0-9 _-àáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ]){3,100}$/;
      const regexDescripcion = /^([a-zA-Z0-9 _-àáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ,.]){3,500}$/;

      if(regexNombreProducto.test(nombreProducto) 
      && regexDescripcion.test(descripcion)
      &&(categoria !== ("Seleccionar categoría" || ""))){
        resolve(true);
      } else {
        setEsNombreProductoValido(regexNombreProducto.test(nombreProducto));
        setEsDescripcionValido(regexDescripcion.test(descripcion));
        setEsCategoriaValido(categoria !== "Seleccionar categoría");
        reject(false);
      }
    })
  }
  
  
  const onContinuarSubirProducto = (e) => {
    e.preventDefault();
    validarTodosCampos()
      .then(res => setShowResumenProducto(true))
      .catch(res => console.log("Producto no valido"))
    ;
  }

  return (
    <form onSubmit={onContinuarSubirProducto}>
      <div className="compraProducto__box">
          <div className="formSubirProducto u-margin-top-small">
            <label align="right" htmlFor="formSubirProdNombre" className="paragraph--smResp paragraph--bold formSubirProducto__label">Nombre</label>
            <div className="formSubirProducto__inputBox">
              <input
                id="formSubirProdNombre"
                type="text"
                placeholder="Nombre del producto"
                className="formSubirProducto__inputBox__input paragraph"
                name="nombreProducto"
                autoComplete="off"
                value={nombreProducto}
                onChange={onInputChange}
                required
              />
              {
                !esNombreProductoValido &&
                <p className="paragraph--red u-padding-left-small">Nombre de producto no válido</p>
              }
            </div>
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label align="right" htmlFor="formSubirProdDescripcion" className="paragraph--smResp paragraph--bold formSubirProducto__label">Descripción</label>
            <div className="formSubirProducto__inputBox">
              <textarea
                id="formSubirProdDescripcion"
                type="text"
                placeholder="Descripción del producto"
                className="formSubirProducto__inputBox__textArea paragraph"
                name="descripcion"
                autoComplete="off"
                value={descripcion}
                onChange={onInputChange}
                required
              />
              {
                !esDescripcionValido &&
                <p className="paragraph--red u-padding-left-small">Descripción no válida</p>
              }
            </div>
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label align="right" htmlFor="formSubirProdCategoria" className="paragraph--smResp paragraph--bold formSubirProducto__label">Categoría</label>
            <div className="formSubirProducto__inputBox">
              <select 
                id="formSubirProdCategoria"
                name="categoria"
                className="formSubirProducto__inputBox__select paragraph"
                onChange={onInputChange}
              >
                <option defaultValue={"none"}>
                  Seleccionar categoría
                </option> 
                {
                  categorias?.map(cat => 
                    <option value={JSON.stringify(cat)} key={cat.IdCatProducto}>
                      {cat.Nombre}
                    </option>)
                }
              </select>
              {
                !esCategoriaValido &&
                <p className="paragraph--red u-padding-left-small">Por favor selecciona una categoría</p>
              }
            </div>
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label align="right" htmlFor="formSubirProdImagen" className="paragraph--smResp paragraph--bold formSubirProducto__label">Foto o imagen</label>
            <div className="formSubirProducto__inputBox">
              <input
                id="formSubirProdImagen"
                type="file"
                placeholder="Subir imagen o foto del producto"
                className="formSubirProducto__inputBox__input paragraph paragraph--grey--2"
                name="urlImg"
                accept="image/*"
                onChange={onInputChange}
              />
            </div>
          </div>
          {imgExists &&
            <div className="formSubirProducto u-margin-top-small">
              <label align="right" htmlFor="formSubirProdImagen" className="paragraph--sm paragraph--bold formSubirProducto__label"></label>
              <div className="formSubirProducto__imgBox">
                <span className="material-symbols-rounded icon-white deleteIconImg" onClick={onDeleteImg}>
                cancel
                </span>
                <img src={imagen} alt={urlImg} className="formSubirProducto__imgBox__img" />
              </div>
            </div>
          }
      </div>

      <div className="metodoPago__btnBox">
        <button
          type="submit" 
          className="btn btn--blue"
        >Continuar</button>
      </div>
      <div>
        {
          showResumenProducto &&
          <ResumenProducto 
            formState={formState} 
            setShowResumenProducto={setShowResumenProducto}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        }
        {
          showAccionExitosa &&
          <AccionExitosa
            texto={'¡Producto subido con éxito!'}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        }
      </div>
    </form>
  )
}
