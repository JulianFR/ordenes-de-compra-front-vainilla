(function () {
  function ce({ x, i, c, t, e, a, p }) {
    return crearElemento({ tipo: x, id: i, clases: c, texto: t, eventos: e, atributos: a, padre: p });
  };

  function crearElemento({ id, tipo, texto, clases, eventos = {}, padre, atributos = {} }) {
    const elemento = document.createElement(tipo);

    if (id) { elemento.id = id; }
    if (texto) { elemento.innerText = texto; }
    if (clases) {
      if (typeof (clases) === "string") elemento.className = clases;
      else if (Array.isArray(clases)) clases.forEach(clase => elemento.classList.add(clase));
    }

    for (const clave in eventos) elemento.addEventListener(clave, eventos[clave]);
    for (const clave in atributos) elemento.setAttribute(clave, atributos[clave]);

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

    elementosMostrados.forEach(elemento => lista.appendChild(conversorHtml ? conversorHtml(elemento) : elemento.dibujar()));
    return lista;
  };

  function reemplazarContenido(contenedor, contenido) {
    while (contenedor.hasChildNodes()) { contenedor.removeChild(contenedor.firstChild) };

    if (contenido !== null && contenido !== undefined) contenedor.appendChild(contenido);
  }

  function mostrarNavegacion(ocultar = false) {
    document.getElementById("navegacion-mostrar").style.display = ocultar ? "block" : "none";
    document.getElementById("navegacion-enlaces").style.display = ocultar ? "none" : "flex";
  }

  document.getElementById("navegacion-mostrar").addEventListener("click", function () {
    mostrarNavegacion();
    setTimeout(mostrarNavegacion.bind(this, true), 5000);
  });

  window.compartido = { ce, crearElemento, cargarListado, reemplazarContenido };
})()