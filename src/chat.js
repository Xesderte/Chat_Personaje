// El historial se mantiene seguro en la memoria de la sesión
let chatHistory = [];

// --- UTILIDADES COMPARTIDAS (Manipulan el DOM dinámicamente) ---

function appendMessageToUI(role, text) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    
    if (role === 'user') {
        msgElement.classList.add('message-user');
    } else if (role === 'error') {
        msgElement.classList.add('message-error');
    } else {
        msgElement.classList.add('message-assistant');
    }
    
    msgElement.textContent = text;
    chatWindow.appendChild(msgElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');
    if (!chatWindow || !sendBtn) return;

    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.classList.add('message', 'message-assistant', 'typing');
    indicator.textContent = 'Escribiendo...';
    
    chatWindow.appendChild(indicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    sendBtn.disabled = true; 
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');
    
    if (indicator) indicator.remove();
    if (sendBtn) sendBtn.disabled = false;
    if (input) input.focus();
}

// --- FUNCIÓN DE INICIALIZACIÓN (Solo monta la vista) ---
export function initChat() {
    // Cada vez que entramos a la vista, redibujamos el estado actual del historial
    if (chatHistory.length === 0) {
        appendMessageToUI('assistant', 'Howdy, partner. ¿De qué querés hablar?');
    } else {
        chatHistory.forEach(msg => appendMessageToUI(msg.role, msg.content));
    }
}

// --- DELEGACIÓN GLOBAL DE EVENTOS (Se ejecuta UNA SOLA VEZ) ---
// Escuchamos los submits de toda la página, pero solo actuamos si vienen del chat-form
document.body.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'chat-form') {
        e.preventDefault();

        const input = document.getElementById('chat-input');
        if (!input) return;

        // ¡CORRECCIÓN DE BUG! Cambiamos ariaValueMax por value para capturar el texto real
        const text = input.value.trim(); 
        if (!text) return;

        // 1. Mostramos el mensaje del usuario y limpiamos el input
        appendMessageToUI('user', text);
        input.value = '';

        // 2. Guardamos en el historial en memoria
        chatHistory.push({ role: 'user', content: text });

        // 3. Mostramos estado de carga
        showTypingIndicator();

        // 4. Petición segura al Backend
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Fallo en la conexión con el servidor');
            }

            // 5. Mostramos la respuesta y la guardamos en el historial
            const botReply = data.reply;
            appendMessageToUI('assistant', botReply);
            chatHistory.push({ role: 'assistant', content: botReply });
        } catch (error) {
            console.error('Error en el chat: ', error);
            appendMessageToUI('error', 'Maldita sea... parece que perdimos la conexión al campamento. Intenta de nuevo.');    
        } finally {
            removeTypingIndicator();
        }
    }
});