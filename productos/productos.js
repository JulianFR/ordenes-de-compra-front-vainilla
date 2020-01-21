"use strict";

(function () {
  const { cargarListado, crearElemento, reemplazarContenido } = { ...window.compartido };
  const { cargarAutenticacion } = { ...autenticacion };
  delete window.compartido;
  delete window.autenticacion;

  function crearProducto({ id, nombre, precio }) {
    const producto = crearElemento({ tipo: "li", clases: ["producto"] });

    producto.appendChild(crearElemento({ tipo: "span", texto: nombre }));
    producto.appendChild(crearElemento({ tipo: "span", texto: `$${precio}` }));
    producto.setAttribute("data-id", id);

    return producto;
  };

  //ordenes
  function refrescarProductos() {
    fetch("http://127.0.0.1:3000/productos")
      .then(function (respuesta) {
        respuesta
          .json()
          .then(function (productosJson) {
            productos = productosJson;
            productosPagina = 0;
            cargarListado(productosElemento, productos, crearProducto, { pagina: productosPagina, elementosPagina: PRODUCTOS_POR_PAGINA });
          })
      });
  }

  function avanzarPagina(pagina, productosPorPagina) {
    const fin = pagina * productosPorPagina + productosPorPagina;

    return fin < productos.length ? pagina + 1 : pagina;
  }

  function retrocederPagina(pagina) {
    return (pagina <= 0) ? 0 : pagina - 1;
  }

  function crearFormularioProductos() {
    const padre = crearElemento({ tipo: "form", id: "productos-formulario" });
    const nombreCampo = crearElemento({ tipo: "input", clases: ["formulario__campo"] });
    const precioCampo = crearElemento({ tipo: "input", clases: ["formulario__campo"] });

    padre.setAttribute("action", "javascript:void(0)");

    crearElemento({ tipo: "h2", texto: "Nuevo Producto", clases: ["formulario__titulo"], padre });
    crearElemento({ tipo: "label", texto: "Nombre", clases: ["formulario__etiqueta"], padre });
    padre.appendChild(nombreCampo);
    crearElemento({ tipo: "label", texto: "Precio", clases: ["formulario__etiqueta"], padre });
    padre.appendChild(precioCampo);
    crearElemento({
      tipo: "button", texto: "Agregar", clases: ["formulario__boton", "boton"], padre, eventos: [{
        nombre: "click",
        manejador: function () {
          fetch("http://127.0.0.1:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreCampo.value, precio: precioCampo.value })
          }).then(function (respuesta) {
            if (respuesta.ok) {
              nombreCampo.value = "";
              precioCampo.value = "";
              refrescarProductos();
            } else {
              respuesta.text().then(function (cuerpo) { alert(cuerpo); });
            }
          })
        }
      }]
    });

    return padre;
  }

  //ordenes
  const productosElemento = document.getElementById("productos-listado");

  //ordenes
  const PRODUCTOS_POR_PAGINA = 5;

  //ordenes
  let productos;
  //ordenes
  let productosPagina = 0;

  document.getElementById("productos-paginado-anterior").addEventListener("click", function () {
    if (productosPagina !== retrocederPagina(productosPagina)) {
      productosPagina = productosPagina - 1;
      cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, crearProducto);
    }
  });

  document.getElementById("productos-paginado-siguiente").addEventListener("click", function () {
    if (productosPagina !== avanzarPagina(productosPagina, PRODUCTOS_POR_PAGINA)) {
      productosPagina = productosPagina + 1;
      cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, crearProducto);
    }
  });

  const autenticacionContenedor = document.getElementById("autenticacion");

  cargarAutenticacion(autenticacionContenedor, reemplazarContenido.bind(this, autenticacionContenedor, crearFormularioProductos()), () => alert("Credenciales inválidas"));

  refrescarProductos();
})();