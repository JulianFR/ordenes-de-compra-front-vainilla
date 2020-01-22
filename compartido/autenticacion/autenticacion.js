(function () {
  const { ce } = { ...compartido };

  class Credenciales {
    static usuario;

    static async autenticar(usuario, contraseña) {
      const respuesta = await fetch("http://127.0.0.1:3000/ingresos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuario, contraseña: contraseña })
      });

      if (respuesta.ok) Credenciales.usuario = await respuesta.json();

      return Credenciales.usuario;
    }
  }

  function dibujarFormularioAutenticacion(anteExito) {
    const p = ce({ x: "form", id: "autenticacion", a: { action: "javascript:void(0)" } });

    ce({ x: "p", t: "Autentíquese para continuar", p });
    ce({ x: "label", c: "formulario__etiqueta", t: "Usuario", p });
    const usuario = ce({ id: "autenticacion-nombre", x: "input", c: "formulario__campo", p });
    ce({ x: "label", c: "formulario__etiqueta", t: "Contraseña", p });
    const contraseña = ce({ id: "autenticacion-contraseña", x: "input", c: "formulario__campo", a: { type: "password" }, p });
    ce({
      x: "button", c: ["formulario__boton", "boton"], t: "Enviar", p, e: {
        click: async () => {
          if (await Credenciales.autenticar(usuario.value, contraseña.value)) {
            anteExito();
          } else {
            if (error) console.log(error);
            alert("Credenciales inválidas");
          }
        }
      }
    });
    return p;
  }

  window.autenticacion = { dibujarFormularioAutenticacion, Credenciales };
})();