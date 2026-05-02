// embedding.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const res = await model.embedContent(text);
  return res.embedding.values;
}
