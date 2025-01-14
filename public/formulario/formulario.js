async function agregarProducto() {
    const categoria = document.getElementById("categoria-producto").value;
    const nombre = document.getElementById("nombre-producto").value;
    const precio = document.getElementById("precio-producto").value;
    const imagen = document.getElementById("imagen-producto").files[0];

    if (!categoria || !nombre || !precio || !imagen) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (precio <= 0) {
        alert("El precio debe ser un valor positivo.");
        return;
    }

    // Generar un ID único basado en el tiempo actual
    const id = `prod_${Date.now()}`;

    const formData = new FormData();
    formData.append("id", id); // Agregar el ID único al producto
    formData.append("categoria", categoria);
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("image", imagen);

    const mensaje = document.getElementById("mensaje-agregar-producto");
    mensaje.textContent = "Procesando...";

    try {
        const response = await fetch("http://localhost:4000/productos", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const resultado = await response.json();
            mensaje.textContent = `Producto agregado: ${resultado.name}`;
            document.getElementById("form-agregar-producto").reset(); // Limpiar formulario
        } else {
            mensaje.textContent = "Error al agregar el producto.";
        }
    } catch (error) {
        mensaje.textContent = "Hubo un problema con la conexión.";
        console.error(error);
    }
}

