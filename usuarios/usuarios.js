"use strict";

(function () {
  const usuarioNombre = document.getElementById("usuario-nombre");
  const usuarioContraseña = document.getElementById("usuario-contraseña");
  const usuarioContraseñaConfirmar = document.getElementById("usuario-contraseña-confirmar");

  document.getElementById("usuario-enviar").addEventListener("click", function () {


    if (usuarioContraseña.value !== usuarioContraseñaConfirmar.value) {
      alert("Las contraseñas no coinciden");
    } else {
      fetch("http://127.0.0.1:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuarioNombre.value, contraseña: usuarioContraseña.value })
      }).then(function (respuesta) {
        if (respuesta.ok) {
          alert("Usuario creado con exito");
          usuarioNombre.value = "";
          usuarioContraseña.value = "";
          usuarioContraseñaConfirmar.value = "";
        }
      })
    }
  });
})()