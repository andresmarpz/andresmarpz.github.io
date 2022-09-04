# JAP e-commerce

Este es el proyecto del curso Jóvenes a Programar de Plan Ceibal Uruguay.

## Estructura

Todo el código se encuentra dentro de la carpeta [src](https://github.com/andresmarpz/andresmarpz.github.io/tree/main/src). El proyecto utiliza TypeScript y Vite localmente para facilitar el desarrollo. <br>

Como dependencias están Bootstrap y Dropzone.js (las cuales ya vienen incluidas en el proyecto inicial). <br>
Además se implementa Navigo, un router de JavaScript para lograr una SPA y evitar cambios de página completos entre rutas. <br>

Cada ruta tiene su archivo específico bajo [src/pages](https://github.com/andresmarpz/andresmarpz.github.io/tree/main/src/pages) donde se exporta una función que devuelve todo el html necesario para la misma. En este lugar se define cualquier función necesaria como pueden ser event listeners, auxiliares, filtros, etc.

### Producción

El proceso está automatizado con GitHub Actions. Los pasos necesarios son:
1. Crear una build donde se eliminan los types y se bundlea el JavaScript.
2. Verificar que los tests pasen como debe ser.
3. Subir el resultado de /dist a la branch gh-pages para que se vea reflejado en el sitio.

### Local

Para correr el proyecto en un ambiente de desarrollo:

```bash
$ git clone https://github.com/andresmarpz/andresmarpz.github.io.git
$ cd andresmarpz.github.io
$ npm i
$ npm run dev
```

Navegar a [http://localhost:5173](http://localhost:5173)
