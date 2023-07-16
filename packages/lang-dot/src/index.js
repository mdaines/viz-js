import { parser } from "./parser.js";
import { LRLanguage, LanguageSupport, indentNodeProp, delimitedIndent, foldNodeProp, foldInside } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { parser as xmlParser } from "@lezer/xml";
import { parseMixed } from "@lezer/common";

const language = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        "strict digraph graph subgraph node edge": t.keyword,
        "Name": t.literal,
        "String HTMLString < >": t.string,
        "Number": t.number,
        "Node/Name": t.definition(t.variableName),
        "Port/Name": t.variableName,
        "AttrName/Name": t.definition(t.propertyName),
        "[ ]": t.squareBracket,
        "{ }": t.brace,
        ", ;": t.separator,
        ":": t.punctuation,
        "-> -- = +": t.operator,
        LineComment: t.lineComment,
        BlockComment: t.blockComment
      }),
      indentNodeProp.add({
        Body: delimitedIndent({ closing: "}" }),
        Attributes: delimitedIndent({ closing: "]" })
      }),
      foldNodeProp.add({
        "Body Attributes": foldInside,
        BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 } }
      })
    ],
    wrap: parseMixed(node => {
      return node.name == "HTMLStringContent" ? { parser: xmlParser } : null
    })
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"', "<"] },
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } }
  }
});

export function dot() {
  return new LanguageSupport(language);
}
