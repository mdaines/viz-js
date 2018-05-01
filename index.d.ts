export as namespace Viz;

export default Viz;

declare class Viz {
  
  constructor(options?: { worker: string } | { Module: () => any, render: (instance: any, src: string, options: object) => string });
  
  renderString(src: string, options?: Viz.Options): Promise<string>;
  
  renderSVGElement(src: string, options?: Viz.Options): Promise<SVGSVGElement>;

  renderImageElement(src: string, options?: Viz.ImageOptions): Promise<HTMLImageElement>;

  renderJSONObject(src: string, options?: Viz.Options): Promise<object>;
  
}

declare namespace Viz {

  export interface Options {
      engine?: string;
      format?: string;
      yInvert?: boolean;
      images?: Image[];
      files?: File[];
  }

  export interface ImageOptions extends Options {
    scale?: number;
    mimeType?: string;
    quality?: number;
  }

  export interface Image {
      path: string;
      height: string | number;
      width: string | number;
  }

  export interface File {
      path: string;
      data: string;
  }
  
}
