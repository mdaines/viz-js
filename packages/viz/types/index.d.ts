export function instance(): Promise<Viz>;

export const graphvizVersion: string;

export const formats: string[];

export const engines: string[];

export {};

export type Graph = {
  name?: string;
  strict?: boolean;
  directed?: boolean;
  graphAttributes?: Attributes;
  nodeAttributes?: Attributes;
  edgeAttributes?: Attributes;
  nodes?: Node[];
  edges?: Edge[];
  subgraphs?: Subgraph[];
};

type Attributes = {
  [name: string]: AttributeValue;
};

type AttributeValue = string | number | boolean | HTMLString;

type HTMLString = {
    html: string;
};

type Node = {
    name: string;
    attributes?: Attributes;
};

type Edge = {
    tail: string;
    head: string;
    attributes?: Attributes;
};

type Subgraph = {
    name?: string;
    graphAttributes?: Attributes;
    nodeAttributes?: Attributes;
    edgeAttributes?: Attributes;
    nodes?: Node[];
    edges?: Edge[];
    subgraphs?: Subgraph[];
};

export type RenderOptions = {
    format?: string;
    engine?: string;
    yInvert?: boolean;
    reduce?: boolean;
    graphAttributes?: Attributes;
    nodeAttributes?: Attributes;
    edgeAttributes?: Attributes;
};

export type RenderResult = SuccessResult | FailureResult;

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

export type RenderError = {
    level?: "error" | "warning";
    message: string;
};

declare class Viz {
  get graphvizVersion(): string;

  get formats(): string[];

  get engines(): string[];

  render(input: string | Graph, options?: RenderOptions): RenderResult;

  renderString(src: any, options?: RenderOptions): string;

  renderSVGElement(src: any, options?: RenderOptions): SVGSVGElement;

  renderJSON(src: any, options?: RenderOptions): object;
}
