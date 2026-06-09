// Importamos el SDK oficial de Google que instalaste en el paso anterior
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos el cliente usando la variable de entorno segura (NUNCA expuesta al frontend)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    // 1. Validación de Método: Solo permitimos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Utilice POST.' });
    }

    try {
        const { messages } = req.body;

        // 2. Validación de Seguridad
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Historial de mensajes inválido o vacío.' });
        }

        // 3. Extraer el System Prompt y los mensajes del chat
        // Buscamos el mensaje del sistema (que nuestro utils.js siempre pone al principio)
        const systemMessage = messages.find(msg => msg.role === 'system');
        // Filtramos el resto de la conversación
        const chatHistory = messages.filter(msg => msg.role !== 'system');

        // 4. Mapear el historial al formato estricto que exige Gemini
        const geminiFormatContents = chatHistory.map(msg => ({
            // Gemini solo entiende 'user' o 'model'. Si nuestro frontend dice 'assistant', lo pasamos a 'model'
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // 5. Instanciar el modelo Gemini 1.5 Flash con el System Prompt
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            // Aquí inyectamos la personalidad de Arthur para que gobierne toda la respuesta
            systemInstruction: systemMessage ? systemMessage.content : "",
        });

        // 6. Hacer la petición real a la IA enviando el historial mapeado
        const result = await model.generateContent({
            contents: geminiFormatContents, 
            generationConfig: {
                maxOutputTokens: 150, 
                temperature: 0.7, 
            }
        });
        // Extraemos el texto puro de la respuesta
        const botReply = result.response.text();

        // 7. Devolvemos la respuesta al frontend respetando el contrato
        return res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error('Error interno del servidor con Gemini:', error);
        return res.status(500).json({ error: 'Error interno del servidor al procesar el chat con la IA.' });
    }
}