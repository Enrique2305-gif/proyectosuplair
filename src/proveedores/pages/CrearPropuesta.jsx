import { ContActividades } from "../../components"
import { FormCrearPropuesta } from "../components"
import { IzqPanelSubCrear } from "../components/IzqPanelSubCrear"
import { useLocation } from 'react-router-dom';

export const CrearPropuesta = (props) => {
    const location = useLocation();
    const { state = {} } = location;
    const urlImg = state.urlImg || "/no-img.jpeg";
    const Minimo = state.Minimo || 0;
    const Maximo = state.Maximo || 0;
    const IdDemanda = state.IdDemanda;
    const cantMax = state.cantMax || 0;

    return (
        <div className="comp-main-container u-margin-top-navbar">
            <div className="comp-main-container__izqCont">
                <IzqPanelSubCrear esCrearOferta={true} />
            </div>
            <div className="comp-main-container__divSepIzq"></div>
            <div className="comp-main-container__medCont">
                <div className="comp-main-container__medCont__ofertas">
                    <div className="explorarCat__title">
                        <span className="material-symbols-rounded icon-grey icon--sm">
                            arrow_forward_ios
                        </span>
                        <p className="paragraph--mid">
                            <b>Datos de la Propuesta</b>
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                        <div style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                        <img className="oferta-card__imgbox__img" src={urlImg} alt="Producto de la demanda" style={{ width: '150px', height: '100px' }}/>
                        </div>
                        <div style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Minimo:</p>
                            <p style={{ fontSize: '18px' }}>{Minimo}</p>
                        </div>
                        <div style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Maximo:</p>
                            <p style={{ fontSize: '18px' }}>{Maximo}</p>
                        </div>
                        <div style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Productos Pedidos:</p>
                            <p style={{ fontSize: '18px' }}>{cantMax}</p>
                        </div>
                    </div>
                    <hr className="hrGeneral" />
                    <FormCrearPropuesta urlImg={urlImg} Minimo={Minimo} Maximo={Maximo} cantMax={cantMax} IdDemanda={IdDemanda}/>
                </div>
            </div>
            <div className="comp-main-container__divSepDer"></div>
            <div className="comp-main-container__derCont">
                <ContActividades esProveedor={true} />
            </div>
        </div>
    );
};
