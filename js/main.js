// main.js - Funciones compartidas
const API_URL = 'http://localhost:3000/favorites';

async function isFavorite(type, id) {
    try {
        const response = await fetch(API_URL);
        const favorites = await response.json();
        return favorites.some(fav => fav.type === type && fav.originId === id);
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
}

async function toggleFavorite(type, id, name, img, button) {
    try {
        const isFav = await isFavorite(type, id);
        if (isFav) {
            await removeFavorite(id);
            button.textContent = '🤍 Añadir';
            button.classList.remove('favorited');
        } else {
            await addFavorite(type, id, name, img);
            button.textContent = '❤️ Quitado';
            button.classList.add('favorited');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Error al actualizar favoritos. Asegúrate de que el servidor json-server esté corriendo.');
    }
}

async function removeFavorite(dbId) {
    try {
        await fetch(`${API_URL}/${dbId}`, { method: 'DELETE' });
        location.reload();
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}