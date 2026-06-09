// === SUBPASO 3.1: EL SYSTEM PROMPT ===

export const SYSTEM_PROMPT = `
Eres Arthur Morgan del año 1899. Eres un forajido rudo, leal, cansado y de pocas palabras.
[Inspirate en Arthur Morgan en el Juego de Red Dead Redemtion 2]

REGLAS ESTRICTAS DE FORMATO:
1. PROHIBIDO usar acotaciones teatrales, descripciones de acciones o emociones entre asteriscos o paréntesis (ejemplo: no uses "*suspira*", "*te mira fijamente*", "(se ajusta el revólver)").
2. Responde ÚNICAMENTE con lo que dices en voz alta.
3. Sé extremadamente conciso y directo. Tus respuestas NO DEBEN superar las 3 o 4 oraciones cortas. Eres un hombre de acción, no de discursos.
4. Si te hacen preguntas complejas, responde brevemente. A no ser que te pidan contar Historias.
5. NUNCA rompas el personaje. Jamás digas que eres una inteligencia artificial o un programa. Eres Arthur, un hombre de carne y hueso.
`;


/**
 * 1. Limpiador de Input (sanitizeInput)
 * Recibe el texto del usuario, recorta espacios en los extremos y 
 * reemplaza múltiples espacios o saltos de línea por un único espacio.
 * Esto evita enviar tokens innecesarios a la IA.
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/\s+/g, ' ');
}

/**
 * 2. Gestor de Límite de Historial (limitChatHistory)
 * Recibe el historial completo y asegura que no exceda un máximo de mensajes,
 * manteniendo SIEMPRE el System Prompt intacto en la posición [0].
 */
export function limitChatHistory(history, maxMessages = 10) {
    // Validamos que sea un array válido
    if (!Array.isArray(history) || history.length === 0) return [];
    
    // Si el historial (sin contar el System Prompt) es menor o igual al límite, se devuelve igual
    if (history.length <= maxMessages + 1) return history;

    // Extraemos el System Prompt (que siempre está en la primera posición)
    const systemPrompt = history[0];
    
    // Extraemos solo los últimos 'maxMessages' del final del array
    const recentMessages = history.slice(-maxMessages);

    // Devolvemos un nuevo array concatenando el System Prompt y los mensajes recientes
    return [systemPrompt, ...recentMessages];
}

/**
 * 3. Parseador de Errores (formatErrorMessage)
 * Recibe un error (ya sea un string o un objeto Error) y devuelve
 * un mensaje amigable, manteniendo el tono del personaje.
 */
export function formatErrorMessage(error) {
    // Podríamos loguear el error real en consola para debug, pero al usuario 
    // siempre le devolvemos una respuesta inmersiva y segura.
    return "Maldita sea... parece que perdimos la conexión al campamento. Intenta de nuevo.";
}