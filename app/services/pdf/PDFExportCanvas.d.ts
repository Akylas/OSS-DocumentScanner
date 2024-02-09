import { OCRPage } from '~/models/OCRDocument';
import PDFCanvas from './PDFCanvas';

export default class PDFExportCanvas extends PDFCanvas {
    async export(pages: OCRPage[], folder?, filename?): Promise<string>;
}
