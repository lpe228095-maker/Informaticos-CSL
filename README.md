# NASA SpaceApp Challenge

Este repositorio es el **proyecto base oficial para los equipos de INTECAP que participan en el NASA SpaceApp Challenge**.  
Su propósito es proporcionar una estructura organizada y lista para usar, con los componentes técnicos necesarios ya configurados, de manera que cada equipo pueda concentrarse en **desarrollar y presentar su solución** sin invertir tiempo en instalaciones o configuraciones complicadas.  

El proyecto está compuesto por:  
- **Aplicación web** → combina la parte visual y la lógica de comunicación con el servidor.  
- **Entorno de ejecución** → gestionado con Docker y docker-compose, que aseguran que todo funcione igual en cualquier computadora. Aquí también se incluyen las configuraciones del archivo `.env`, donde se centralizan valores como puertos, direcciones o credenciales, para que los servicios puedan levantarse fácilmente.  
- **Servicios adicionales** → el proyecto puede ampliarse fácilmente con herramientas que soportan funcionalidades de inteligencia artificial, como **OpenSearch** o **Supabase** para manejar bases de datos vectoriales, o **N8N** para crear flujos de automatización sin necesidad de programar desde cero.  

---

## 📂 Estructura de carpetas

```
├── .env                 -> Variables de entorno generales
├── .gitignore           -> Reglas para excluir archivos de Git
├── .idea/               -> Configuración de IDE (ejemplo: IntelliJ, WebStorm)
│   ├── .gitignore       -> Reglas específicas de esta carpeta
│   └── workspace.xml    -> Configuración de espacio de trabajo
├── README.md            -> Este documento
├── docker-compose.yml   -> Orquestador de servicios (FE, BE, DB, N8N, Supabase)
├── package.json         -> Configuración raíz con scripts globales
├── docs/                -> Documentación de apoyo del proyecto
├── scripts/             -> Scripts automatizados
│   ├── publish.sh       -> Publica el proyecto en el servidor remoto
│   ├── start.sh         -> Levanta los servicios en local
│   └── stop.sh          -> Detiene los servicios en local
├── frontend/            -> Sitio web estático
│   ├── Dockerfile       -> Imagen de Docker para servir con Nginx
│   ├── README.md        -> Guía específica del frontend
│   ├── lib/             -> Librerías adicionales
│   ├── package.json     -> Configuración opcional del frontend
│   └── public/          -> Archivos visibles por el navegador
│       ├── index.html   -> Página principal
│       ├── css/         -> Estilos
│       ├── js/          -> Scripts
│       ├── images/      -> Imágenes
│       └── assets/      -> Archivos adicionales (ej. PDFs)
├── backend/             -> API en Node.js
│   ├── Dockerfile       -> Imagen de Docker para la API
│   ├── README.md        -> Guía específica del backend
│   ├── lib/             -> Librerías propias
│   ├── package.json     -> Dependencias del backend
│   └── src/             -> Código fuente del servidor (ejemplo: server.js)
└── security/            -> Archivos sensibles
    └── .pem             -> Llave privada para conexión al servidor
```

---

## ⚡ Scripts disponibles

Los scripts simplifican el trabajo con Docker y el despliegue. Se ejecutan desde la raíz con:

```
npm run <comando>
```

- **start**  
  Levanta todos los servicios en local usando docker-compose.  

- **stop**  
  Detiene todos los servicios en local.  

- **publish**  
  Publica el proyecto en el servidor remoto.  
  Requiere el archivo `.pem` en la carpeta `security/` para autenticar la conexión.  

---

## 🐳 Docker y docker-compose

El proyecto está diseñado para funcionar con **Docker**, lo que asegura que todos los equipos trabajen en un mismo entorno sin importar la computadora.  

- **Frontend** → corre en Nginx en el puerto 80.  
- **Backend** → corre en Node.js en el puerto 3000.  
- **OpenSearch** → disponible como motor de búsqueda y base de datos vectorial (puerto 9200).  
- **Supabase** y **N8N** → ya están listos en el `docker-compose.yml` y pueden activarse comentando o descomentando sus secciones según lo requiera el equipo.  

---

## 🔐 Seguridad

La carpeta `security/` contiene archivos de seguridad:  

- **.pem** → llave privada usada para conectarse al servidor remoto.  
  - Nunca debe compartirse ni subirse a Git.  
  - Solo se coloca aquí cuando se entregue oficialmente para el despliegue.  

---

## 🚀 Flujo de trabajo recomendado

1. Clonar el repositorio.
2. Ejecutar:  
   - `npm install` → instala dependencias.
   - `npm run start` → levanta los servicios en local.  
   - `npm run stop` → detiene los servicios.  
3. Trabajar en **frontend/public** y **backend/src** según corresponda.  
4. Cuando el proyecto esté listo:
   - Colocar el archivo `.pem` en la carpeta `security/`.
   - Ejecutar `npm run publish` → despliega en el servidor remoto.  
