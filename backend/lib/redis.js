import { createClient } from "redis";
import { randomUUID } from "crypto";

export class Redis {
    static client = null;
    static initialized = false;

    static async init() {
        if (!this.initialized) {
            this.client = createClient({ url: process.env.REDIS_URL });
            await this.client.connect();
            this.initialized = true;
        }
    }

    /**
     * Crea un índice vectorial en RediSearch.
     */
    static async create(index) {
        await this.init();
        const prefix = `${index}:`;
        const dim = 1536;

        const args = [
            "FT.CREATE", index,
            "ON", "HASH",
            "PREFIX", "1", prefix,
            "SCHEMA",
            "text", "TEXT",
            "vector", "VECTOR", "HNSW", "12",
            "TYPE", "FLOAT32",
            "DIM", dim.toString(),
            "DISTANCE_METRIC", "COSINE",
            "M", "16",
            "EF_CONSTRUCTION", "200",
            "EF_RUNTIME", "10"
        ];

        try {
            await this.client.sendCommand(args);
        } catch (err) {
            if (!err.message.includes("Index already exists")) throw err;
        }
    }

    /**
     * Guarda un texto con embedding en el índice.
     */
    static async record(index, text, embedding) {
        await this.init();
        const key = `${index}:${randomUUID()}`;

        const buf = Buffer.from(new Float32Array(embedding).buffer);
        await this.client.hSet(key, { text, vector: buf });
        return key;
    }

    /**
     * Busca los k elementos más similares en el índice.
     */
    static async search(index, embedding, k = 1) {
        await this.init();
        const qbuf = Buffer.from(new Float32Array(embedding).buffer);

        const args = [
            "FT.SEARCH", index,
            `*=>[KNN ${k} @vector $V]`,
            "PARAMS", "2", "V", qbuf,
            "DIALECT", "2",
            "RETURN", "2", "text", "__vector_score",
            "SORTBY", "__vector_score",
            "LIMIT", "0", String(k)
        ];

        const raw = await this.client.sendCommand(args);
        if (!Array.isArray(raw) || raw.length < 2) return [];

        const out = [];
        for (let i = 1; i < raw.length; i += 2) {
            const fields = raw[i + 1];
            if (!fields) continue;
            const obj = {};
            for (let j = 0; j < fields.length; j += 2) {
                obj[fields[j]] = fields[j + 1];
            }
            out.push({
                key: raw[i],
                text: obj.text,
                score: parseFloat(obj.__vector_score),
            });
        }
        return out;
    }

    /**
     * Elimina un documento por key.
     */
    static async delete(index, key) {
        await this.init();
        return await this.client.del(key);
    }

    /**
     * Borra el índice y todos sus documentos.
     */
    static async drop(index) {
        await this.init();
        try {
            await this.client.sendCommand(["FT.DROPINDEX", index, "DD"]);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Guarda un valor simple (string o JSON).
     */
    static async set(key, value) {
        await this.init();
        const data = typeof value === "string" ? value : JSON.stringify(value);
        await this.client.set(key, data);
    }

    /**
     * Recupera un valor simple.
     */
    static async get(key) {
        await this.init();
        const raw = await this.client.get(key);
        if (!raw) return null;

        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
}
