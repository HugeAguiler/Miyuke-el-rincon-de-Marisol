const express = require('express');
const app = express();
const port = 4000;

// Middleware para analizar JSON en las solicitudes
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Rutas de productos
const productRoutes = require('./routers/products');
app.use('/api/products', productRoutes);

// Rutas del carrito
const carritoRoutes = require('./routers/carrito');
app.use('/api/carrito', carritoRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});












