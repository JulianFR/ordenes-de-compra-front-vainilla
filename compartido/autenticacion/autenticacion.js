(function () {
  class Autenticador {
    constructor(contenedor) {
      this.dom = ce({ x: "form", id: "autenticacion" });
      this.usuario = ce({ id: "autenticacion-nombre", x: "input", c: "formulario__campo" });
      this.contraseña = ce({ id: "autenticacion-contraseña", x: "input", c: "formulario__campo", a: [{ nombre: "type", valor: "password" }] });

      p.setAttribute("action", "javascript:void(0)");

      ce({ x: "p", t: "Autentíquese para continuar", p: dom });
      ce({ x: "label", c: "formulario__etiqueta", t: "Usuario", p: dom });
      p.appendChild(usuario);
      ce({ x: "label", c: "formulario__etiqueta", t: "Contraseña", p: dom });
      p.appendChild(contraseña);
      ce({
        x: "button", c: ["formulario__boton", "boton"], t: "Enviar", p: dom, e: {
          click: function (usuario, contraseña) {
            autenticarUsuario(usuario.value, contraseña.value)
              .then(function () {
                usuario.value = "";
                contraseña.value = "";
                exito();
              })
              .catch(function (error) {
                if (error) console.log(error);
                if (fallo) { fallo() };
              });
          }.bind(this, usuario, contraseña)
        }

      });

      this.contenedor = contenedor;
      reemplazarContenido(contenedor, p);
    }

    dibujar() {
      const p = ce({ x: "form", id: "autenticacion" });
      const usuario = ce({ id: "autenticacion-nombre", x: "input", c: "formulario__campo" });
      const contraseña = ce({ id: "autenticacion-contraseña", x: "input", c: "formulario__campo", a: [{ nombre: "type", valor: "password" }] });

      p.setAttribute("action", "javascript:void(0)");

      ce({ x: "p", t: "Autentíquese para continuar", p });
      ce({ x: "label", c: "formulario__etiqueta", t: "Usuario", p });
      p.appendChild(usuario);
      ce({ x: "label", c: "formulario__etiqueta", t: "Contraseña", p });
      p.appendChild(contraseña);
      ce({
        x: "button", c: ["formulario__boton", "boton"], t: "Enviar", p, e: {
          click: function (usuario, contraseña) {
            autenticarUsuario(usuario.value, contraseña.value)
              .then(function () {
                usuario.value = "";
                contraseña.value = "";
                exito();
              })
              .catch(function (error) {
                if (error) console.log(error);
                if (fallo) { fallo() };
              });
          }.bind(this, usuario, contraseña)
        }
      });

      reemplazarContenido(contenedor, p);

    }
  }
  const { ce, reemplazarContenido } = { ...compartido };

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
    const formulario = ce({ id: "autenticacion", x: "form" });
    const usuario = ce({ id: "autenticacion-nombre", x: "input", c: "formulario__campo" });
    const contraseña = ce({ id: "autenticacion-contraseña", x: "input", c: "formulario__campo", a: [{ nombre: "type", valor: "password" }] });

    formulario.setAttribute("action", "javascript:void(0)");

    ce({ x: "p", t: "Autentíquese para continuar", p: formulario });
    ce({ x: "label", c: "formulario__etiqueta", t: "Usuario", p: formulario });
    formulario.appendChild(usuario);
    ce({ x: "label", c: "formulario__etiqueta", t: "Contraseña", p: formulario });
    formulario.appendChild(contraseña);
    ce({
      x: "button", c: ["formulario__boton", "boton"], t: "Enviar", p: formulario, e: {
        click: function (usuario, contraseña) {
          autenticarUsuario(usuario.value, contraseña.value)
            .then(function () {
              usuario.value = "";
              contraseña.value = "";
              exito();
            })
            .catch(function (error) {
              if (error) console.log(error);
              if (fallo) { fallo() };
            });
        }.bind(this, usuario, contraseña)
      }
    });

    reemplazarContenido(contenedor, formulario);
  }

  window.autenticacion = { cargarAutenticacion };
})();