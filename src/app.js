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
    `,
    // NUEVA VISTA 404
    '/404': () => `
        <section class="view-section empty-state">
            <span>🌵</span>
            <h1>Error 404</h1>
            <p>Parece que te perdiste en el desierto, forastero. Esta ruta no existe.</p>
            <br>
            <button data-route="/home" class="select-btn">Volver al campamento</button>
        </section>
    `
};

// 2. Función de renderizado
function renderView(pathname) {
    // Si la ruta existe la renderiza, si no, dispara la vista 404
    const viewHTML = views[pathname] ? views[pathname]() : views['/404']();
    container.innerHTML = viewHTML;

    // Feedback Visual (Estado Activo) ---
    // Seleccionamos todos los botones de la barra de navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        // Si el data-route del botón coincide con la ruta actual, le damos la clase 'active'
        if (btn.getAttribute('data-route') === pathname) {
            btn.classList.add('active');
        } else {
            // Si no coincide, nos aseguramos de quitársela
            btn.classList.remove('active');
        }
    });

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