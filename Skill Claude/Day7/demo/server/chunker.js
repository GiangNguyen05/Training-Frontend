// chunker.js
export function chunkMarkdown(text) {
  const lines = text.split("\n");
  const chunks = [];
  let current = [];

  for (const line of lines) {
    if (/^#{1,3} /.test(line) && current.length > 0) {
      const chunk = current.join("\n").trim();
      if (chunk.length >= 30) chunks.push(chunk);
      current = [];
    }
    current.push(line);
  }

  const last = current.join("\n").trim();
  if (last.length >= 30) chunks.push(last);

  return chunks;
}
