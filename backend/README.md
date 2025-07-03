# API Backend - Servidor Node.js

Esta es una API REST desarrollada en Node.js que procesa archivos CSV y proporciona endpoints para obtener información de archivos y sus datos.

## Requisitos

- Node.js 16.x
- npm

## Instalación

1. Navega al directorio del backend:

```bash
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

## Ejecución

1. Inicia el servidor backend:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`.

2. Para ejecutar los tests:

```bash
npm test
```

## Funcionalidades

- Procesamiento de archivos CSV
- Endpoints REST para obtener lista de archivos disponibles
- Endpoints para obtener datos de archivos específicos
- Integración con APIs externas
- Manejo de errores y validaciones
- Tests unitarios con Jest

## Tecnologías utilizadas

- Node.js 16
- Express.js para el servidor web
- Jest para testing
- Axios para peticiones HTTP externas
- CSV parser para procesamiento de archivos
- CORS para manejo de peticiones cross-origin

## Endpoints disponibles

- `GET /api/files` - Obtiene la lista de archivos disponibles
- `GET /api/files/:filename` - Obtiene los datos de un archivo específico
- `GET /api/files/:filename/data` - Obtiene los datos procesados de un archivo

## Recomendaciones para el desarrollo

### Usar Node.js 16 para consistencia

Para este challenge, se recomienda usar Node.js 16 para mantener tanto el backend como el frontend en la misma versión, evitando tener que cambiar entre versiones de Node según el proyecto.

### Alternativa con NVM (opcional)

Si necesitas mantener una versión específica de Node.js para otros proyectos, puedes usar NVM:

```bash
# Instalar NVM globalmente
nvm install 14.21.3
nvm use 14
```

## Challenge Recommendation

### Usar NVM para la versión antigua de Node 14

El challenge no permite dependencias instaladas de forma global. La instalación de NVM es solo una recomendación si querés testear sin cambiar tu versión actual de Node.

```bash
# Primero instalar nvm globalmente,
nvm install 14.21.3
nvm use 14
```

### Podes usar 16 para correr FE y BE juntos

Para este challenge, se recomienda usar Node 16 para mantener tanto el backend como el frontend en la misma versión, evitando tener que cambiar entre versiones de Node según el proyecto.
