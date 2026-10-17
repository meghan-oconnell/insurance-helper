import { isVerified } from "../lib/verify.js";

const cases = [
  ["30% coinsurance", true, "real phrase from the plan"],
  ["$3,500 Individual / $7,000 Family ", true, "real deductible line"],
  ["1-855-249-5018", true, "member services number"],
  ["30%    COINSURANCE", true, "extra spaces + caps should still match"],
  ["$10 copay for MRIs", false, "made up"],
  ["$4,000 Individual", false, "wrong number"],
  ["", false, "empty quote"],
  ["the", false, "too short to count"],
  [undefined, false, "missing quote"],
];

let passed = 0;
for (const [quote, expected, why] of cases) {
  const got = isVerified(quote);
  const ok = got === expected;
  if (ok) passed++;
  console.log(ok ? "✓" : "✗", JSON.stringify(quote), "→", got, `(${why})`);
}

console.log(`\n${passed}/${cases.length} passed`);
