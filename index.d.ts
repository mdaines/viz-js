declare var Viz: VizJs.Viz
export default Viz

declare namespace VizJs {

    interface Viz {
        (src: string, opts?: VizOpts): string | HTMLImageElement
        svgXmlToPngImageElement(svgXml: string, scale: number | undefined, callback: ImageCallback): void
        svgXmlToPngImageElement(svgXml: string, scale?: number): HTMLImageElement
        svgXmlToPngBase64(svgXml: string, scale: number | undefined, callback: ImageCallback): void
    }

    interface ImageCallback {
        (error: Error | null, image: HTMLImageElement): void
    }

    interface VizOpts {
        format?: string
        engine?: string
        scale?: number
        images?: Image[]
        totalMemory?: number,
        files?: File[]
    }

    interface File {
        path: string
        data: string
    }

    interface Image {
        href: string
        height: string
        width: string
    }
}
