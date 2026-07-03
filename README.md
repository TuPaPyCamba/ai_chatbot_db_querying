# 🤖 AI Database Agent (Tool Calling con Next.js & Supabase)

Este proyecto es un chatbot diseñado para interactuar con una base de datos relacional (PostgreSQL) utilizando lenguaje natural. A diferencia de un sistema RAG (Retrieval-Augmented Generation) que busca similitudes semánticas, este proyecto implementa **Tool Calling**. El modelo de Inteligencia Artificial comprende el esquema de la base de datos, genera consultas SQL puras, las ejecuta de forma segura y devuelve respuestas precisas y matemáticamente correctas basadas en los datos reales.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, `next-themes` (Dark/Light mode).
*   **Backend:** Node.js (Next.js Route Handlers), TypeScript estricto.
*   **Base de Datos:** PostgreSQL (gestionado localmente vía Supabase CLI).
*   **Inteligencia Artificial:** Groq API (Modelo: `llama-3.3-70b-versatile`).
*   **Controladores DB:** `pg` (node-postgres) para ejecución cruda de SQL.
*   **Infraestructura:** Docker & Docker Compose (orquestado por Supabase).

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto sigue un enfoque **Monorepo**, donde el código de la interfaz, la lógica de la API y las migraciones de la base de datos conviven en un solo lugar, pero se ejecutan en entornos aislados.

### 1. Frontend (`/app`)
Organizado mediante *Route Groups* lógicos:
*   `/(public)`: Contiene el Landing Page y vistas de autenticación.
*   `/(private)`: Contiene el Dashboard principal y la interfaz del chatbot.
*   **Patrón de Diseño:** Cada ruta tiene un archivo `page.tsx` dedicado exclusivamente a la metadata, delegando el renderizado de la UI a un archivo `View.tsx` y a la carpeta `./components` a su mismo nivel para garantizar modularidad.

### 2. Backend (`/server`)
Estructurado en un patrón de **Microservicios** y Features:
*   `/features`: Agrupa la lógica de rutas y endpoints (ej. `chatbot/routes.ts`, `chatbot/endpoints.ts`).
*   `/services/ai/groq.ts`: Cliente de IA configurado con el SDK de OpenAI apuntando a Groq. Contiene el *System Prompt* con el esquema inyectado de la base de datos.
*   `/services/database/db.ts`: Pool de conexiones a PostgreSQL. Implementa la función `executeReadOnlyQuery` que asegura que toda consulta de la IA corra en un entorno `BEGIN READ ONLY` estricto.

### 3. Base de Datos (`/supabase`)
*   `/migrations`: Archivos SQL puros que definen las tablas, índices y relaciones (ej. `activos`, `transacciones`, `dividendos`).
*   `seed.sql`: Dataset masivo de prueba que se inyecta automáticamente al levantar el contenedor.

---

## 🔄 Flujo de Comunicación (El Loop del Tool Calling)

1.  **Petición Inicial:** El usuario escribe un mensaje en el Frontend (ej. *"¿Cuántas transacciones hay?"*).
2.  **Orquestación:** El Backend recibe el mensaje y lo envía a la API de Groq (Llama 3.3) junto con el historial y el esquema de las herramientas permitidas (`execute_sql_query`).
3.  **Invocación de Herramienta:** Llama 3.3 detecta que necesita información. Pausa la generación de texto y devuelve un objeto JSON pidiendo ejecutar SQL.
4.  **Ejecución Segura:** El Backend intercepta esta petición, toma el string SQL, abre una transacción de **solo lectura** usando `pg`, y consulta el contenedor local de PostgreSQL.
5.  **Realimentación:** La base de datos devuelve los datos crudos. El Backend los anexa al historial de la conversación bajo el rol `tool` y vuelve a llamar a la API de Groq.
6.  **Respuesta Final:** Llama 3.3 analiza los datos devueltos por la base de datos, formula una respuesta en lenguaje natural y el Backend se la entrega al Frontend para renderizarla.

---

## 🐳 Estrategia de Docker y Contenedores

Para garantizar una experiencia de desarrollo fluida y libre de conflictos:
*   **Base de Datos (En Docker):** Todo el ecosistema de almacenamiento (PostgreSQL, Supabase Studio, PostgREST) corre dentro de contenedores de Docker orquestados automáticamente por la CLI de Supabase.
*   **Aplicación Web (Nativa en Desarrollo):** El servidor de Next.js corre de forma nativa (`npm run dev`) en el host para aprovechar el *Fast Refresh* y *Hot Reloading*, conectándose a la base de datos a través de una red virtual en `localhost:54322`.
*   *(Nota: Se incluye un `Dockerfile` en la raíz para empaquetar Next.js en su propio contenedor cuando el proyecto pase a etapa de producción).*

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (v18 o superior).
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (o Docker Engine ejecutándose).
*   Una API Key gratuita de [Groq Console](https://console.groq.com/).

### Paso 1: Clonar e instalar dependencias
```bash
git clone <url-del-repositorio>
cd chatbot-sql-agent
npm install
Paso 2: Variables de Entorno
Crea un archivo llamado .env.local en la raíz del proyecto y agrega tus credenciales:

Fragmento de código
# Groq API configuration
GROQ_API_KEY=gsk_tu_api_key_aqui
GROQ_MODEL=llama-3.3-70b-versatile

# Local Supabase PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
Paso 3: Levantar la Base de Datos (Docker)
Asegúrate de que Docker esté abierto. Luego, ejecuta el comando para levantar el entorno de Supabase. Esto descargará las imágenes, aplicará las migraciones y ejecutará el seed.sql:

Bash
npx supabase start
Para ver la interfaz visual de la base de datos, visita: http://127.0.0.1:54323

Paso 4: Levantar el Servidor de Next.js
En una nueva pestaña de tu terminal, arranca el servidor de desarrollo:

Bash
npm run dev
Paso 5: ¡Interactúa!
Abre tu navegador en http://localhost:3000/dashboard y comienza a realizar consultas sobre el portafolio financiero en lenguaje natural.

🛑 Comandos Útiles
Apagar la base de datos: npx supabase stop

Resetear la base de datos (y recargar el seed): npx supabase db reset

Crear una nueva migración: npx supabase migration new nombre_feature