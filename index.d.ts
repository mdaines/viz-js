declare var Viz: VizJs.Viz
export default Viz

declare namespace VizJs {

    interface Viz {
        (src: string, opts?: VizOpts): string | HTMLImageElement;
        svgXmlToPngImageElement(svgXml: string, scale: number | undefined, callback: ImageCallback): void;
        svgXmlToPngImageElement(svgXml: string, scale?: number): HTMLImageElement;
        svgXmlToPngBase64(svgXml: string, scale: number | undefined, callback: ImageCallback): void;
    }

    interface ImageCallback {
        (error: Error | null, image: HTMLImageElement): void;
    }
    
    type Format = "svg" | "xdot" | "plain" | "ps" | "json" | "png-image-element";
    type Engine = "circo" | "dot" | "fdp" | "neato" | "osage" | "twopi";

    interface VizOpts {
        format?: Format;
        engine?: Engine;
        scale?: number;
        images?: Image[];
        totalMemory?: number;
        files?: File[];
    }

    interface File {
        path: string;
        data: string;
    }

    interface Image {
        href: string;
        height: string | number;
        width: string | number;
    }
}
