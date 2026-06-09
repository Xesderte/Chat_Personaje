// Importamos la lógica pura y el System Prompt que creamos en el Subpaso anterior
import { SYSTEM_PROMPT, sanitizeInput, limitChatHistory, formatErrorMessage } from './utils.js';

// El historial ahora arranca con la personalidad de Arthur pre-cargada de forma silenciosa
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [SYSTEM_PROMPT];

// --- UTILIDADES COMPARTIDAS (Manipulan el DOM dinámicamente) ---

function appendMessageToUI(role, text) {
    // ¡IMPORTANTE! Nunca dibujamos el System Prompt en la pantalla del usuario
    if (role === 'system') return;

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
    
    const chatWindow = document.getElementById('chat-window');
    
    // Limpiamos la ventana por seguridad y recorremos la variable chatHistory
    chatWindow.innerHTML = ''; 
    chatHistory.forEach(msg => {
        // Nos aseguramos de no pintar nunca el System Prompt en pantalla
        if (msg.role !== 'system') {
            appendMessageToUI(msg.role, msg.content);
        }
    });
    
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // 1. Limpiamos el almacenamiento del navegador
            localStorage.removeItem('chatHistory');
            
            // 2. Reiniciamos la variable de memoria dejándola solo con las reglas de Arthur
            chatHistory = [SYSTEM_PROMPT];
            
            // 3. Vaciamos la pantalla visualmente
            chatWindow.innerHTML = '';
            
            // Opcional: Mostrar un mensaje temporal de que se borró
            appendMessageToUI('system', 'Historial borrado. Arthur ya no recuerda nada.');
            // (Nota: como nuestra función appendMessageToUI ignora el rol 'system', 
            // esto no se pintará a menos que cambies tu función, pero sirve de limpieza).
        });
    }
}

// --- DELEGACIÓN GLOBAL DE EVENTOS (Se ejecuta UNA SOLA VEZ) ---
document.body.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'chat-form') {
        e.preventDefault();

        const input = document.getElementById('chat-input');
        if (!input) return;

        const text = sanitizeInput(input.value); 
        if (!text) return; 

        appendMessageToUI('user', text);
        input.value = '';

        // Guardamos en el historial en memoria
        chatHistory.push({ role: 'user', content: text });

        showTypingIndicator();

        // Aplicamos el límite de historial
        chatHistory = limitChatHistory(chatHistory, 10);

        // 💾 NUEVO: Guardamos el historial del usuario antes de llamar a la API
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Fallo en la conexión con el servidor');
            }

            // Mostramos la respuesta y la guardamos en el historial
            const botReply = data.reply;
            appendMessageToUI('assistant', botReply);
            chatHistory.push({ role: 'assistant', content: botReply });

            // 💾 NUEVO: Guardamos el historial actualizado con la respuesta de Arthur
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        } catch (error) {
            console.error('Error en el chat: ', error);
            const errorMessage = formatErrorMessage(error);
            appendMessageToUI('error', errorMessage);    
        } finally {
            removeTypingIndicator();
        }
    }
});
