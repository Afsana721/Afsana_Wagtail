// app/api/pluginLLm/LLMplugin.js
// Free vector-based text plugin (no paid API)

import fs from "fs";
import path from "path";

// resolve file path from /public
function getFilePath(fileName) {
  return path.join(process.cwd(), "public", fileName);
}

// read text file as UTF-8 string
function readTextFile(fileName) {
  return fs.readFileSync(getFilePath(fileName), "utf8");
}

// split text into logical chunks (sections / paragraphs)
function chunkText(text) {
  return text.split("\n\n").filter(Boolean);
}

// convert text chunk → free vector (token-frequency map)
function embedChunk(chunk) {
  const tokens = chunk
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const vector = {};
  for (const t of tokens) vector[t] = (vector[t] || 0) + 1;

  return { vector, text: chunk };
}

// cosine similarity between two vectors
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const k in a) { dot += (a[k] || 0) * (b[k] || 0); na += a[k] * a[k]; }
  for (const k in b) nb += b[k] * b[k];
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

// build searchable vector index from text file
export function runLLMPlugin({ fileName, query }) {
  const rawText = readTextFile(fileName);
  const chunks = chunkText(rawText);
  const index = chunks.map(embedChunk);

  // no query → return chunks (for debugging / inspection)
  if (!query) {
    return { source: fileName, result: chunks };
  }

  // query → return ONLY the best-matched chunk (per image)
  const qVec = embedChunk(query).vector;

  let best = { score: -1, text: "" };
  for (const item of index) {
    const s = cosineSim(qVec, item.vector);
    if (s > best.score) best = { score: s, text: item.text };
  }

  return { source: fileName, result: best.text ? [best.text] : [] };
}
