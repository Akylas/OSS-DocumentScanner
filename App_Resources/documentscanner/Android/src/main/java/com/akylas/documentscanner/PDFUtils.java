package com.akylas.documentscanner;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfObject;
import com.itextpdf.kernel.pdf.PdfStream;
import com.itextpdf.kernel.pdf.PdfDictionary;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.WriterProperties;
import com.itextpdf.kernel.pdf.PdfName;
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject;

import java.io.IOException;
import java.util.Iterator;
import java.io.ByteArrayOutputStream;

import android.util.Log;

public class PDFUtils {
    
    public static void compressPDF(String src, String dest, int jpgQuality)  throws IOException  {
        PdfWriter writer = new PdfWriter(dest, new WriterProperties().setCompressionLevel(9));
        PdfDocument pdfDoc = new PdfDocument(new PdfReader(src), writer);

         // Iterate over all pages to get all images.
        for (int i = 1; i <= pdfDoc.getNumberOfPages(); i++)
        {
            PdfPage page = pdfDoc.getPage(i);
            PdfDictionary pageDict = page.getPdfObject();
            PdfDictionary resources = pageDict.getAsDictionary(PdfName.Resources);
            // Get images
            PdfDictionary xObjects = resources.getAsDictionary(PdfName.XObject);
            for (Iterator<PdfName> iter = xObjects.keySet().iterator() ; iter.hasNext(); ) {
                // Get image
                PdfName imgRef = iter.next();
                PdfStream stream = xObjects.getAsStream(imgRef);
                if (PdfName.Image.equals(stream.getAsName(PdfName.Subtype))) {
                    PdfImageXObject image = new PdfImageXObject(stream);

                    byte[] imageBytes= image.getImageBytes();

                    Bitmap bmp;
                    bmp = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
                    if (bmp == null) continue;

                    ByteArrayOutputStream imgBytes = new ByteArrayOutputStream();

                    bmp.compress(Bitmap.CompressFormat.JPEG, jpgQuality, imgBytes);
                    stream.setCompressionLevel(9);
                    stream.setData(imgBytes.toByteArray(), false);
                    stream.put(PdfName.Filter, PdfName.DCTDecode);
                    imgBytes.close();
                }
            }
        }
        pdfDoc.close();
    }

}