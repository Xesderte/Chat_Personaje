import { initChat } from './chat.js'; // Importamos la lógica del chat

const container = document.getElementById('app-container');

// 1. Organizado por vistas mediante funciones
const views = {
    '/home': () => `
        <section class="view-section">
        <h1>Bienvenido a ComicSansCon AI</h1>
        <p>Selecciona tu personaje para comenzar la experiencia.</p>
        
        <div class="character-grid">
            <div class="character-card">
                <div class="character-avatar">🤠</div>
                <div class="character-info">
                    <h3>Arthur, el Forajido</h3>
                    <p>Un vaquero rudo pero leal. Experto en supervivencia, asaltos a diligencias y contar historias junto a la fogata del campamento.</p>
                    <button data-route="/chat" class="select-btn">Chatear con Arthur</button>
                </div>
            </div>
            </div>
        </section>
    `,
    '/chat': () => `
        <section class="view-section">
        <h1>Interfaz de Chat</h1>
        <div id="chat-window" class="chat-window">
            </div>
        <form id="chat-form" class="chat-form">
            <input type="text" id="chat-input" placeholder="Escribe un mensaje..." autocomplete="off" required />
            <button type="submit" id="send-btn">Enviar</button>
        </form>
        </section>
    `,
    '/about': () => `
        <section class="view-section">
        <h1>Acerca del Proyecto</h1>
        <p>Desarrollado para ComicSansCon. Integración de Vercel y Gemini AI.</p>
        </section>
    `
};

// 2. Función de renderizado
function renderView(pathname) {
    const viewHTML = views[pathname] ? views[pathname]() : views['/home']();
    container.innerHTML = viewHTML;

    // ¡PUNTO CLAVE! Si entramos al chat, inicializamos su lógica
    if (pathname === '/chat') {
        initChat();
    }
}

// 3. Router con History API
function navigateTo(pathname) {
    window.history.pushState({}, '', pathname);
    renderView(pathname);
}

// 4. Escuchamos clics en toda la página (Delegación de eventos)
document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-route]')) {
        const route = e.target.getAttribute('data-route');
        navigateTo(route);
    }
});

// 5. Soporte para botones Atrás/Adelante del navegador
window.addEventListener('popstate', () => {
    renderView(window.location.pathname);
});

// Inicialización
const initialRoute = window.location.pathname === '/' ? '/home' : window.location.pathname;
renderView(initialRoute);