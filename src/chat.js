export function initChat() {
    console.log("¡La vista de chat se ha cargado correctamente!");
    
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue
        console.log("El usuario escribió:", input.value);
        input.value = ""; // Limpia el input
    });
}