// Script para añadir un nuevo Titán a la base de datos local
// Modifica los valores dentro de 'body' para añadir el titán que quieras.
// Para ejecutarlo, abre la terminal y escribe: node add_titan.js

fetch('http://localhost:3000/titans', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        // --- EDITA AQUÍ LOS DATOS DEL TITÁN ---
        name: "Nombre del Titán", // Ej: "Jaw Titan"
        img: "URL_de_la_imagen",  // Ej: "https://ejemplo.com/imagen.jpg"
        height: "Altura",         // Ej: "5m"
        allegiance: "Lealtad",    // Ej: "Marley"
        abilities: [              // Lista de habilidades
            "Habilidad 1",
            "Habilidad 2"
        ]
        // --------------------------------------
    })
})
    .then(response => response.json())
    .then(data => {
        console.log('¡Titán añadido con éxito!');
        console.log(data);
    })
    .catch((error) => console.error('Error al añadir titán:', error));
