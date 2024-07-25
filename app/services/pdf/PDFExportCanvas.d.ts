import type { OCRPage } from '~/models/OCRDocument';
import PDFCanvas, { PDFExportOptions } from './PDFCanvas';

export default class PDFExportCanvas extends PDFCanvas {
    async export(options: PDFExportOptions): Promise<string>;
}
