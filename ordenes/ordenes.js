"use strict";

const { ce, reemplazarContenido, crearElemento, cargarListado } = { ...compartido };
const { cargarAutenticacion } = { ...autenticacion };
const { OrdenDetalle } = { ...componentes };

delete window.compartido;
delete window.autenticacion;
delete window.componentes;

const PRINCIPAL = document.querySelector("main");
const PIE = document.querySelector("footer");

let autenticado = false;
let ordenes;

function pintarProducto({ id, nombre, precio }) {
  const padre = crearElemento({
    tipo: "li", clases: ["producto"], atributos: [{ nombre: "data-id", valor: id }], eventos: [{
      nombre: "click",
      manejador: function () {
        this.classList.contains("seleccionado") ? this.classList.remove("seleccionado") : this.classList.add("seleccionado");
      }
    }]
  });

  crearElemento({ tipo: "span", texto: nombre, padre });
  crearElemento({ tipo: "span", texto: `$${precio}`, padre });

  return padre;
};

function mostrarFormulario(contenedor) {
  const padre = crearElemento({ tipo: "form", clases: ["formulario"] });
  const ordenNombre = crearElemento({ tipo: "input", clases: ["formulario__campo"] });

  padre.setAttribute("action", "javascript:void(0)");

  crearElemento({ tipo: "h2", texto: "Nueva Orden", clases: ["formulario__titulo"], padre });
  crearElemento({ tipo: "label", clases: ["formulario__etiqueta"], texto: "Nombre", padre });
  padre.appendChild(ordenNombre);
  crearElemento({ tipo: "h2", texto: "Seleccione los productos", clases: ["formulario__titulo"], padre });

  const productosListado = crearElemento({ tipo: "div", padre });

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

  crearElemento({
    tipo: "button", texto: "Crear", clases: ["boton"], padre, eventos: [{
      nombre: "click",
      manejador: function () {
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
            mostrarOpciones(padre);
          })
      }
    }]
  });

  reemplazarContenido(contenedor, padre);
}

function mostrarOpciones(contenedor) {
  const lista = ce({ x: "ul", c: "ordenes--opciones" });

  ce({
    x: "button", c: ["boton"], t: "Crear Nueva", p: ce({ x: "li", c: ["ordenes--opcion"], p: lista }),
    e: {
      click: function () {
        if (autenticado) {
          mostrarFormulario(contenedor)
          mostrarVolver(() => mostrarOpciones(contenedor));
        } else {
          cargarAutenticacion(
            contenedor,
            () => { autenticado = true, mostrarFormulario(contenedor) },
            () => alert("Credenciales inválidas")
          );
          mostrarVolver(() => mostrarOpciones(contenedor));
        }
      }
    }
  });

  ce({
    x: "button", c: "boton", t: "Ver Listado", p: ce({ x: "li", c: "ordenes--opcion", p: lista }),
    e: { click: () => mostrarOrdenesListado(contenedor) }
  });

  reemplazarContenido(contenedor, lista);
};

function mostrarVolver(funcion) {
  const boton = crearElemento({
    tipo: "button", clases: ["boton-volver"], texto: "Volver", eventos: [{
      nombre: "click",
      manejador: function () {
        funcion();
        reemplazarContenido(document.querySelector("footer"), null);
      }
    }]
  });
  reemplazarContenido(document.querySelector("footer"), boton);
}

function mostrarOrdenesListado(contenedor) {
  fetch("http://127.0.0.1:3000/ordenes")
    .then(respuesta => respuesta.json())
    .then(function (o) {
      ordenes = o;
      const lista = crearElemento({ tipo: "ul", clases: ["lista", "listado__ordenes"] });

      reemplazarContenido(contenedor, cargarListado(lista, ordenes, pintarOrden));
      mostrarVolver(() => mostrarOpciones(contenedor));
    });
}

function mostrarOrdenDetalle(contenedor, orden) {
  new OrdenDetalle(contenedor, orden);

  mostrarVolver(() => mostrarOrdenesListado(contenedor));
}

function pintarOrden({ id, nombre }) {
  return ce({
    x: "li", c: ["listado__orden"], t: nombre, a: [{ nombre: "data-id", valor: id }], e: {
      click: function () { mostrarOrdenDetalle(contenedor, ordenes[this.getAttribute("data-id")]); }
    }
  });
}

const PRODUCTOS_POR_PAGINA = 5;
let productos;
let productosPagina = 0;

mostrarOpciones(PRINCIPAL);