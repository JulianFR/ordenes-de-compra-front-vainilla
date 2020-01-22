"use strict";

const { ce, reemplazarContenido, cargarListado } = { ...compartido };
const { dibujarFormularioAutenticacion, Credenciales } = { ...autenticacion };
const { OrdenDetalle } = { ...componentes };

delete window.compartido;
delete window.autenticacion;
delete window.componentes;

const PRINCIPAL = document.querySelector("main");
const PIE = document.querySelector("footer");

let autenticado = false;
let ordenes;

function pintarProducto({ id, nombre, precio }) {
  const p = ce({
    x: "li", c: "producto", a: { "data-id": id }, e: {
      click: function () {
        this.classList.contains("seleccionado") ? this.classList.remove("seleccionado") : this.classList.add("seleccionado");
      }
    }
  });

  ce({ x: "span", t: nombre, p });
  ce({ x: "span", t: `$${precio}`, p });

  return p;
};

function mostrarFormulario(contenedor) {
  const p = ce({ x: "form", c: "formulario" });
  const ordenNombre = ce({ x: "input", c: "formulario__campo" });

  p.setAttribute("action", "javascript:void(0)");

  ce({ x: "h2", t: "Nueva Orden", c: "formulario__titulo", p });
  ce({ x: "label", c: "formulario__etiqueta", t: "Nombre", p });
  p.appendChild(ordenNombre);
  ce({ x: "h2", t: "Seleccione los productos", c: "formulario__titulo", p });

  const productosListado = ce({ x: "div", p });

  fetch("http://127.0.0.1:3000/productos")
    .then(function (respuesta) {
      respuesta
        .json()
        .then(function (productosJson) {
          productos = productosJson;
          productosPagina = 0;
          cargarListado(productosListado, productos, pintarProducto);
        })
    });

  ce({
    x: "button", t: "Crear", c: ["boton"], p, e: {
      click: function () {
        const nombre = ordenNombre.value.trim();
        const productos = [];
        document
          .querySelectorAll("li.producto.seleccionado")
          .forEach(p => productos.push(p.getAttribute("data-id")));

        if (!nombre) {
          alert("Complete el nombre");
          return;
        }

        if (productos.length === 0) {
          alert("Seleccione al menos un producto");
          return;
        }

        fetch("http://127.0.0.1:3000/ordenes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, productos })
        })
          .then(function (respuesta) {
            if (respuesta.ok) alert("Orden creada con éxito");
            mostrarOpciones(p);
          })
      }
    }
  });

  reemplazarContenido(contenedor, p);
}

function mostrarOpciones(contenedor) {
  const lista = ce({ x: "ul", c: "ordenes--opciones" });

  ce({
    x: "button", c: "boton", t: "Crear Nueva", p: ce({ x: "li", c: "ordenes--opcion", p: lista }), e: {
      click: function () {
        Credenciales.usuario
          ? mostrarFormulario(contenedor)
          : reemplazarContenido(PRINCIPAL, dibujarFormularioAutenticacion(() => mostrarFormulario(contenedor)));

        mostrarVolver(() => mostrarOpciones(contenedor));
      }
    }
  });

  // ce({
  //   x: "button", c: "boton", t: "Ver Listado", p: ce({ x: "li", c: "ordenes--opcion", p: lista }),
  //   e: { click: () => mostrarOrdenesListado(contenedor) }
  // });

  reemplazarContenido(contenedor, lista);

  fetch("http://127.0.0.1:3000/ordenes")
    .then(respuesta => respuesta.json())
    .then(function (o) {
      ordenes = o;
      const lista = ce({ x: "ul", c: ["lista", "listado__ordenes"] });
      PRINCIPAL.appendChild(cargarListado(lista, ordenes, pintarOrden));
    });
};

function mostrarVolver(funcion) {
  const boton = ce({
    x: "button", c: ["boton-volver"], t: "Volver", e: {
      click: function () {
        funcion();
        reemplazarContenido(document.querySelector("footer"), null);
      }
    }
  });
  reemplazarContenido(document.querySelector("footer"), boton);
}

function mostrarOrdenesListado(contenedor) {
  fetch("http://127.0.0.1:3000/ordenes")
    .then(respuesta => respuesta.json())
    .then(function (o) {
      ordenes = o;
      const lista = ce({ x: "ul", c: ["lista", "listado__ordenes"] });

      reemplazarContenido(contenedor, cargarListado(lista, ordenes, pintarOrden));
      mostrarVolver(() => mostrarOpciones(contenedor));
    });
}

function mostrarOrdenDetalle(contenedor, orden) {
  const ordenDetalle = new OrdenDetalle(orden);

  ordenDetalle
    .obtenerDetalle()
    .then(() => {
      reemplazarContenido(PRINCIPAL, ordenDetalle.dibujar());
      PRINCIPAL.appendChild(ce({
        x: "button", c: "boton", t: "Hacer un Pedido", e: {
          click: async () => {
            if (!Credenciales.usuario) {
              reemplazarContenido(PRINCIPAL, dibujarFormularioAutenticacion(() => mostrarOrdenDetalle(contenedor, orden)));
            } else {
              const pedidos = ordenDetalle.obtenerPedidos();

              if (pedidos.length) {
                const respuesta = await fetch("http://127.0.0.1:3000/pedidos", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ usuario: Credenciales.usuario.id, orden: orden.id, pedidos })
                });

                if (respuesta.ok) {
                  alert("Pedido creado con éxito");
                  mostrarOpciones(PRINCIPAL);
                }
              }
            }
          }
        }
      }));
      PRINCIPAL.appendChild(ce({
        x: "button", c: "boton", t: "Ver Pedidos", e: {
          click: async () => reemplazarContenido(PRINCIPAL, (await ordenDetalle.obtenerResumen()).dibujar())
        }
      }));
    });

  mostrarVolver(() => mostrarOpciones(contenedor));
}

function pintarOrden({ id, nombre }) {
  return ce({
    x: "li", c: "listado__orden", t: nombre, a: { "data-id": id }, e: {
      click: function () { mostrarOrdenDetalle(PRINCIPAL, ordenes[this.getAttribute("data-id")]); }
    }
  });
}

const PRODUCTOS_POR_PAGINA = 5;
let productos;
let productosPagina = 0;

mostrarOpciones(PRINCIPAL);