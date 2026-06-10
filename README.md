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
   git clone [[Link_RepositorioGutHub](https://github.com/Xesderte/Chat_Personaje.git)]
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
 o alternativamente: npx vitest
\`\`\`

## 📁 Estructura de las Carpetas
```text
📁 CHAT_PERSONAJE/
├── 📁 api/
│   └── 📄 functions.js
├── 📁 node_modules/
├── 📁 src/
│   ├── 📄 app.js
│   ├── 📄 chat.js
│   ├── 📄 styles.css
│   └── 📄 utils.js
├── 📁 test/
│   ├── 📄 app.test.js
│   └── 📄 utils.test.js
├── ⚙️ .env
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── 🖼️ ArthurMorgan.PNG
├── 📄 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 README.md
└── ⚙️ vercel.json
```

## 🔗 Enlaces del Proyecto

* **Aplicación Desplegada:** [[Link_Vercel](https://chat-personaje.vercel.app)]
* **Repositorio de GitHub:** [[Link_RepositorioGutHub](https://github.com/Xesderte/Chat_Personaje.git)]

## 📸 Capturas de Pantalla

*(Formato Tablet)*
* <img width="895" height="561" alt="Image" src="https://github.com/user-attachments/assets/341b414c-f114-4766-8f07-22f853ddc5b6" />
*(Formato Celular)*
* <img width="394" height="647" alt="Image" src="https://github.com/user-attachments/assets/24ade9d9-ce22-463c-9ab3-c1cd1b113a3a" />
*(Error 404)*
* <img width="495" height="806" alt="Image" src="https://github.com/user-attachments/assets/5ef0bda7-e08e-4817-b3f7-3483fa2cc8d8" />
* <img width="995" height="605" alt="Image" src="https://github.com/user-attachments/assets/701501d1-bf06-49d5-931a-0b5963659cce" />

## 🤖 Registro del Uso de AI en el Proyecto

Durante el desarrollo de este proyecto, utilicé Inteligencia Artificial (Gemini) como herramienta de aprendizaje y apoyo de las siguientes maneras:
* **Generación del System Prompt:** Utilicé IA para refinar las instrucciones de comportamiento de Arthur, logrando que mantuviera su "ignorancia tecnológica" de manera consistente.
* <img width="724" height="531" alt="Image" src="https://github.com/user-attachments/assets/1a237c4a-1650-4959-8dee-5b33ed814dc4" />
* **Code Review y Debugging:** Consulté a la IA para auditar la seguridad de la implementación de mi Vercel Serverless Function y asegurarme de que el manejo asíncrono con `try/catch` fuera robusto.
* <img width="628" height="262" alt="Image" src="https://github.com/user-attachments/assets/045bd356-2da7-42d3-b9ae-81216793dc94" />
* **Testing:** Me apoyé en la IA para comprender mejor el patrón AAA (Arrange, Act, Assert) al momento de escribir las pruebas unitarias con Vitest para mi lógica de recorte de historial.
* <img width="736" height="736" alt="Image" src="https://github.com/user-attachments/assets/e2b76ab5-964c-4ea6-a6b6-6f87e2682431" />
* **Resolución y Manejo de Errores (Troubleshooting):** Utilicé la IA para identificar y diagnosticar respuestas de red y códigos de estado HTTP durante la integración con la API (como errores 400 Bad Request por formatos nulos, 
429 de límite de cuota y 503 de servidores saturados), optimizando la forma en que el backend empaqueta los datos.
* <img width="734" height="669" alt="Image" src="https://github.com/user-attachments/assets/4566171f-314e-4c53-89d7-a46a34c01195" />
* **Diseño UI/UX y CSS Responsivo:** Me apoyé en la IA para refactorizar la cabecera del chat, implementando un diseño estilo "WhatsApp" (avatar circular y nombre alineado) para mejorar la usabilidad y solucionar problemas de renderizado del fondo en dispositivos móviles.
* <img width="741" height="251" alt="Image" src="https://github.com/user-attachments/assets/4d579e34-24a8-4376-97e3-d5e62a511303" />

* <img width="659" height="764" alt="Image" src="https://github.com/user-attachments/assets/301da6cd-32a9-4249-8ed0-f00bb3a914ea" />