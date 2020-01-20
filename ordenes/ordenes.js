"use strict";

const { reemplazarContenido, crearElemento, agregarProducto, cargarListado } = { ...compartido };
const { cargarAutenticacion } = { ...autenticacion };
delete window.compartido;
delete window.autenticacion;

const contenedor = document.getElementById("ordenes");

let autenticado = false;

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

  crearElemento({ tipo: "h2", texto: "Nueva Orden", clases: ["formulario__titulo"], padre });
  crearElemento({ tipo: "label", clases: ["formulario__etiqueta"], texto: "Título", padre });
  crearElemento({ tipo: "input", clases: ["formulario__campo"], padre });
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

  crearElemento({ tipo: "button", texto: "Crear", clases: ["boton"], padre });

  reemplazarContenido(contenedor, padre);
}

function mostrarOpciones(contenedor) {
  const lista = crearElemento({ tipo: "ul", clases: ["ordenes--opciones"] });

  crearElemento({
    tipo: "button", clases: ["boton"], texto: "Crear Nueva",
    padre: crearElemento({ tipo: "li", clases: ["ordenes--opcion"], padre: lista }),
    eventos: [{
      nombre: "click",
      manejador: function () {
        if (autenticado) {
          refrescarProductos();
        } else {
          cargarAutenticacion(contenedor, mostrarFormulario.bind(this, contenedor), function () { alert("Credenciales inválidas") });
        }
      }
    }]
  });

  crearElemento({
    tipo: "button", clases: ["boton"], texto: "Ver Listado",
    padre: crearElemento({ tipo: "li", clases: ["ordenes--opcion"], padre: lista })
  });

  reemplazarContenido(contenedor, lista);
};

const productosLista = document.getElementById("productos-listado");

const PRODUCTOS_POR_PAGINA = 5;
let productos;
let productosPagina = 0;

mostrarOpciones(contenedor);
//cargarAutenticacion(document.getElementById("autenticacion"), function () { console.log("SAPE") }, function () { console.log("NO") });

//refrescarProductos(productosLista);
