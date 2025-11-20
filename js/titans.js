document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<p>Cargando titanes...</p>';

    try {
        const [titansResponse, favoritesResponse] = await Promise.all([
            fetch('http://localhost:3000/titans'),
            fetch('http://localhost:3000/favorites')
        ]);

        if (!titansResponse.ok) {
            throw new Error('Error al cargar los titanes');
        }

        const titans = await titansResponse.json();
        const favorites = await favoritesResponse.json();

        displayTitans(titans, favorites);
    } catch (error) {
        console.error(error);
        mainContent.innerHTML = '<p>Error al cargar los titanes. Asegúrate de que el servidor esté funcionando.</p>';
    }
});

function displayTitans(titans, favorites) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h2>Titán</h2>';
    if (titans.length === 0) {
        mainContent.innerHTML += '<p>No hay titanes disponibles.</p>';
        return;
    }
    titans.forEach(titan => {
        // Limpiar la URL de la imagen eliminando la parte de ?cb=... o cualquier cosa después de la extensión
        let imgSrc = titan.img ? titan.img.replace(/(\.png|\.jpg|\.jpeg|\.gif|\.webp).*$/i, '$1') : '';

        const isFav = favorites.some(fav => fav.type === 'titan' && fav.originId === titan.id);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${titan.name}</h3>
            ${imgSrc ? `<img src="${imgSrc}" alt="${titan.name}" style="max-width: 200px; margin: 10px 0;">` : ''}
            <p><strong>Altura:</strong> ${titan.height}</p>
            <p><strong>Lealtad:</strong> ${titan.allegiance}</p>
            <p><strong>Habilidades:</strong> ${titan.abilities?.join(', ') || 'No especificadas'}</p>
            <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-type="titan" data-id="${titan.id}">
                ${isFav ? '❤️ Quitado' : '🤍 Añadir'}
            </button>
        `;
        mainContent.appendChild(card);
    });

    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.target.getAttribute('data-type');
            const id = parseInt(e.target.getAttribute('data-id'));
            const name = e.target.closest('.card').querySelector('h3').textContent;
            const img = e.target.closest('.card').querySelector('img')?.src || '';
            toggleFavorite(type, id, name, img, e.target);
        });
    });
}