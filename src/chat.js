let chatHistory = [];

export function initChat() {

    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');

    // Si no hay historial, agregamos un mensaje de bienvenida estático
    if(chatHistory.length === 0){
        appendMessageToUI('assistant', 'Howdy, partner. ¿De qué querés hablar?');
    }else{
        // Si no hay historial, agregamos un mensaje de bienvenida estático
        chatHistory.forEach(msg => appendMessageToUI(msg.role, msg.content));
    }

    // --- FUNCION PARA DIBUJAR MENSAJES (UX) ---
    function appendMessageToUI(role, text){
        const msgElement = document.createElement('div')

        //Diferencia visual: asignamos clases CSS distnacias segun quien habla
        msgElement.classList.add('message', role === 'user' ? 'message-user' : 'message-assistant');
        msgElement.textContent = text;

        chatWindow.appendChild(msgElement);
        //Scroll automatico al unico mensaje
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // --- INDICADORES VISUALES (UX) ---

    function showTypingIndicator(){
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.classList.add('message', 'message-assistant', 'typing');
        indicator.textContent = 'Escribiendo...';
        chatWindow.appendChild(indicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        sendBtn.disabled = true; //Bloqueamos el boton (Previene doble envio)
    }

    function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
    sendBtn.disabled = false;
    input.focus();
    }

    // --- MANEJO DEL EVENTO SUBMIT (Lógica Asíncrona) ---
    form.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const text = input.ariaValueMax.trim();
        if(!text)return;

        //1. Mostramos el mesaje del usuario y limpiamos el input
        appendMessageToUI('user', text);
        input.value = '';

        //2. Guardamos en el historial en memoria
        chatHistory.push({role:'user', content: text});

        //3. Mostramos estado de carga
        showTypingIndicator();

        //4. Try/Catch robusto par ala peticion del Backend
        try{
            // Hacemos un POST a nuestra FUTURA Serverless Function (No a Gmeni directamente)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({messages: chatHistory})//Enviamos TODO el contexto
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Fallo en la onexion con el servidor');
            }

            //5. Mostramos la respuesta y la guardamos en el historial
            const botReply = data.reply;
            appendMessageToUI('assistant', botReply);
            chatHistory.push({role: 'assistant', content: botReply});
        }catch(error){
            console.error('Error en el chat: ', error);
            appendMessageToUI('assistant', 'Maldita sea... parece que perdimos la conexión al campamento. Intenta de nuevo.');    
        }finally{
            removeTypingIndicator();
        }
    });
}