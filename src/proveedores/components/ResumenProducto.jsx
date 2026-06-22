import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";

export const ResumenProducto = ({formState: productData, setShowResumenProducto, setShowAccionExitosa}) => {

  const [imagen, setImagen] = useState();
  //const d = new Date();

  const {authState: {user}} = useContext(AuthContext);

  const getImg = async (urlImg) => {
    const reader = new FileReader();
    reader.readAsDataURL(urlImg);
    reader.onloadend = () => {
      const base64data = reader.result;
      setImagen(base64data);

    };
  };

  const uploadProduct = async() => {
    const body = { 
      Name: productData.nombreProducto,
      Descripcion: productData.descripcion, 
      Activo: true, 
      Valoracion: 5, 
      IdProveedor: user.IdUsuario,
      IdCatProducto: JSON.parse(productData.categoria).IdCatProducto, 
      UrlImg: imagen,
    }

    const resp = await fetch(`${apiUrl}/productos`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(data);
  }

  useEffect(() => {
    if(productData.urlImg !== "no-img.jpeg")
      getImg(productData.urlImg)
    else
      setImagen("no-img.jpeg")
  }, [productData])
  
  const onSubirProducto = (e) => {
    e.preventDefault();
    uploadProduct();
    setShowResumenProducto(false);
    setShowAccionExitosa(true);
  }

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
      <div className="resumenProducto__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <div className="resumenProducto__ventana__contenido">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid"><b>Resumen del producto</b></p>
          </div>
          <hr className="hrGeneral"/>
          <div className="compraProducto__box">
            <div className="oferta-detalle__productoBox u-margin-top-small">
              { imagen !== ""
                ?
                <img src={imagen} alt={"producto"} className="resumenProducto__ventana__img" />
                :
                <p className="paragraph paragraph--grey">Sin imagen</p>
              }
              <div className="resumenProducto__ventana__descBox">
                <div className="resumenProducto__ventana__descBox__texto">
                  <p className="paragraph"><b>Descripción: </b>{productData.descripcion}</p>
                </div>
              </div>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph"><b>Nombre:</b> {productData.nombreProducto}</p>
            </div>
            
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph"><b>Categoría:</b> {JSON.parse(productData.categoria).Nombre}</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph"><b>Proveedor:</b> {productData.nombreProveedor}</p>
            </div>
            {/* <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Costo unitario: $ {productData.costoUnitario}</p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">Stock: {productData.stock} unidades</p>
            </div> */}
            
          </div>

          <div className="metodoPago__btnBox">
            <button 
              type="button"
              onClick={() => setShowResumenProducto(false)}
              className="btn btn--red"
            >Cancelar</button>
            <button
              type="submit" 
              onClick={onSubirProducto}
              className="btn btn--blue"
            >Continuar</button>
          </div>
        </div>
        
      </div>
    </div>
  )
}
