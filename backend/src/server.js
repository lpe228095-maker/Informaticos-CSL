/**
 * @file server.js
 * @description Servidor Express con un endpoint /chat/
 * que conecta con el método `chat` de open-ai.js
 */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { chat } from "../lib/open-ai.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

/**
 * Endpoint: POST /chat/
 *
 * Espera un body con:
 * {
 *   "sessionId": "abc123",
 *   "message": "Hola, ¿qué es un agujero negro?"
 * }
 */
app.post("/chat", async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: "Faltan parámetros" });
        }

        const respuesta = await chat(sessionId, message);
        res.json({ response: respuesta });

    } catch (error) {
        console.error("❌ Error en /chat:", error);
        res.status(500).json({
            error: error.message || "Error interno del servidor",
            stack: error.stack,
        });
    }
});

/**
 * Endpoint: GET /health
 * Retorna un estado simple para validar si el servicio está activo.
 */
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Servicio activo" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
