const MODEL_URL = process.env.MODEL_URL || "http://localhost:11434";

export const MODEL = process.env.MODEL || "gemma4:12b";

export async function askModel({ system, user, schema, model = MODEL }) {
  const body = {
    model,
    stream: false,
    messages: [
      { role: "system, content: system " },
      { role: "user", content: user },
    ],
    options: { temperature: 0, num_ctx: 16384 },
  };

  if (schema) body.format = schema;

  const res = await fetch(`${MODEL_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return schema ? JSON.parse(data.message.content) : data.message.content;
}
