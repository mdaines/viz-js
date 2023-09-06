type HTMLString = { html: string };

type AttributeValue = string | number | boolean | HTMLString;

type Attributes = { [key: string]: AttributeValue };

type Node = {
  name: string,
  attributes?: Attributes
};

type Edge = {
  tail: string,
  head: string,
  attributes?: Attributes
};

type Graph = {
  name?: string,
  graphAttributes?: Attributes,
  nodeAttributes?: Attributes,
  edgeAttributes?: Attributes,
  nodes?: Node[],
  edges?: Edge[],
  subgraphs?: Graph[]
};

type Header = {
  strict?: boolean,
  directed?: boolean
};

export type RenderInputObject = Header & Graph;

type RenderInput = string | RenderInputObject;

export type RenderOptions = {
  format?: string;
  engine?: string;
  yInvert?: boolean;
  reduce?: boolean;
  graphAttributes?: Attributes;
  nodeAttributes?: Attributes;
  edgeAttributes?: Attributes;
};

export type RenderError = {
  level?: "error" | "warning";
  message: string;
};

type SuccessResult = {
  status: "success";
  output: string;
  errors: RenderError[];
};

type FailureResult = {
  status: "failure";
  output: undefined;
  errors: RenderError[];
};

export type RenderResult = SuccessResult | FailureResult;

declare class Viz {
  get graphvizVersion(): string;
  get formats(): string[];
  get engines(): string[];

  render(input: RenderInput, options?: RenderOptions): RenderResult;
  renderString(input: RenderInput, options?: RenderOptions): string;
  renderSVGElement(input: RenderInput, options?: RenderOptions): SVGSVGElement;
  renderJSON(input: RenderInput, options?: RenderOptions): object;
}
export {};

export function instance(): Promise<Viz>;

export const graphvizVersion: string;

export const formats: string[];

export const engines: string[];
