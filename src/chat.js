// Importamos la lógica pura y el System Prompt que creamos en el Subpaso anterior
import { SYSTEM_PROMPT, sanitizeInput, limitChatHistory, formatErrorMessage } from './utils.js';

// El historial ahora arranca con la personalidad de Arthur pre-cargada de forma silenciosa
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [SYSTEM_PROMPT];

// --- UTILIDADES COMPARTIDAS (Manipulan el DOM dinámicamente) ---

function appendMessageToUI(role, text) {
    if (role === 'system') return;

    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    // Obtener la hora actual (ej. 14:30)
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgContainer = document.createElement('div');
    msgContainer.style.display = 'flex';
    msgContainer.style.flexDirection = 'column';
    msgContainer.style.gap = '5px';
    
    // Alinear el contenedor según quién habla
    if (role === 'user') {
        msgContainer.style.alignItems = 'flex-end';
    } else {
        msgContainer.style.alignItems = 'flex-start';
    }

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
    
    // Crear el timestamp
    const timeElement = document.createElement('span');
    timeElement.textContent = timeString;
    timeElement.style.fontSize = '0.75rem';
    timeElement.style.color = '#888';

    // Si es Arthur, creamos el botón de copiar
    if (role === 'assistant' || role === 'error') {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copiar';
        copyBtn.style.background = 'none';
        copyBtn.style.border = 'none';
        copyBtn.style.color = '#4CAF50';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.fontSize = '0.75rem';
        copyBtn.style.padding = '0';
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = '✅ Copiado!';
            setTimeout(() => { copyBtn.textContent = '📋 Copiar'; }, 2000);
        });

        // Agrupamos el tiempo y el botón
        const footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.gap = '10px';
        footerDiv.appendChild(timeElement);
        footerDiv.appendChild(copyBtn);
        
        msgContainer.appendChild(msgElement);
        msgContainer.appendChild(footerDiv);
    } else {
        msgContainer.appendChild(msgElement);
        msgContainer.appendChild(timeElement);
    }

    chatWindow.appendChild(msgContainer);
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
