import PDFCanvas from './PDFCanvas';

export default class PDFExportCanvas extends PDFCanvas {
    async export(documents: OCRDocument[], folder?, filename?): Promise<string>;
}
