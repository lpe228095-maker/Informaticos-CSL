/**
 * @file openaiController.js
 * @description
 * Controlador unificado para trabajar con:
 * - **OpenAI** → embeddings y chat con memoria de sesión (Agents SDK).
 * - **OpenSearch** → búsqueda semántica de contexto.
 *
 * Instrucciones del agente:
 * - "Eres un asistente que ayuda a responder preguntas de ciencia y tecnología de forma clara y sencilla."
 *
 * Modelos:
 * - Embeddings: `text-embedding-3-small`
 * - Chat: `gpt-5-nano`
 *
 * Variables de entorno requeridas:
 * - `OPENAI_API_KEY`
 * - `OPENSEARCH_URL`
 * - `OPENSEARCH_INDEX`
 */

import OpenAI from "openai";
import { z } from "zod";
import { Agent, run, tool } from "@openai/agents";
import { Redis } from "./redis.js";
import * as dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_CHAT_MODEL;
const modelEmbedding = process.env.OPENAI_EMBEDDING_MODEL;

/**
 * Genera un embedding numérico a partir de un texto.
 *
 * @async
 * @function embedding
 * @param {string} text - Texto de entrada.
 * @returns {Promise<number[]>} Vector de 1536 dimensiones.
 */
export async function embedding(text) {
    if (!text || typeof text !== "string") {
        throw new Error("El parámetro 'text' debe ser un string válido.");
    }

    const response = await client.embeddings.create({
        model: modelEmbedding,
        input: text,
    });

    return response.data[0].embedding;
}

/**
 * Invocación directa a OpenAI (sin agente ni memoria de sesión).
 *
 * Útil para consultas simples: recibe un prompt y devuelve una respuesta en texto.
 *
 * @async
 * @function invoke
 * @param {string} prompt - Texto o instrucción a enviar al modelo.
 * @returns {Promise<string>} Respuesta generada en texto plano.
 *
 * @example
 * const r = await invoke("Resume la teoría de la relatividad en 2 frases.");
 * console.log(r);
 */
export async function invoke(prompt) {
    if (!prompt || typeof prompt !== "string") {
        throw new Error("El parámetro 'prompt' debe ser un string válido.");
    }

    const response = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "(sin respuesta del modelo)";
}

/**
 * Instrucciones del agente
 * TODO: Ajusta el prompt del agente a tu necesidad
 *
 * Este agente está diseñado como un asistente informativo oficial para el
 * hackatón "NASA SpaceApp Challenge". Su función es apoyar a los usuarios
 * resolviendo preguntas relacionadas con el evento de forma confiable,
 * clara y concisa.
 *
 * Directrices:
 * - Mantén un tono profesional, accesible y orientado a la divulgación científica.
 * - Responde de manera breve y directa, evitando ambigüedades o respuestas extensas.
 * - Cuando una consulta requiera información precisa, técnica o de carácter oficial,
 *   utiliza la herramienta "context" para recuperar fragmentos relevantes de la
 *   base de conocimiento en OpenSearch y fundamentar tu respuesta.
 * - Si la pregunta es general, puedes responder directamente sin necesidad de contexto.
 * - En todos los casos, procura que las respuestas sean fáciles de comprender incluso
 *   para participantes sin formación técnica avanzada.
 */
const agentInstructions = `
Eres un asistente informativo oficial para el "Natural Alert Guatemala". 

(Para el evento local de Nasa SpaceApps Challenge Guatemala)
El objetivo del chat es brindar informacion sobre que hacer ante un desastre natural, antes, durante y despues,
siguiendo los lineamientos oficiales de CONRED e INSIVUMEH de Guatemala

Siempre que respondas, debes **consultar primero la documentación oficial de CONRED e INSIVUMEH de Guatemala**
a través de la herramienta \`context\`. Usa la herramienta para recuperar
fragmentos relevantes antes de generar tu respuesta.  
Solo si la pregunta es trivial o de saludo (ej. "hola", "gracias"),
puedes contestar sin usar la herramienta.

Reglas:
- Usa el contenido recuperado con \`context\` como fuente principal.
- Si la herramienta no devuelve nada útil, responde con base en tu conocimiento general, pero deja claro que no encontraste información oficial.
- Nunca inventes información no respaldada por la herramienta.
- Responde de manera breve, clara y comprensible, no mas de 250 tokens.
`;

/**
 * Chat con memoria de sesión.
 *
 * Usa un agente con instrucciones predefinidas:
 * "Eres un asistente que ayuda a responder preguntas de ciencia y tecnología de forma clara y sencilla."
 *
 * @async
 * @function chat
 * @param {string} sessionId - Identificador único de la sesión.
 * @param {string} text - Mensaje del usuario.
 * @returns {Promise<string>} Respuesta generada por el modelo.
 */
export async function chat(sessionId, text) {
    if (!sessionId || typeof sessionId !== "string") {
        throw new Error("El parámetro 'sessionId' debe ser un string válido.");
    }
    if (!text || typeof text !== "string") {
        throw new Error("El parámetro 'text' debe ser un string válido.");
    }
    if (!model) {
        throw new Error("El parámetro 'model' debe ser un modelo válido.");
    }

    // Recuperar historial desde Redis (sin JSON.parse)
    const stored = await Redis.get(`session:${sessionId}`);
    const history = stored?.messages ?? [];

    const newTurn = [{ role: "user", content: text }];

    const agentDef = new Agent({
        name: "NASA_CHALLENGE",
        instructions: agentInstructions.trim(),
        model,
        tools: [contextTool],
    });

    const inputText = [...history, ...newTurn]
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n");

    const result = await run(agentDef, inputText, { stream: false });
    const output = (result?.finalOutput ?? result?.text);

    const assistantMsg = { role: "assistant", content: String(output) };
    const updatedHistory = [...history, ...newTurn, assistantMsg];

    await Redis.set(`session:${sessionId}`, { messages: updatedHistory });

    return String(output) || "(sin respuesta del modelo)";
}

/**
 * Tool: context
 * Busca fragmentos relevantes en OpenSearch.
 * TODO: Ajusta la descripción de la herramienta a tu necesidad
 *
 * @type {import("@openai/agents").Tool}
 */
export const contextTool = tool({
    name: "context",
    description: `Recupera fragmentos de la documentación oficial (Redis) del evento local de Nasa SpaceApps Challenge Guatemala
    Para recuperar datos oficiales sobre desastres naturales
    Esta es la fuente principal y autorizada; úsala siempre que sea relevante.`,
    parameters: z.object({
        query: z.string().describe("Consulta a responder usando la documentación oficial."),
        k: z.number().default(2).describe("Número de fragmentos relevantes a recuperar, entre 1 y 3."),
    }),
    strict: true,
    async execute({ query, k }) {
        try {
            const vector = await embedding(query);
            const results = await Redis.search(
                String(process.env.REDIS_DOCUMENT_INDEX),
                vector,
                k>3 ? 3 : k
            );
            console.info(JSON.stringify(results));

            if (!results.length) return "";

            return results.map(r => r.text).join("\n");
        } catch (e) {
            console.error(e);
            return "";
        }
    },
});
