"use strict";

(function () {
  const { autenticarUsuario, cargarListado, crearElemento, agregarProducto } = { ...window.compartido };
  delete window.compartido;

  //ordenes
  function refrescarProductos() {
    fetch("http://127.0.0.1:3000/productos")
      .then(function (respuesta) {
        respuesta
          .json()
          .then(function (productosJson) {
            productos = productosJson;
            productosPagina = 0;
            cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, agregarProducto);
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
    const formulario = crearElemento({ tipo: "form" });
    const nombreCampo = crearElemento({ tipo: "input", clases: ["formulario__campo"] });
    const precioCampo = crearElemento({ tipo: "input", clases: ["formulario__campo"] });

    formulario.setAttribute("action", "javascript:void(0)");
    formulario.appendChild(crearElemento({ tipo: "h2", texto: "Nuevo Producto", clases: ["formulario__titulo"] }));
    formulario.appendChild(crearElemento({ tipo: "label", texto: "Nombre", clases: ["formulario__etiqueta"] }));
    formulario.appendChild(nombreCampo);
    formulario.appendChild(crearElemento({ tipo: "label", texto: "Precio", clases: ["formulario__etiqueta"] }));
    formulario.appendChild(precioCampo);
    formulario.appendChild(crearElemento({
      tipo: "button", texto: "Agregar", clases: ["formulario__boton", "boton"], eventos: [{
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
    }));

    document.getElementById("productos").insertBefore(formulario, document.getElementById("productos-listado"));
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
      cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, agregarProducto);
    }
  });

  document.getElementById("productos-paginado-siguiente").addEventListener("click", function () {
    if (productosPagina !== avanzarPagina(productosPagina, PRODUCTOS_POR_PAGINA)) {
      productosPagina = productosPagina + 1;
      cargarListado(productosElemento, productos, productosPagina, PRODUCTOS_POR_PAGINA, agregarProducto);
    }
  });

  document.getElementById("autenticacion-enviar").addEventListener("click", function () {
    const nombre = document.getElementById("autenticacion-nombre").value;
    const contraseña = document.getElementById("autenticacion-contraseña").value;

    autenticarUsuario(nombre, contraseña)
      .then(function () {
        document.getElementById("autenticacion").remove();
        crearFormularioProductos();
      })
      .catch(function () {
        alert("Credenciales inválidas");
      });
  });

  refrescarProductos();
})();