const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../db'); // Asegúrate de que tu archivo db.js esté configurado correctamente

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads')); // Guardar imágenes en public/uploads
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Crear un nombre único
    },
});

const upload = multer({ storage });

// Obtener todos los productos desde la base de datos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID
router.get('/producto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM productos WHERE id_producto = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(result[0]);
    });
});

// Filtrar productos por categoría
router.get('/categoria/:category', (req, res) => {
    const category = req.params.category.toLowerCase();
    const query = 'SELECT * FROM productos WHERE LOWER(categoria) = ?';
    db.query(query, [category], (err, results) => {
        if (err) {
            console.error('Error al filtrar productos:', err);
            return res.status(500).json({ error: 'Error al filtrar productos' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto a la base de datos
router.post('/', upload.single('image'), (req, res) => {
    const { nombre, precio, categoria } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !precio || !image || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = 'INSERT INTO productos (nombre, precio, imagen, categoria) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, parseFloat(precio), image, categoria], (err, result) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.status(201).json({ id_producto: result.insertId, nombre, precio, imagen: image, categoria });
    });
});

// Eliminar un producto por ID
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM productos WHERE id_producto = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    });
});

// Obtener todos los productos en el carrito
router.get('/carrito', (req, res) => {
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
router.post('/carrito', (req, res) => {
    const { id_producto, cantidad } = req.body;

    if (!id_producto || !cantidad) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
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

// Actualizar la cantidad de un producto en el carrito
router.put('/carrito/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (!cantidad) {
        return res.status(400).json({ error: 'La cantidad es obligatoria.' });
    }

    const query = 'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?';
    db.query(query, [cantidad, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el carrito:', err);
            return res.status(500).json({ error: 'Error al actualizar el carrito' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }
        res.status(200).json({ message: 'Carrito actualizado correctamente.' });
    });
});

// Eliminar un producto del carrito
router.delete('/carrito/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const query = 'DELETE FROM carrito WHERE id_carrito = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar del carrito:', err);
            return res.status(500).json({ error: 'Error al eliminar del carrito' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }
        res.status(200).json({ message: 'Producto eliminado del carrito correctamente.' });
    });
});

module.exports = router;



