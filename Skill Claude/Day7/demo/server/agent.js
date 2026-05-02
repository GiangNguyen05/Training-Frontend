import { generateReply } from "./ai-adapter.js";

export async function callAI(question, context) {
  const ctx = context.length
    ? context.map((c) => c.text).join("\n\n")
    : "KHÔNG CÓ DỮ LIỆU";

  console.log("Context:", ctx); // debug

  const prompt = `
Bạn là AI đọc tài liệu.

Dữ liệu:
${ctx}

Câu hỏi:
${question}

Chỉ trả lời dựa trên dữ liệu.
Không có thì nói "Không tìm thấy".
`;

  return generateReply(prompt);
}
