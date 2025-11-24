// main.js - Funciones compartidas
const API_URL = 'http://localhost:3000/favorites';

async function isFavorite(type, id) {
    try {
        const response = await fetch(API_URL);
        const favorites = await response.json();
        return favorites.some(fav => fav.type === type && fav.originId === id);
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        return false;
    }
}

async function toggleFavorite(type, id, name, img, button) {
    try {
        const response = await fetch(API_URL);
        const favorites = await response.json();
        // Buscar por tipo y el ID del recurso original (originId)
        // Convertir ambos a números para una comparación adecuada
        const numId = typeof id === 'string' ? parseInt(id) : id;
        const existingFav = favorites.find(fav => fav.type === type && parseInt(fav.originId) === numId);

        if (existingFav) {
            // Eliminar
            // Usar el 'id' generado por json-server para la eliminación
            await fetch(`${API_URL}/${existingFav.id}`, { method: 'DELETE' });
            button.textContent = '🤍 Añadir';
            button.classList.remove('favorited');
        } else {
            // Añadir
            // Usamos 'originId' para almacenar el ID del recurso original,
            // dejando que json-server genere su propio 'id' primario.
            const favToSave = { type, originId: numId, name, img };

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(favToSave)
            });

            button.textContent = '❤️ Quitado';
            button.classList.add('favorited');
        }
    } catch (error) {
        console.error('Error al cambiar favorito:', error);
        alert('Error al actualizar favoritos. Asegúrate de que el servidor json-server esté corriendo.');
    }
}

async function removeFavorite(dbId) {
    try {
        await fetch(`${API_URL}/${dbId}`, { method: 'DELETE' });
        location.reload();
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
    }
}