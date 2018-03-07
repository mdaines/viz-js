declare function Viz(src: string, opts?: Viz.Options): string;
declare function Viz(src: string, opts: Viz.ImageFormatOptions): HTMLImageElement;

declare namespace Viz {

    function svgXmlToPngImageElement(svgXml: string, scale?: number): HTMLImageElement
    function svgXmlToPngImageElement(svgXml: string, scale: number | undefined, callback: ImageCallback<HTMLImageElement>): void
    function svgXmlToPngBase64(svgXml: string, scale: number | undefined, callback: ImageCallback<string>): void

    interface BaseOptions {
        engine?: string;
        scale?: number;
        images?: Image[];
        files?: File[];
        totalMemory?: number;
    }
    
    interface Options extends BaseOptions {
        format?: "svg" | "xdot" | "plain" | "ps" | "json";
    }

    interface ImageFormatOptions extends BaseOptions {
        format: "png-image-element";
    }

    interface Image {
        href: string;
        height: string | number;
        width: string | number;
    }

    interface File {
        path: string;
        data: string;
    }
    
    type ImageCallback<D> = (error: Error | null, data: D | null) => void;

}
