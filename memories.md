# Proyecto: Attack on Titan Wiki (Proyecto 1ª Evaluación DWEC)

## Descripción General

Este proyecto es una aplicación web SPA (Single Page Application) simulada que permite explorar información sobre el universo de "Attack on Titan" (Shingeki no Kyojin). Utiliza una API local (json-server) para gestionar los datos de personajes, titanes, episodios y favoritos.

## Funcionalidades Principales

- **Exploración de Personajes**: Búsqueda y filtrado por nombre, estado y género.
- **Detalles de Personaje**: Vista detallada con información biográfica y episodios relacionados.
- **Titanes**: Catálogo de los titanes cambiantes con sus características.
- **Episodios**: Listado de episodios de la serie.
- **Sistema de Favoritos**: Permite guardar personajes, titanes y episodios en una lista de favoritos persistente (almacenada en `db.json`).

## Estructura de Archivos

### Raíz

- `add_titan.js`: Script de utilidad (Node.js) para añadir nuevos titanes a la base de datos manualmente.
- `db.json`: Base de datos local en formato JSON que contiene las colecciones de `characters`, `titans`, `episodes` y `favorites`.
- `memories.md`: Este archivo de documentación.

### HTML (Vistas)

- `html/index.html`: Página de inicio con navegación a las secciones principales.
- `html/characters.html`: Interfaz de búsqueda y listado de personajes.
- `html/character_details.html`: Plantilla para mostrar la información detallada de un personaje seleccionado.
- `html/titans.html`: Galería de titanes.
- `html/episodes.html`: Listado de episodios.
- `html/favorites.html`: Página para visualizar y gestionar los elementos guardados.

### JavaScript (Lógica)

- `js/main.js`: Contiene funciones compartidas, principalmente la lógica del sistema de favoritos (`isFavorite`, `toggleFavorite`, `removeFavorite`).
- `js/characters.js`: Maneja la obtención, filtrado y renderizado de personajes.
- `js/character_details.js`: Gestiona la carga de datos de un personaje específico y sus episodios cruzados.
- `js/titans.js`: Renderiza la lista de titanes.
- `js/episodes.js`: Renderiza y filtra la lista de episodios.
- `js/favorites.js`: Carga y muestra los favoritos agrupados por tipo.

### CSS (Estilos)

- `css/style.css`: Hoja de estilos global. Define el tema oscuro, la tipografía, el diseño de las tarjetas (cards) y la responsividad.
<<<<<<< HEAD
=======

## Porcentajes de Participación

| Nombres                    | Porcentaje |
| -------------------------- | ---------- |
| Izan Heras Carrasco        | 33.33 %    |
| Alejandro Fernández Martín | 33.33 %    |
| Enrique Manrique Ruiz      | 33.33 %    |
| ChatGpt                    | 0.01 %     |
>>>>>>> e89ac99ccef3e10b05f2d839e9a39b4d7227ec44
