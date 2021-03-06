"use strict";

(function () {
  const { cargarListado, crearElemento, ce, reemplazarContenido } = { ...window.compartido };
  const { Credenciales, dibujarFormularioAutenticacion } = { ...autenticacion };
  delete window.compartido;
  delete window.autenticacion;

  function crearProducto({ id, nombre, precio }) {
    const producto = crearElemento({ x: "li", c: ["producto"] });

    producto.appendChild(crearElemento({ x: "span", t: nombre }));
    producto.appendChild(crearElemento({ x: "span", t: `$${precio}` }));
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
    const p = ce({ x: "form", i: "productos-formulario", a: { action: "javascript:void(0)" } });

    ce({ x: "h2", t: "Nuevo Producto", c: "formulario__titulo", p });
    ce({ x: "label", t: "Nombre", c: "formulario__etiqueta", p });
    const nombreCampo = ce({ x: "input", c: "formulario__campo", p });
    ce({ x: "label", t: "Precio", c: "formulario__etiqueta", p });
    const precioCampo = ce({ x: "input", c: "formulario__campo", p });
    ce({
      x: "button", t: "Agregar", c: ["formulario__boton", "boton"], p, e: {
        click: function () {
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
      }
    });

    return p;
  }

  //ordenes
  const productosElemento = document.getElementById("productos-listado");

  //ordenes
  const PRODUCTOS_POR_PAGINA = 5;

  //ordenes
  let productos;
  //ordenes
  let productosPagina = 0;

  // document.getElementById("productos-paginado-anterior").addEventListener("click", function () {
  //   if (productosPagina !== retrocederPagina(productosPagina)) {
  //     productosPagina = productosPagina - 1;
  //     cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, crearProducto);
  //   }
  // });

  // document.getElementById("productos-paginado-siguiente").addEventListener("click", function () {
  //   if (productosPagina !== avanzarPagina(productosPagina, PRODUCTOS_POR_PAGINA)) {
  //     productosPagina = productosPagina + 1;
  //     cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, crearProducto);
  //   }
  // });

  const PRINCIPAL = document.querySelector("main");

  reemplazarContenido(PRINCIPAL, dibujarFormularioAutenticacion(() => reemplazarContenido(PRINCIPAL, crearFormularioProductos())));

  refrescarProductos();
})();