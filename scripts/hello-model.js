import { askModel, MODEL } from "../lib/model.js";

console.log(`Talking to ${MODEL}...`);
console.time("reply time");

const text = await askModel({
  system: "You are friendly and brief.",
  user: "Say hi in five words.",
});
console.log("Text reply:", text);

const json = await askModel({
  system: "Answer in JSON.",
  user: "Is the sky blue?",
  schema: {
    type: "object",
    properties: { answer: { type: "boolean" } },
    required: ["answer"],
  },
});
console.log("JSON reply:", json);

console.timeEnd("reply time");
