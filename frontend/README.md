# React Test App - Frontend

Esta es una aplicación React que consume el API backend para mostrar información de archivos CSV procesados en una tabla.

## Requisitos

- Node.js 16.x
- npm

## Instalación

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución

1. Asegúrate de que el backend esté corriendo en el puerto 3000:
```bash
cd ../backend
npm start
```

2. En otra terminal, ejecuta el frontend:
```bash
cd frontend
npm start
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3001`.

## Funcionalidades

- Muestra datos de archivos CSV en una tabla ordenada
- Interfaz responsive usando React Bootstrap
- Manejo de estados de carga y errores
- Manejo global de estado con Redux Toolkit y Async Thunks
- Programación funcional con React Hooks

## Tecnologías utilizadas

- React 18
- Redux Toolkit (con createAsyncThunk)
- React Bootstrap
- Axios para peticiones HTTP
- Webpack para bundling
- Babel para transpilación

## Decisiones tomadas respecto al requerimiento

- Se mantuvo un pequeño margen izquierdo en el título React Test App, aunque en el diseño original estaba alineado completamente a la izquierda, para mejorar la estética en pantallas grandes.

- No se especificó comportamiento responsivo extremo en el requerimiento: al reducir mucho el ancho de pantalla, el contenido del campo hex se elipsará o desbordará horizontalmente.
