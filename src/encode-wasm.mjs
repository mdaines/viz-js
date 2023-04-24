import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);

const binary = readFileSync(args[0]);

const template = `const encoded = "WASM";

export function decode() {
  const data = atob(encoded);
  const bytes = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes.buffer;
}
`;

writeFileSync(args[1], template.replace("WASM", binary.toString("base64")));
