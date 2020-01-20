(function () {
  function crearElemento({ id, tipo, texto, clases, eventos, padre, atributos }) {
    const elemento = document.createElement(tipo);

    if (id) { elemento.id = id; }
    if (texto) { elemento.innerText = texto; }
    if (clases) { clases.forEach(clase => elemento.classList.add(clase)); }
    if (eventos) {
      eventos.forEach(({ nombre, manejador }) => {
        if (nombre && manejador) { elemento.addEventListener(nombre, manejador); }
      });
    }
    if (atributos) {
      atributos.forEach(({ nombre, valor }) => {
        if (nombre && valor) { elemento.setAttribute(nombre, valor); }
      });
    }
    if (padre) { padre.appendChild(elemento); }

    return elemento;
  };

  function cargarListado(lista, elementos, conversorHtml, { pagina = 0, elementosPagina } = {}) {
    let elementosMostrados;
    if (elementosPagina) {
      const comienzo = elementosPagina * pagina;
      const fin = comienzo + elementosPagina;

      elementosMostrados = elementos.slice(comienzo, fin);
    } else {
      elementosMostrados = elementos;
    }

    while (lista.hasChildNodes()) lista.removeChild(lista.firstChild);

    elementosMostrados.forEach(elemento => lista.appendChild(conversorHtml(elemento)));
  };

  function agregarProducto({ id, nombre, precio }) {
    const producto = crearElemento({ tipo: "li", clases: ["producto"] });

    producto.appendChild(crearElemento({ tipo: "span", texto: nombre }));
    producto.appendChild(crearElemento({ tipo: "span", texto: `$${precio}` }));
    producto.setAttribute("data-id", id);

    return producto;
  };

  function reemplazarContenido(contenedor, contenido) {
    while (contenedor.hasChildNodes()) { contenedor.removeChild(contenedor.firstChild) };

    contenedor.appendChild(contenido);
  }

  function mostrarNavegacion(ocultar = false) {
    document.getElementById("navegacion-mostrar").style.display = ocultar ? "block" : "none";
    document.getElementById("navegacion-enlaces").style.display = ocultar ? "none" : "flex";
  }

  document.getElementById("navegacion-mostrar").addEventListener("click", function () {
    mostrarNavegacion();
    setTimeout(mostrarNavegacion.bind(this, true), 5000);
  });

  window.compartido = { crearElemento, agregarProducto, cargarListado, reemplazarContenido };
})()