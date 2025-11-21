# Instrucciones de Ejecución

Para ejecutar este proyecto en local, necesitas tener **Node.js** instalado.

## 1. Iniciar la API (Base de Datos)

Este proyecto utiliza `json-server` para simular una API REST. Debes mantener esta terminal abierta mientras usas la aplicación.

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
npx json-server db.json --port 3000
```

Si te pide instalar `json-server`, acepta escribiendo `y`.

## 2. Abrir la Aplicación

Una vez que el servidor esté corriendo (verás un mensaje como `Resources: http://localhost:3000/...`), puedes abrir la aplicación de dos formas:

- **Opción A (Recomendada):** Si usas VS Code, instala la extensión "Live Server", abre el archivo `html/index.html` y haz clic en "Go Live".
- **Opción B (Sencilla):** Ve a la carpeta `html` en tu explorador de archivos y haz doble clic en `index.html` para abrirlo en tu navegador.

## Notas

- La API estará disponible en `http://localhost:3000`.
- Si cierras la terminal donde corre `json-server`, la aplicación dejará de mostrar datos.
