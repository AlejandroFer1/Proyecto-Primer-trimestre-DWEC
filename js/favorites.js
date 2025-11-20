document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h2>Mis Favoritos</h2>';

    try {
        const response = await fetch('http://localhost:3000/favorites');
        const favorites = await response.json();

        if (favorites.length === 0) {
            mainContent.innerHTML += '<p>No tienes favoritos guardados.</p>';
            return;
        }

        // Agrupar por tipo
        const grouped = favorites.reduce((acc, fav) => {
            acc[fav.type] = acc[fav.type] || [];
            acc[fav.type].push(fav);
            return acc;
        }, {});

        for (const type in grouped) {
            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's';
            mainContent.appendChild(sectionTitle);

            grouped[type].forEach(fav => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${fav.name}</h3>
                    ${fav.img ? `<img src="${fav.img}" alt="${fav.name}" style="max-width: 200px; margin: 10px 0;">` : ''}
                    <button class="remove-btn" data-id="${fav.id}">❌ Eliminar</button>
                `;
                mainContent.appendChild(card);
            });
        }

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id'); // This is the db id
                removeFavorite(id);
            });
        });

    } catch (error) {
        mainContent.innerHTML += `<p>Error al cargar favoritos: ${error.message}. Asegúrate de que json-server esté corriendo.</p>`;
    }
});