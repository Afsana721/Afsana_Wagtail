// app/api/pluginLLm/route.js
// FIX: vector-based per-image matching (NO key / NO order / NO bleed)
// Each image queries LLMplugin separately

import fs from "fs";
import path from "path";
import { runLLMPlugin } from "./LLMplugin.js";

// load images from data.json (order preserved)
const dataPath = path.join(process.cwd(), "public", "data.json");
const { history: imageList = [] } = JSON.parse(fs.readFileSync(dataPath, "utf8"));

export async function GET(req) {
  const type = req.nextUrl.searchParams.get("type");

  // Dynasty Creation text (no images)
  if (type === "creation") {
    const r = runLLMPlugin({
      fileName: "LLM.text",
      query: "South Asian dynasties metal statues lost wax Chola Gupta Gandhara",
    });
    return Response.json({ paragraphs: r.result || [] });
  }

  // History: vector-based per-image matching
  const history = imageList.map(({ image }) => {
    const query = image.replace(/[-_/\.]/g, " ");
    const r = runLLMPlugin({ fileName: "LLM.text", query });
    return { image, paragraphs: r.result || [] };
  });

  return Response.json({ history });
}
