(function () {
  class OrdenDetalle {
    constructor(contenedor, { id, nombre, productos = [] }) {
      this.id = id, this.nombre = nombre, this.contenedor = contenedor;

      fetch(`http://127.0.0.1:3000/productos/${productos.map(p => p.producto).join(", ")}`)
        .then(respuesta => respuesta.json())
        .then(productos => {
          this.productos = productos.map(p => new OrdenDetalleProducto({ ...p, editable: autenticado }));
          this.dibujar();
        })
    }

    dibujar() {
      reemplazarContenido(this.contenedor, null);
      ce({ x: "h2", c: "detalle__nombre", t: this.nombre, p: this.contenedor });
      cargarListado(ce({ x: "ul", c: ["detalle__productos", "lista"], p: this.contenedor }), this.productos);
      ce({
        x: "button", c: ["boton", "detalle__boton"], t: "Crear Pedido", p: this.contenedor, e: {
          click: function () {
            if (!autenticado) {
              cargarAutenticacion(
                this.contenedor,
                () => { autenticado = true, this.dibujar },
                () => alert("Credenciales inválidas")
              );
              mostrarVolver(function () { this.dibujar }.bind(this));
            }
          }.bind(this)
        }
      });
    }
  }

  class OrdenDetalleProducto {
    constructor({ id, nombre, precio, cantidad = 0, editable = false }) {
      this.id = id; this.nombre = nombre, this.precio = precio, this.cantidad = cantidad; this.editable = editable;
      this.contenedor = ce({ x: "li", c: ["detalle_producto", "producto"], a: [{ nombre: "data-id", valor: id }] });
    }

    dibujar() {
      reemplazarContenido(this.contenedor, null);
      let contenedor = this.contenedor;
      if (this.editable) {
        ce({ x: "span", t: "-", p: this.contenedor, e: { click: this.disminuirCandtidad.bind(this) } });
        contenedor = ce({ x: "div", c: "producto", p: this.contenedor });
      }

      ce({ x: "span", t: this.nombre, p: contenedor });
      if (this.editable) ce({ x: "span", t: `x ${this.cantidad}`, p: contenedor });
      ce({ x: "span", t: `$${(this.editable ? this.calcularTotal() : this.precio)}`, p: contenedor });

      if (this.editable) ce({ x: "span", t: "+", p: this.contenedor, e: { click: this.incrementarCantidad.bind(this) } });

      return this.contenedor;
    }

    calcularTotal() {
      return this.precio * this.cantidad
    }

    incrementarCantidad() {
      this.cantidad++;
      this.dibujar();
    }

    disminuirCandtidad() {
      this.cantidad = this.cantidad > 0 ? this.cantidad - 1 : 0;
      this.dibujar();
    }

    editar(valor = true) {
      if (this.editable === valor) return;

      this.editable = !this.editable;
      this.dibujar();
    }
  }

  window.componentes = { OrdenDetalle };
})()