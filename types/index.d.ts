export type RenderOptions = {
  format?: string;
  engine?: string;
  yInvert?: boolean;
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

  render(src: string, options?: RenderOptions): RenderResult;
  renderString(src: string, options?: RenderOptions): string;
  renderSVGElement(src: string, options?: RenderOptions): SVGSVGElement;
  renderJSON(src: string, options?: RenderOptions): object;
}
export {};

export function instance(): Promise<Viz>;

export const graphvizVersion: string;

export const formats: string[];

export const engines: string[];
