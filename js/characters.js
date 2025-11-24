document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content');
    const searchForm = document.getElementById('search-form');

    // Carga inicial
    await loadCharacters();

    // Manejo de búsqueda
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('search-name').value.trim();
            const status = document.getElementById('search-status').value;
            const gender = document.getElementById('search-gender').value;

            // Validación simple
            // Validación simple eliminada para permitir resetear la búsqueda
            // if (!name && !status && !gender) {
            //     alert('Por favor, introduce al menos un criterio de búsqueda.');
            //     return;
            // }

            await loadCharacters({ name, status, gender });
        });
    }
});

async function loadCharacters(filters = {}) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p>Cargando personajes...</p>';

    try {
        // Fetch all characters (no filters in URL)
        let url = 'http://localhost:3000/characters';

        const [charsResponse, favoritesResponse] = await Promise.all([
            fetch(url),
            fetch('http://localhost:3000/favorites')
        ]);

        if (!charsResponse.ok) throw new Error('Error al cargar personajes');

        let characters = await charsResponse.json();
        const favorites = await favoritesResponse.json();

        // Client-side filtering
        if (filters.name) {
            const nameFilter = filters.name.toLowerCase();
            characters = characters.filter(char => char.name.toLowerCase().includes(nameFilter));
        }
        if (filters.status) {
            characters = characters.filter(char => char.status === filters.status);
        }
        if (filters.gender) {
            characters = characters.filter(char => char.gender === filters.gender);
        }

        displayCharacters(characters, favorites);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = '<p>Error al cargar personajes.</p>';
    }
}

function displayCharacters(characters, favorites) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    if (characters.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron personajes con esos criterios.</p>';
        return;
    }

    characters.forEach(char => {
        let imgSrc = char.img ? char.img.replace(/(\.png|\.jpg|\.jpeg|\.gif|\.webp).*$/i, '$1') : 'https://placehold.co/200x300?text=Sin+Imagen';

        const isFav = favorites.some(fav => fav.type === 'character' && fav.originId === char.id);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${char.name}</h3>
            <img src="${imgSrc}" alt="${char.name}" style="max-width: 200px; margin: 10px 0;">
            <p><strong>Alias:</strong> ${char.alias && char.alias.length > 0 ? char.alias.join(', ') : 'Ninguno'}</p>
            <p><strong>Estado:</strong> ${char.status || 'Desconocido'}</p>
            <p><strong>Especie:</strong> ${char.species?.join(', ') || 'Desconocido'}</p>
            <p><strong>Género:</strong> ${char.gender || 'Desconocido'}</p>
            <div class="card-actions">
                <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-type="character" data-id="${char.id}">
                    ${isFav ? '❤️ Quitado' : '🤍 Añadir'}
                </button>
                <button class="details-btn" data-id="${char.id}">
                    📜 Ver Detalles
                </button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    // Event listeners para favoritos
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

    // Event listeners para detalles (Navegación anidada)
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            window.location.href = `character_details.html?id=${id}`;
        });
    });
}
