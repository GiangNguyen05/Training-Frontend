// db.js
let store = [];

export const vectorDB = {
  async upsert(items) {
    store.push(...items);
  },

  async query({ vector, topK }) {
    const scored = store.map((item) => ({
      ...item,
      score: cosine(vector, item.values),
    }));

    scored.sort((a, b) => b.score - a.score);

    return {
      matches: scored.slice(0, topK),
    };
  },
};

function cosine(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
