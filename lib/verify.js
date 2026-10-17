import { readFileSync } from "node:fs";

const PLAN_PATH = new URL("../data/plan.txt", import.meta.url);

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();

const PLAN = norm(readFileSync(PLAN_PATH, "utf8"));

export function isVerified(quote) {
  return (
    typeof quote === "string" &&
    quote.trim().length > 3 &&
    PLAN.includes(norm(quote))
  );
}
