const express = require('express');
const router = express.Router();
const db = require('../db'); // Ajusta esta ruta si tu archivo de conexión a la base de datos tiene otro nombre

// Obtener todos los productos del carrito
router.get('/', (req, res) => {
    const query = `
        SELECT carrito.id_carrito, carrito.cantidad, productos.nombre, productos.precio, productos.imagen 
        FROM carrito
        INNER JOIN productos ON carrito.id_producto = productos.id_producto
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener el carrito:', err);
            return res.status(500).json({ error: 'Error al obtener el carrito' });
        }
        res.json(results);
    });
});

// Agregar un producto al carrito
router.post('/', (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body); // Debug del cuerpo recibido

    const { id_producto, cantidad } = req.body;

    if (!id_producto || !cantidad || cantidad <= 0) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y la cantidad debe ser mayor a 0.' });
    }

    const query = 'INSERT INTO carrito (id_producto, cantidad) VALUES (?, ?)';
    db.query(query, [id_producto, cantidad], (err, result) => {
        if (err) {
            console.error('Error al agregar al carrito:', err);
            return res.status(500).json({ error: 'Error al agregar al carrito' });
        }
        res.status(201).json({ message: 'Producto agregado al carrito', id_carrito: result.insertId });
    });
});

// Ruta de prueba para verificar conexión
router.get('/test', (req, res) => {
    res.status(200).json({ message: "Ruta de prueba activa" });
});

module.exports = router;


