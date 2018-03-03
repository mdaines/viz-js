declare var Viz: VizJs.Viz
export default Viz

declare namespace VizJs {

    interface Viz {
        (src: string, opts?: VizOptsRest): string;
        (src: string, opts?: VizImageOpts): HTMLImageElement;
        svgXmlToPngImageElement(svgXml: string, scale: number | undefined, callback: ImageCallback): void;
        svgXmlToPngImageElement(svgXml: string, scale?: number): HTMLImageElement;
        svgXmlToPngBase64(svgXml: string, scale: number | undefined, callback: ImageCallback): void;
    }

    interface ImageCallback {
        (error: Error | null, image: HTMLImageElement): void;
    }
    
    type Format = "svg" | "xdot" | "plain" | "ps" | "json" | "png-image-element";
    type Engine = "circo" | "dot" | "fdp" | "neato" | "osage" | "twopi";

    interface VizOptsBase {
        engine?: Engine;
        scale?: number;
        images?: Image[];
        totalMemory?: number;
        files?: File[];
    }
    // Split up VizOpts declarations to be able to distinguish the return type of Viz()
    interface VizImageOpts extends VizOptsBase {
        format?: "png-image-element";
    }
    interface VizOptsRest extends VizOptsBase {
        format?: "svg" | "xdot" | "plain" | "ps" | "json";
    }
    type VizOpts = VizOptsRest | VizImageOpts;

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
