// services/llm/loadDocuments.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Client } from "pg"; // PostgreSQL client
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

// ----------- Récupère le répertoire actuel -----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------- CONFIGURATION BDD -----------
const client = new Client({
  connectionString: process.env.CHATBOT_DB_URL, // depuis .env
});

// ----------- TEST DE CONNEXION -----------
async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connexion à la base réussie !");
  } catch (err) {
    console.error("❌ Impossible de se connecter à la base :", err.message);
    process.exit(1);
  }
}

await testConnection();

// ----------- FONCTIONS UTILITAIRES -----------

// Découpe le texte en chunks (par défaut 500 mots)
function chunkText(text, size = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(" "));
  }
  return chunks;
}

// Création de l'embedding via l'API Groq
async function createEmbedding(chunk) {
  const response = await fetch("https://api.groq.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API}`,
    },
    body: JSON.stringify({
      model: "groq-embed-text-001",
      input: chunk,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding; // vecteur renvoyé
}

// ----------- TRAITEMENT D'UN FICHIER TXT -----------
async function processTxt(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const chunks = chunkText(content);
  const fileName = path.basename(filePath);

  // 1️⃣ Insertion dans la table documents
  const docResult = await client.query(
    "INSERT INTO documents(title, source) VALUES($1, $2) RETURNING id",
    [fileName, filePath]
  );
  const docId = docResult.rows[0].id;

  // 2️⃣ Insertion des embeddings pour chaque chunk
  for (const chunk of chunks) {
    const vector = await createEmbedding(chunk);

    // Stocke le vecteur en JSON
    await client.query(
      "INSERT INTO embeddings(documentId, content, vector) VALUES($1, $2, $3)",
      [docId, chunk, JSON.stringify(vector)]
    );
  }

  console.log(`📄 TXT indexé : ${fileName}`);
}

// ----------- BOUCLE SUR TOUS LES FICHIERS DU DOSSIER -----------
async function main() {
  const dataDir = path.join(__dirname, "llm", "data");

  const files = fs.readdirSync(dataDir);

  for (const file of files) {
    if (file.endsWith(".txt")) {
      await processTxt(path.join(dataDir, file));
    }
  }

  console.log("✨ Tous les documents ont été chargés en base !");
  await client.end();
}

// ----------- LANCEMENT DU SCRIPT -----------
main().catch((err) => {
  console.error(err);
  client.end();
});
