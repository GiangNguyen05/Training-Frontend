import { getEmbedding } from "./embedding.js";
import { vectorDB } from "./db.js";

export async function retrieveContext(query) {
  const vector = await getEmbedding(query);

  const results = await vectorDB.query({
    vector,
    topK: 5,
  });

  console.log("Matches:", results.matches);

  return results.matches.map((m) => m.metadata);
}
