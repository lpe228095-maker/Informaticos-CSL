#!/usr/bin/env node
/**
 * @file context.js
 * @description
 * Script para procesar documentos PDF en `assets/`,
 * dividirlos en fragmentos densos y almacenarlos en Redis
 * con sus embeddings para búsqueda semántica.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import PDFParser from "pdf2json";

import { invoke, embedding } from "../lib/open-ai.js";
import { Redis } from "../lib/redis.js";

dotenv.config();

const assetsDir = path.resolve("assets");
const indexName = process.env.REDIS_DOCUMENT_INDEX;

function extractText(filePath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData =>
            reject(errData.parserError)
        );

        pdfParser.on("pdfParser_dataReady", pdfData => {
            const text = pdfData.Pages
                .map(page =>
                    page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" ")
                )
                .join("\n");
            resolve(text);
        });

        pdfParser.loadPDF(filePath);
    });
}

function splitText(text, maxLen = 2000) {
    const parts = [];
    let current = "";

    for (const sentence of text.split(/(\.|\n)/)) {
        if (current.length + sentence.length > maxLen) {
            parts.push(current.trim());
            current = "";
        }
        current += sentence;
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
}

async function processPdf(filePath) {
    console.log(`📄 Procesando: ${filePath}`);

    const rawText = await extractText(filePath);

    console.log("⚙️ Generando fragmentos densos con OpenAI...");
    const denseText = await invoke(
        `Analiza el siguiente texto y divídelo en fragmentos auto-contenidos (párrafos densos y coherentes),
    que mantengan su significado por sí mismos.
    Cada fragmento debe:
    - Ser claro y comprensible sin depender de otros.
    - Tener entre 200 y 500 palabras si es posible (ajusta según contenido).
    - Mantener frases completas, sin cortar ideas importantes.
    - Ser ideal para generar embeddings como contexto en búsquedas semánticas.
    
    Texto:
    ${rawText}`
    );

    const chunks = splitText(denseText);

    for (const chunk of chunks) {
        if (chunk.length < 50) continue;
        const vector = await embedding(chunk);
        await Redis.record(indexName, chunk, vector);
    }

    console.log(`✅ ${chunks.length} fragmentos insertados desde ${filePath}`);
}

async function main() {
    try {
        if (!fs.existsSync(assetsDir)) {
            console.error("❌ No existe la carpeta assets/");
            process.exit(1);
        }

        const files = fs.readdirSync(assetsDir).filter(f => f.endsWith(".pdf"));
        if (files.length === 0) {
            console.log("ℹ️ No se encontraron archivos PDF en assets/");
            return;
        }

        console.log("🛠️ Asegurando índice en Redis...");
        await Redis.create(indexName);

        // Procesar todos los PDFs en paralelo
        await Promise.all(
            files.map(file => processPdf(path.join(assetsDir, file)))
        );

        console.log("🚀 Todos los PDFs han sido procesados e indexados en Redis.");
    } finally {
        if (Redis.client) {
            await Redis.client.quit();
            console.log("🔌 Conexión Redis cerrada");
        }
    }
}

main().catch(err => {
    console.error("❌ Error en el script:", err);
    process.exit(1);
});
