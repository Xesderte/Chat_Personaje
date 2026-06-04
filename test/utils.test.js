import { describe, it, expect } from 'vitest';
import { sanitizeInput, limitChatHistory, formatErrorMessage } from './utils.js';

describe('Pruebas de la Capa de Transformación (utils.js)', () => {

    // --- TEST 1 ---
    it('sanitizeInput debe limpiar espacios extra al principio, al final y entre palabras', () => {
        const input = '   Hola    forastero,   ¿cómo va   todo?   ';
        const expected = 'Hola forastero, ¿cómo va todo?';
        
        const result = sanitizeInput(input);
        
        expect(result).toBe(expected);
    });

    // --- TEST 2 ---
    it('sanitizeInput debe devolver un string vacío si recibe un valor nulo, indefinido o vacío', () => {
        expect(sanitizeInput('')).toBe('');
        expect(sanitizeInput(null)).toBe('');
        expect(sanitizeInput(undefined)).toBe('');
        expect(sanitizeInput(12345)).toBe(''); // Incluso si por error llega un número
    });

    // --- TEST 3 ---
    it('limitChatHistory debe recortar el historial respetando el límite y conservando el System Prompt', () => {
        // 1. Preparamos un historial falso con 1 System Prompt + 15 mensajes
        const mockSystemPrompt = { role: 'system', content: 'Reglas de Arthur' };
        const mockHistory = [mockSystemPrompt];
        
        for (let i = 1; i <= 15; i++) {
            mockHistory.push({ role: 'user', content: `Mensaje número ${i}` });
        }

        // 2. Ejecutamos la función fijando un límite máximo de 10 mensajes
        const result = limitChatHistory(mockHistory, 10);

        // 3. Verificamos los resultados
        // El tamaño total debe ser 11 (1 System Prompt + 10 mensajes)
        expect(result.length).toBe(11);
        
        // La posición 0 debe seguir siendo SIEMPRE el System Prompt
        expect(result[0]).toEqual(mockSystemPrompt);
        
        // El último mensaje debe ser el número 15 (el más reciente)
        expect(result[result.length - 1].content).toBe('Mensaje número 15');
    });

    // --- TEST 4 ---
    it('formatErrorMessage debe devolver siempre el mensaje inmersivo del personaje', () => {
        const errorCrudo = new Error('500 Internal Server API Crash');
        
        const result = formatErrorMessage(errorCrudo);
        
        expect(result).toBe('Maldita sea... parece que perdimos la conexión al campamento. Intenta de nuevo.');
    });

});