import utf8 from "utf8";

const PARAM = "dot";

export function encode(stringToEncode) {
  return btoa(
    utf8.encode(
      stringToEncode
    )
  )
  .replaceAll("+", "-")
  .replaceAll("/", "_")
  .replaceAll("=", "~");
}

export function decode(stringToDecode) {
  return utf8.decode(
    atob(
      stringToDecode
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .replaceAll("~", "=")
    )
  );
}

export function getInputFromSearch(search, defaultValue = "") {
  const param = new URLSearchParams(search).get(PARAM);

  if (param) {
    try {
      return decode(param);
    } catch (error) {
      console.error(error);
    }
  }

  return defaultValue;
}

export function copyLink(str) {
  const url = `${window.location.origin}${window.location.pathname}?${PARAM}=${encode(str)}`;

  return navigator.clipboard.writeText(url);
}
