interface RenderOptions {
  format?: string | undefined;
  engine?: string | undefined;
  yInvert?: boolean | undefined;
}

interface RenderError {
  level?: "error" | "warning";
  message: string;
}

interface SuccessResult {
  status: "success";
  output: string;
  errors: Array<RenderError>;
}

interface FailureResult {
  status: "failure";
  output: undefined;
  errors: Array<RenderError>;
}

type RenderResult = SuccessResult | FailureResult;

declare class Viz {
  get graphvizVersion(): string;
  get engines(): Array<string>;
  get formats(): Array<string>;

  render(src: string, options?: RenderOptions): RenderResult;

  renderString(src: string, options?: RenderOptions): string;
  renderSVGElement(src: string, options?: RenderOptions): SVGSVGElement;
  renderJSON(src: string, options?: RenderOptions): object;
}

export function instance(): Promise<Viz>;
