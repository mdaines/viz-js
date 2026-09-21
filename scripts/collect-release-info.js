import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { exit, argv } from "node:process";

async function readPackageInfo(directory) {
  const filePath = resolve(directory, "package.json");
  const contents = await readFile(filePath, { encoding: "utf8" });
  const object = JSON.parse(contents);

  const name = object["name"];
  const version = object["version"];

  const nameMatch = name.match(/^@viz-js\/(.+)$/);
  const versionMatch = version.match(/^\d+\.\d+\.\d+$/);

  if (!nameMatch) {
    throw new Error(`name didn't match expected pattern: ${name}`);
  }

  const shortName = nameMatch[1];

  if (!versionMatch) {
    throw new Error(`version didn't match expected pattern: ${version}`);
  }

  return {
    name,
    shortName,
    version
  };
}

function getTag({ shortName, version }) {
  return `release-${shortName}-${version}`;
}

function getTitle({ name, version }) {
  return `${name} ${version}`;
}

async function readNotes(directory, { version }) {
  const filePath = resolve(directory, "CHANGELOG.md");
  const contents = await readFile(filePath, { encoding: "utf8" });

  const headings = Array.from(contents.matchAll(/^##\s*(.*)$/gm));
  const foundIndex = headings.findIndex(h => h[1] === version);

  if (foundIndex === -1) {
    throw new Error(`Couldn't find notes for version: ${version}`);
  }

  let notes;

  const startIndex = headings[foundIndex].index + headings[foundIndex][0].length;

  if (headings.length > foundIndex + 1) {
    notes = contents.substring(startIndex, headings[foundIndex + 1].index);
  } else {
    notes = contents.substring(startIndex);
  }

  return notes.trim();
}

try {
  const directory = argv[2];

  const info = await readPackageInfo(directory);
  const tag = getTag(info);
  const title = getTitle(info);
  const notes = await readNotes(directory, info);

  process.stdout.write(`RELEASE_TAG=${tag}\n`);
  process.stdout.write(`RELEASE_TITLE=${title}\n`);
  process.stdout.write(`RELEASE_NOTES<<EOF\n${notes}\nEOF\n`);
} catch (e) {
  console.error(e.message);
  exit(1);
}
