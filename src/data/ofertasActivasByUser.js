export const ofertasActivasByUser = [
  {
    idOferta: 124,
    idProducto: 1,
    cantMin: 4000,
    cantMax: 5000,
    descripcion: "Consideraciones adicionales de la oferta...",
    actualProductos: 2000,
    fechaLimite: "05/Agosto/2022",
    fechaCreacion: "05/Julio/2022",
    estado: "En Curso",
  }
]

//esta lista no deberia estar, se deberia utilizar la de compraIndividual
//para relacionar compraIndividual (id proveedor) > ofertaComprador (idComprador) > oferta
//verificar de nuevo los atributos de las tablas que se van a relacionar