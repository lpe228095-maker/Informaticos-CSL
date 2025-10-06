# 🐳 Tutorial: Instalación de Docker Desktop y Docker Compose en Windows

Este tutorial te guía para **instalar y preparar Docker Desktop** en Windows, de modo que puedas ejecutar el proyecto del **NASA SpaceApp Challenge** sin complicaciones.

---

## 1️⃣ ¿Qué es Docker Desktop?

- **Docker Desktop** es un programa que permite ejecutar aplicaciones dentro de **contenedores** (como mini-computadoras virtuales).
- Con Docker Desktop ya viene incluido **Docker Compose**, por lo que no necesitas instalarlo aparte.
- Con Docker no importa si tu computadora es diferente a la de otro compañero: todo funcionará igual.

---

## 2️⃣ Descargar Docker Desktop

1. Abre tu navegador y entra a:  
   👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. Haz clic en el botón **“Download for Windows”**.  
   - Si tu Windows es moderno (Windows 10/11), selecciona la opción con **WSL2** (es la recomendada).  
   - Si no sabes cuál es tu versión, descarga la que el sitio te sugiera por defecto.

3. Espera a que termine la descarga.

---

## 3️⃣ Instalar Docker Desktop

1. Ejecuta el archivo que descargaste (`Docker Desktop Installer.exe`).
2. En el instalador deja las opciones por defecto y haz clic en **Next**.
3. Si te pregunta por **WSL2** o **Hyper-V**, marca WSL2 (si está disponible).
4. Haz clic en **Install** y espera a que termine.
5. Reinicia tu computadora si el instalador lo solicita.

---

## 4️⃣ Iniciar Docker Desktop

1. Busca “**Docker Desktop**” en el menú de inicio y ábrelo.
2. Espera a que el icono de Docker (🐳) aparezca en la barra de tareas.  
   - El icono debe ponerse **azul** para indicar que Docker está corriendo.  
3. Deja Docker Desktop abierto mientras trabajas en el proyecto.  
   - Si lo cierras, los contenedores dejarán de funcionar.

---

## 5️⃣ Probar la instalación

1. Abre una terminal (PowerShell, CMD o Git Bash).
2. Escribe:

```bash
docker --version
```

Deberías ver algo como:

```
Docker version 24.xx.xx
```

3. Escribe también:

```bash
docker-compose --version
```

Deberías ver algo como:

```
Docker Compose version v2.xx.xx
```

Si ves estas dos respuestas, **todo está listo** ✅.

---

## 6️⃣ Siguientes pasos

- Con Docker Desktop abierto, ya puedes usar los scripts del proyecto:  

```bash
npm run start   # Levanta los servicios
npm run stop    # Detiene los servicios
npm run publish # Publica el proyecto en el servidor (si aplica)
```

- Recuerda mantener **Docker Desktop abierto** mientras trabajas con el proyecto.
