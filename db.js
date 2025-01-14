const mysql = require('mysql');

// Configuración de la conexión
const db = mysql.createConnection({
    host: '127.0.0.1', // Cambiado de 'localhost' a '127.0.0.1'
    user: 'root',
    password: 'Cemex2025',
    database: 'artesanias_miyuki',
    port: 3307 // Usa el puerto 3307 si tu MariaDB está configurada en este puerto
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos en el puerto 3307');

        // Prueba la conexión con una consulta simple
        db.query('SELECT 1', (err, results) => {
            if (err) {
                console.error('Error al ejecutar consulta de prueba:', err);
            } else {
                console.log('Consulta de prueba ejecutada correctamente:', results);
            }
        });
    }
});

module.exports = db;







