(function () {
  const { crearElemento, reemplazarContenido } = { ...compartido };

  function autenticarUsuario(usuario, contraseña) {
    return new Promise(function (resolve, reject) {
      fetch("http://127.0.0.1:3000/ingresos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuario, contraseña })
      }).then(function (respuesta) {
        return (respuesta.ok) ? resolve() : reject();
      });
    });
  };

  function cargarAutenticacion(contenedor, exito, fallo) {
    const formulario = crearElemento({ id: "autenticacion", tipo: "form" });
    const usuario = crearElemento({ id: "autenticacion-nombre", tipo: "input", clases: ["formulario__campo"] });
    const contraseña = crearElemento({ id: "autenticacion-contraseña", tipo: "input", clases: ["formulario__campo"], atributos: [{ nombre: "type", valor: "password" }] });

    formulario.setAttribute("action", "javascript:void(0)");

    crearElemento({ tipo: "p", texto: "Ingrese su usuario y contraseña para crear una nueva orden", padre: formulario });
    crearElemento({ tipo: "label", clases: ["formulario__etiqueta"], texto: "Usuario", padre: formulario });
    formulario.appendChild(usuario);
    crearElemento({ tipo: "label", clases: ["formulario__etiqueta"], texto: "Contraseña", padre: formulario });
    formulario.appendChild(contraseña);
    crearElemento({
      tipo: "button", clases: ["formulario__boton", "boton"], texto: "Enviar", padre: formulario, eventos: [{
        nombre: "click",
        manejador: function (usuario, contraseña) {
          autenticarUsuario(usuario.value, contraseña.value)
            .then(function () {
              usuario.value = "";
              contraseña.value = "";
              exito();
            })
            .catch(function () {
              if (fallo) { fallo() };
            });
        }.bind(this, usuario, contraseña)
      }]
    });

    reemplazarContenido(contenedor, formulario);
  }

  window.autenticacion = { cargarAutenticacion }
})();