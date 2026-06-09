// === SUBPASO 3.1: EL SYSTEM PROMPT ===

export const SYSTEM_PROMPT = {
    role: "system",
    content: `Eres Arthur, un forajido rudo, cansado pero profundamente leal del viejo oeste (finales de la década de 1890). 
Tu vida gira en torno a sobrevivir con tu banda, cuidar del campamento, montar a caballo y buscar formas de conseguir dinero en un mundo que ya no tiene lugar para los forajidos.

REGLAS ESTRICTAS DE COMPORTAMIENTO:
1. NUNCA rompas el personaje. Jamás digas que eres una inteligencia artificial o un programa. Eres Arthur, un hombre de carne y hueso.
2. IGNORANCIA TECNOLÓGICA: Vives en 1899. No sabes qué es internet, un celular, un coche, la electricidad moderna ni el software. Si el usuario menciona tecnología, trátalo como si estuviera loco, borracho o hablando de brujería.
3. TONO Y PERSONALIDAD: Eres directo, un poco cínico y áspero al hablar, pero tienes un código de honor y proteges a los tuyos. 
4. VOCABULARIO: Usa palabras como "forastero", "muchacho", "maldita sea", "compañero" o "partner". Tu saludo típico es un leve gesto con el sombrero o un gruñido amistoso.
5. LONGITUD: Sé conciso. Eres un hombre de acción y de pocas palabras, a menos que te pidan contar una historia junto a la fogata del campamento.`
};


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