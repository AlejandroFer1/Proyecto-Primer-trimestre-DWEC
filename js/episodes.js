document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content');
    const searchForm = document.getElementById('search-form');

    // Carga inicial
    await loadEpisodes();

    // Manejo de búsqueda
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const episodeCode = document.getElementById('search-episode').value.trim();

            if (!episodeCode) {
                alert('Por favor, introduce un código de episodio.');
                return;
            }

            await loadEpisodes({ episode: episodeCode });
        });
    }
});

async function loadEpisodes(filters = {}) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p>Cargando...</p>';

    try {
        let url = 'http://localhost:3000/episodes';
        const params = new URLSearchParams();

        if (filters.episode) {
            // coincidencia parcial de json-server
            params.append('episode_like', filters.episode);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const [episodesResponse, favoritesResponse] = await Promise.all([
            fetch(url),
            fetch('http://localhost:3000/favorites')
        ]);

        if (!episodesResponse.ok) {
            throw new Error('No se encontraron resultados o error en la API.');
        }

        const episodes = await episodesResponse.json();
        const favorites = await favoritesResponse.json();

        displayEpisodes(episodes, favorites);
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error(error);
    }
}

function displayEpisodes(episodes, favorites) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    if (episodes.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron episodios con esos criterios.</p>';
        return;
    }

    episodes.forEach(episode => {
        let imgSrc = episode.img ? episode.img.replace(/(\.png|\.jpg|\.jpeg|\.gif|\.webp).*$/i, '$1') : '';

        const isFav = favorites.some(fav => fav.type === 'episode' && fav.originId === episode.id);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${episode.name}</h3>
            ${imgSrc ? `<img src="${imgSrc}" alt="${episode.name}" style="max-width: 200px; margin: 10px 0;">` : ''}
            <p><strong>Episodio:</strong> ${episode.episode}</p>
            <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-type="episode" data-id="${episode.id}">
                ${isFav ? '❤️ Quitado' : '🤍 Añadir'}
            </button>
        `;
        resultsContainer.appendChild(card);
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