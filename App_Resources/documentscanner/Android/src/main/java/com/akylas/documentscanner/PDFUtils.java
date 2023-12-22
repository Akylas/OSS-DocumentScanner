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
import 	java.io.ByteArrayOutputStream;

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
                // BufferedImage bi = image.getBufferedImage();
                // if (bi == null)
                //     continue;
                
                // Create new image
                // int width = (int) (bi.getWidth() * resizeFactor);
                // int height = (int) (bi.getHeight() * resizeFactor);
                // BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
                // AffineTransform at = AffineTransform.getScaleInstance(resizeFactor, resizeFactor);
                // Graphics2D g = img.createGraphics();
                // g.drawRenderedImage(bi, at);
                // ByteArrayOutputStream imgBytes = new ByteArrayOutputStream();
                
                // // Write new image
                // ImageIO.write(img, "JPG", imgBytes);
                // Image imgNew =new Image(ImageDataFactory.create(imgBytes.toByteArray()));
                
                // PdfStream newStream = new PdfStream(image.getImageBytes(false), 9);
                // PdfImageXObject image = new PdfImageXObject(stream);
                    // stream.setCompressionLevel(9);
                    // stream.setData(image.getImageBytes(false), false);
                    // newStream.put(PdfName.Filter, PdfName.DCTDecode);
                // Replace the original image with the resized image
                // xObjects.put(imgRef, new PdfImageXObject(newStream).getPdfObject());
            }          
        }
        // PdfObject object;
        // PdfStream stream;
        // int numberOfPdfObjects = pdfDoc.getNumberOfPdfObjects();
        // for (int i = 1; i <= numberOfPdfObjects; i++) {
        //     PdfObject obj = pdfDoc.getPdfObject(i);
        // //     if (obj != null && obj.isStream()) {
        // //         stream = (PdfStream)obj;
        // //         PdfObject pdfsubtype = stream.get(PdfName.Subtype);
        // //         if (pdfsubtype != null && pdfsubtype.toString().equals(PdfName.Image.toString())) {
        // //             PdfImageXObject image = new PdfImageXObject(stream);
        // //             stream.setCompressionLevel(9);
        // //             stream.setData(image.getImageBytes(), false);
        // //             stream.put(PdfName.Filter, PdfName.DCTDecode);
        // //         }
        // //     }
            
        // }
        pdfDoc.close();
    }

}