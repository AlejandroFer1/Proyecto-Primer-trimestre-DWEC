document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get('id');

    if (!characterId) {
        document.getElementById('character-details').innerHTML = '<p>Error: No se especificó un personaje.</p>';
        return;
    }

    await loadCharacterDetails(characterId);
});

async function loadCharacterDetails(id) {
    const detailsContainer = document.getElementById('character-details');
    const episodesContainer = document.getElementById('episodes-list');

    try {
        // 1. Fetch Character Details from local API
        // Note: json-server IDs might be strings or numbers depending on how they were saved.
        // The migration script saved them as they came from the API (likely numbers).
        // But json-server routes are /characters/1
        const charResponse = await fetch(`http://localhost:3000/characters/${id}`);
        if (!charResponse.ok) throw new Error('Error al cargar personaje');
        const char = await charResponse.json();

        // Render Character Details
        let imgSrc = char.img ? char.img.replace(/(\.png|\.jpg|\.jpeg|\.gif|\.webp).*$/i, '$1') : 'https://placehold.co/300x400?text=Sin+Imagen';

        detailsContainer.innerHTML = `
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <img src="${imgSrc}" alt="${char.name}" style="max-width: 300px; border-radius: 8px; border: 2px solid #d4af37;">
                <div>
                    <h2 style="color: #d4af37; margin-top: 0;">${char.name}</h2>
                    <p><strong>Alias:</strong> ${char.alias && char.alias.length > 0 ? char.alias.join(', ') : 'Ninguno'}</p>
                    <p><strong>Género:</strong> ${char.gender || 'Desconocido'}</p>
                    <p><strong>Especie:</strong> ${char.species?.join(', ') || 'Desconocido'}</p>
                    <p><strong>Estado:</strong> ${char.status || 'Desconocido'}</p>
                    <p><strong>Ocupación:</strong> ${char.occupation || 'Desconocido'}</p>
                    <p><strong>Residencia:</strong> ${char.residence || 'Desconocido'}</p>
                </div>
            </div>
        `;

        // 2. Fetch Episodes
        // We need to find episodes where this character appears.
        // The migrated data has 'episodes' as an array of URLs.
        // We can extract IDs from there.

        if (char.episodes && char.episodes.length > 0) {
            episodesContainer.innerHTML = '<p>Cargando episodios...</p>';

            const episodeIds = char.episodes.map(url => {
                // Extract ID from URL like "https://api.attackontitanapi.com/episodes/1"
                const parts = url.split('/');
                return parts[parts.length - 1] || parts[parts.length - 2];
            }).filter(id => id); // Filter out empty/null

            if (episodeIds.length > 0) {
                // Fetch episodes from local API
                // We can't easily do "id IN (...)" with json-server standard without query string length limits.
                // But we can try fetching all episodes and filtering client side if the list is huge, OR fetch individually.
                // Given we have a local server, fetching individually is fast enough for 10-20 items.

                const episodesToFetch = episodeIds.slice(0, 12);
                const episodePromises = episodesToFetch.map(epId =>
                    fetch(`http://localhost:3000/episodes/${epId}`).then(res => {
                        if (res.ok) return res.json();
                        return null;
                    })
                );

                const episodesDataRaw = await Promise.all(episodePromises);
                const episodesData = episodesDataRaw.filter(ep => ep !== null);

                episodesContainer.innerHTML = '';
                episodesData.forEach(ep => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <h4>${ep.name}</h4>
                        <p><strong>Código:</strong> ${ep.episode}</p>
                        <button class="favorite-btn" data-type="episode" data-id="${ep.id}">${isFavorite('episode', ep.id) ? '❤️ Quitado' : '🤍 Añadir'}</button>
                    `;
                    episodesContainer.appendChild(card);
                });

                if (episodeIds.length > 12) {
                    const moreMsg = document.createElement('p');
                    moreMsg.textContent = `... y ${episodeIds.length - 12} episodios más.`;
                    episodesContainer.appendChild(moreMsg);
                }
            } else {
                episodesContainer.innerHTML = '<p>No se encontraron episodios relacionados.</p>';
            }

        } else {
            episodesContainer.innerHTML = '<p>No se encontraron episodios relacionados.</p>';
        }

        await updateFavoritesUI();

    } catch (error) {
        console.error(error);
        detailsContainer.innerHTML = `<p>Error al cargar detalles: ${error.message}</p>`;
        episodesContainer.innerHTML = '';
    }
}

async function updateFavoritesUI() {
    // Fetch favorites
    const response = await fetch('http://localhost:3000/favorites');
    const favorites = await response.json();

    document.querySelectorAll('.favorite-btn').forEach(button => {
        const type = button.getAttribute('data-type');
        const id = parseInt(button.getAttribute('data-id'));

        const isFav = favorites.some(fav => fav.type === type && fav.originId === id);

        button.textContent = isFav ? '❤️ Quitado' : '🤍 Añadir';
        if (isFav) button.classList.add('favorited');
        else button.classList.remove('favorited');

        button.onclick = async (e) => {
            e.preventDefault();
            const name = e.target.closest('.card').querySelector('h4').textContent;
            await toggleFavorite(type, id, name, '', e.target);
        };
    });
}
