# 🖥️ Tutorial: Instalación y configuración de Git Bash en Windows

Este tutorial explica cómo instalar **Git Bash** en Windows y asegurarse de que quede configurado correctamente para usarlo en el proyecto **NASA SpaceApp Challenge**.

---

## 1️⃣ ¿Qué es Git Bash?

- **Git Bash** es una terminal (ventana de comandos) que permite usar instrucciones de Linux en Windows.  
- Es necesaria para ejecutar los scripts del proyecto usando los comandos `npm run start`, `npm run stop` y `npm run publish`.  
- Viene incluido cuando instalas **Git for Windows**.

---

## 2️⃣ Descargar Git Bash

1. Abre tu navegador y entra a:  
   👉 https://git-scm.com/download/win

2. Descarga la versión recomendada para tu sistema (normalmente de 64 bits).  

---

## 3️⃣ Instalar Git Bash

1. Ejecuta el archivo que descargaste (`Git-x.x.x-64-bit.exe`).  
2. Durante la instalación, avanza con **Next** hasta llegar a la sección **Adjusting your PATH environment**.  
3. En esa pantalla selecciona la opción:  

   ✅ “Git from the command line and also from 3rd-party software”  

   Esto agregará automáticamente Git y Bash al **PATH** de Windows.  
4. Continúa con **Next** en todas las pantallas restantes y deja las opciones por defecto.  
5. Haz clic en **Install** y espera a que finalice.  
6. Finalmente haz clic en **Finish**.

---

## 4️⃣ Verificar la instalación

1. Abre el menú de inicio y escribe **Git Bash**.  
   - Si aparece en la lista, está instalado correctamente.  

2. Abre también **PowerShell** o **CMD** y escribe:  

```bash
bash --version
```

Deberías ver algo como:  

```
GNU bash, version 5.x.x
```

3. Verifica también Git:  

```bash
git --version
```

Deberías ver algo como:  

```
git version 2.xx.x
```

Si aparecen esos resultados, todo está listo ✅.

---

## 5️⃣ Usar Git Bash en el proyecto

- Abre **Git Bash** dentro de la carpeta del proyecto (clic derecho → “Git Bash Here”).  
- Usa los comandos de npm para trabajar con el proyecto:  

```bash
npm run start   # Levanta los servicios
npm run stop    # Detiene los servicios
npm run publish # Publica el proyecto en el servidor
```

---

## 6️⃣ Problemas comunes

- **Si `bash` no funciona en CMD/PowerShell** → reinstala Git y en la parte de PATH asegúrate de elegir “Git from the command line and also from 3rd-party software”.  
- **Si Docker no arranca en Git Bash** → asegúrate de abrir primero **Docker Desktop**.  
