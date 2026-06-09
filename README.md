# 🤠 ComicSansCon AI - Chateando con Arthur

Una Single Page Application (SPA) responsiva que permite a los usuarios mantener una conversación interactiva con un personaje ficticio mediante la API de Google Gemini.

Este proyecto es una Prueba de Concepto (POC) desarrollada para la agencia ComicSansCon, evaluando la viabilidad de integrar IA conversacional en experiencias para fans.

## 🎭 Sobre el Personaje: Arthur, el Forajido
Para este proyecto he elegido a Arthur, un vaquero rudo, cansado pero profundamente leal del viejo oeste (inspirado en la década de 1890). 
Su personalidad está configurada mediante un *System Prompt* estricto que le impide romper el personaje, y cuenta con una "ignorancia tecnológica" programada: no sabe qué es el internet, los celulares o el software moderno, lo que genera interacciones muy inmersivas y divertidas.

## 🚀 Tecnologías Utilizadas
* **Frontend:** HTML5, CSS3 (Mobile-First, Flexbox), Vanilla JavaScript (ES6+).
* **Navegación:** History API (SPA Routing sin recargas).
* **Backend / Proxy:** Vercel Serverless Functions (`/api/functions.js`).
* **IA:** Google Gemini AI API (`gemini-2.5-flash`).
* **Testing:** Vitest.
* **Despliegue:** Vercel.

## ⚙️ Requisitos y Ejecución Local

Para correr este proyecto en tu máquina local, sigue estos pasos:

1. **Clonar el repositorio y entrar a la carpeta:**
   \`\`\`bash
   git clone [TU_ENLACE_DE_GITHUB_AQUI]
   cd [NOMBRE_DE_LA_CARPETA]
   \`\`\`

2. **Instalar las dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar Variables de Entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto basándote en el archivo `.env.example`.
   \`\`\`env
   GEMINI_API_KEY=tu_api_key_real_aqui
   \`\`\`
   *(Nota: El archivo `.env` está ignorado en Git por seguridad).*

4. **Ejecutar el entorno de desarrollo con Vercel CLI:**
   \`\`\`bash
   vercel dev
   \`\`\`
   La aplicación estará disponible en `http://localhost:3000`.

## 🧪 Cómo Ejecutar los Tests

El proyecto cuenta con pruebas unitarias para asegurar la integridad de la capa de transformación de datos (utilidades). Para ejecutarlos, corre el siguiente comando:

\`\`\`bash
npm run test
# o alternativamente: npx vitest
\`\`\`

## 🌐 Cómo Desplegar a Vercel

1. Sube tu código a un repositorio en GitHub.
2. Inicia sesión en [Vercel](https://vercel.com/) y haz clic en "Add New..." > "Project".
3. Importa tu repositorio de GitHub.
4. En la sección **Environment Variables**, añade:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** `[Pega tu API Key de Google aquí]`
5. Haz clic en **Deploy**. Vercel detectará automáticamente el archivo `vercel.json` para el routing de la SPA y la carpeta `/api` para las funciones Serverless.

## 🔗 Enlaces del Proyecto

* **Aplicación Desplegada:** [PEGA_AQUI_TU_LINK_DE_VERCEL_EJEMPLO.vercel.app]
* **Repositorio de GitHub:** [PEGA_AQUI_TU_LINK_DE_GITHUB]

## 📸 Capturas de Pantalla

*(Reemplaza estos textos con tus imágenes)*
* `![Vista Home Mobile](./ruta-a-tu-imagen/home-mobile.png)`
* `![Vista Chat Desktop](./ruta-a-tu-imagen/chat-desktop.png)`
* `![Estado de Error/Carga](./ruta-a-tu-imagen/error-state.png)`

## 🤖 Registro del Uso de AI en el Proyecto

Durante el desarrollo de este proyecto, utilicé Inteligencia Artificial (Gemini) como herramienta de aprendizaje y apoyo de las siguientes maneras:
* **Generación del System Prompt:** Utilicé IA para refinar las instrucciones de comportamiento de Arthur, logrando que mantuviera su "ignorancia tecnológica" de manera consistente.
* **Code Review y Debugging:** Consulté a la IA para auditar la seguridad de la implementación de mi Vercel Serverless Function y asegurarme de que el manejo asíncrono con `try/catch` fuera robusto.
* **Testing:** Me apoyé en la IA para comprender mejor el patrón AAA (Arrange, Act, Assert) al momento de escribir las pruebas unitarias con Vitest para mi lógica de recorte de historial.