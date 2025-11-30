const CATALOGO = {
    "Laptop": 12000.00,
    "Audiculares": 500.00,
    "Mouse": 300.00
};

const PROMOCIONES = {
    "DES10": 0.10,
    "VER20": 0.20,
    "VIP50": 0.50
};


function validarPedido(cliente, producto, cantidad){
    if(typeof cliente !== 'string' || cliente.trim() === ''){
        throw new Error("Error: El nombre del cliente es inválido");
    }

    if(!CATALOGO.hasOwnProperty(producto)){
        throw new Error(`Error: El producto '${producto}' no existe`);
    }

    if(!Number.isInteger(cantidad) || cantidad <= 0){
        throw new Error("Error: La cantidad es inválida");
    }

    return true;
}

const obtenerPrecioUnitario = (producto) => {
    return CATALOGO[producto];
};

const calcularDescuento = (subtotal, codigoPromo) => {
    //Si no hay codigo, el descuento es 0
    if(!codigoPromo || typeof codigoPromo !== 'string'){
        return 0;
    }

    //Por si acaso
    const codigo = codigoPromo.toUpperCase();

    if(PROMOCIONES.hasOwnProperty(codigo)){
        const porcentaje = PROMOCIONES[codigo];
        console.log(`Código '${codigo}' aplicado: ${porcentaje * 100} de descuento.`)
        return subtotal * porcentaje
    }else{
        console.log(`El código '${codigoPromo}' no es válido`)
        return 0;
    }
}

const procesarPedido = (cliente, producto, cantidad, codigoPromo) => {
    console.group(`Procesando pedido para: ${cliente}`)
    try{
        //1. Validamos el pedido
        validarPedido(cliente, producto, cantidad);

        //2. Calculos
        const precioUnitario = obtenerPrecioUnitario(producto)
        const subtotal = precioUnitario * cantidad;
        const descuento = calcularDescuento(subtotal, codigoPromo);
        const total = subtotal - descuento;
        const iva = total * 0.16;
        const totalFinal = total + iva;

        //3. Generamos un reporte
        const reporte = {
            estado: "Exitoso",
            cliente: cliente,
            detalle: {
                producto: producto,
                cantidad: cantidad,
                precioUnitario: precioUnitario.toFixed(2),
            },
            financiero: {
                subtotal: subtotal.toFixed(2),
                descuentoAplicado: descuento.toFixed(2),
                subtotalConDescuento: total.toFixed(2),
                impuesto: iva.toFixed(2),
                totalPagar: totalFinal.toFixed(2)
            }
        };

        //4. Imprimimos en consola
        console.log("Resumen del pedido: ");
        console.table(reporte.detalle);
        console.table(reporte.financiero);

        return reporte;
    }catch(error){
        console.error("Fallo en el procesamiento: ", error.message);
        return { estado: "Error", mensaje: error.mensaje };
    } finally {
        console.groupEnd();
    }
}

    //Casos de prueba, ejecutandose al cargar
    console.log(" --- Iniciando sistema de pedidooos --- ")

    //1. Válido con descuento
    procesarPedido("Pedro Sola", "Laptop", 2, "VER20")

    //2. Válido sin descuento
    procesarPedido("Lupita tiktok", "Audiculares", 1)

    //1. Válido con código inválido
    procesarPedido("Florinda Meza", "Mouse", 3, "FAKE20")

    //4. Producto inexistente
    procesarPedido("Angela Aguilar", "Marido Ajeno", 1)

    //5. Error - Cantidad inválida
    procesarPedido("Nata Cano", "Audiculares", -9)

    //6. Error - Tipo de dato incorrecto
    procesarPedido(123456, "Audiculares", 2)
