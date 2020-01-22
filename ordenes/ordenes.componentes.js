(function () {
  class OrdenResumen {
    constructor({ total, pedidos }) {
      this.total = total;
      this.pedidos = pedidos.filter(p => p !== undefined && p !== null);
    }

    dibujar() {
      const p = ce({ x: "orden-resumen" });

      this.pedidos.forEach(pedido => {
        const contenedor = ce({ x: "orden-usuario", p });
        ce({ x: "span", c: "resumen__usuario", t: pedido.usuario, p: contenedor });
        ce({ x: "span", c: "resumen__usuario-total", t: `$ ${pedido.total}`, p: contenedor });

        const usuarioPedidos = ce({ x: "orden-pedidos", c: "ocultar", p });

        contenedor.addEventListener("click", () => {
          if (usuarioPedidos.classList.contains("ocultar")) {
            usuarioPedidos.classList.remove("ocultar");
          } else {
            usuarioPedidos.classList.add("ocultar");
          }
        });

        pedido.productos.forEach(producto => {
          const contenedor = ce({ x: "orden-pedido", p: usuarioPedidos })
          ce({ x: "span", c: "resumen__producto", t: `${producto.producto} x ${producto.cantidad}`, p: contenedor });
          ce({ x: "span", c: "resumen__producto-total", t: ` $ ${producto.total}`, p: contenedor });
        })

      })

      ce({ x: "p", c: "resumen__orden-total", t: `Total: $${this.total}`, p });

      return p;
    }

  }

  class OrdenDetalle {
    constructor({ id, nombre, productos = [] }) {
      this.id = id;
      this.nombre = nombre;
      this.productos = productos;
      this.productosDetallados = null;
    }

    async obtenerDetalle() {
      const respuesta = await fetch(`http://127.0.0.1:3000/productos/${this.productos.map(p => p.producto).join(", ")}`)
      const productos = await respuesta.json();

      this.productosDetallados = [];
      productos.forEach(p => this.productosDetallados.push(new OrdenDetalleProducto(p)));
    }

    async obtenerResumen() {
      const respuesta = await fetch(`http://127.0.0.1:3000/ordenes/${this.id}/resumen`);

      return new OrdenResumen(await respuesta.json());
    }

    dibujar() {
      if (!this.productosDetallados) return;

      const p = ce({ x: "orden-detalle" });
      ce({ x: "h2", c: "detalle__nombre", t: this.nombre, p });
      const listado = ce({ x: "ul", c: ["detalle__productos", "lista"], p });

      this.productosDetallados.forEach(p => listado.appendChild(p.dibujar()));

      return p;
    }

    obtenerPedidos() {
      return this.productosDetallados
        .filter(p => p.cantidad > 0)
        .map(p => p.obtenerPedido());
    }
  }

  class OrdenDetalleProducto {
    constructor({ id, nombre, precio, cantidad = 0 }) {
      this.producto = id; this.nombre = nombre, this.precio = precio, this.cantidad = cantidad;
      this.contenedor = ce({ x: "li", c: ["detalle_producto", "producto"] });
    }

    dibujar() {
      let contenedor = this.contenedor;
      const editable = Credenciales.usuario !== undefined && Credenciales.usuario !== null;
      if (editable) {
        ce({ x: "span", t: "-", p: this.contenedor, e: { click: this.disminuirCandtidad.bind(this) } });
        contenedor = ce({ x: "div", c: "producto", p: this.contenedor });
      }

      ce({ x: "span", t: this.nombre, p: contenedor });
      if (editable) this.cantidadElemento = ce({ x: "span", t: `x ${this.cantidad}`, p: contenedor });
      this.totalElemento = ce({ x: "span", t: `$${editable ? this.calcularTotal() : this.precio}`, p: contenedor });

      if (editable) ce({ x: "span", t: "+", p: this.contenedor, e: { click: this.incrementarCantidad.bind(this) } });

      return this.contenedor;
    }

    calcularTotal() {
      return this.precio * this.cantidad;
    }

    incrementarCantidad() {
      this.cantidad++;
      this.cantidadElemento.innerText = `x ${this.cantidad}`;
      this.totalElemento.innerText = `$${this.calcularTotal()}`;
    }

    disminuirCandtidad() {
      this.cantidad = this.cantidad > 0 ? this.cantidad - 1 : 0;
      this.cantidadElemento.innerText = `x ${this.cantidad}`;
      this.totalElemento.innerText = `$${this.calcularTotal()}`;
    }

    obtenerPedido() {
      return this.cantidad ? { producto: this.producto, cantidad: this.cantidad } : null;
    }
  }

  window.componentes = { OrdenDetalle };
})()