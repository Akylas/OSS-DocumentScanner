package com.akylas.documentscanner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.util.Log
import com.itextpdf.io.image.ImageDataFactory
import com.itextpdf.kernel.colors.ColorConstants
import com.itextpdf.kernel.geom.PageSize
import com.itextpdf.kernel.geom.Rectangle
import com.itextpdf.kernel.pdf.PdfDocument
import com.itextpdf.kernel.pdf.PdfName
import com.itextpdf.kernel.pdf.PdfReader
import com.itextpdf.kernel.pdf.PdfVersion
import com.itextpdf.kernel.pdf.PdfWriter
import com.itextpdf.kernel.pdf.WriterProperties
import com.itextpdf.kernel.pdf.canvas.PdfCanvas
import com.itextpdf.kernel.pdf.canvas.PdfCanvasConstants
import com.itextpdf.kernel.pdf.extgstate.PdfExtGState
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject
import com.itextpdf.layout.Canvas
import com.itextpdf.layout.Document
import com.itextpdf.layout.element.AreaBreak
import com.itextpdf.layout.element.Image
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.properties.TextAlignment
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.FileInputStream
import java.io.IOException
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.min


class PDFUtils {

    class PDFLoadImageOptions {

        var imageSizeThreshold: Int = 0
        var imageScale: Double = 1.0
        var quality: Int = 100
    }
    companion object {
        const val BLACK_WHITE_COLOR_MATRIX = "[0.2126,0.7152,0.0722,0,0,0.2126,0.7152,0.0722,0,0,0.2126,0.7152,0.0722,0,0,0,0,0,1,0]"
        @Throws(IOException::class)
        fun compressPDF(src: String?, dest: String?, compressionLevel: Int, jpgQuality: Int) {
            val writer = PdfWriter(dest, WriterProperties().setCompressionLevel(compressionLevel).setFullCompressionMode(true))
            val pdfDoc = PdfDocument(PdfReader(src), writer)

            // Iterate over all pages to get all images.
            for (i in 1..pdfDoc.getNumberOfPages()) {
                val page = pdfDoc.getPage(i)
                val pageDict = page.pdfObject
                val resources = pageDict.getAsDictionary(PdfName.Resources)
                // Get images
                val xObjects = resources.getAsDictionary(PdfName.XObject)
                val iter: Iterator<PdfName> = xObjects.keySet().iterator()
                while (iter.hasNext()) {

                    // Get image
                    val imgRef = iter.next()
                    val stream = xObjects.getAsStream(imgRef)
                    if (PdfName.Image == stream.getAsName(PdfName.Subtype)) {
                        val image = PdfImageXObject(stream)
                        val imageBytes = image.imageBytes
                        val imgBytes = ByteArrayOutputStream()
                        (BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                            ?: continue).compress(Bitmap.CompressFormat.JPEG, jpgQuality, imgBytes)
                        stream.compressionLevel = compressionLevel
                        stream.setData(imgBytes.toByteArray(), false)
                        stream.put(PdfName.Filter, PdfName.DCTDecode)
                        imgBytes.close()
                    }
                }
            }
            pdfDoc.close()
        }
        /**
         * Calculate an inSampleSize for use in a [BitmapFactory.Options] object when decoding
         * bitmaps using the decode* methods from [BitmapFactory]. This implementation calculates
         * the closest inSampleSize that is a power of 2 and will result in the final decoded bitmap
         * having a width and height equal to or larger than the requested width and height.
         *
         * @param imageWidth  The original width of the resulting bitmap
         * @param imageHeight The original height of the resulting bitmap
         * @param width    The requested width of the resulting bitmap
         * @param height   The requested height of the resulting bitmap
         * @return The value to be used for inSampleSize
         */
        private fun calculateInSampleSize(
            imageWidth: Int,
            imageHeight: Int,
            width: Int,
            height: Int
        ): Int {
            // BEGIN_INCLUDE (calculate_sample_size)
            // Raw height and width of image
            var reqWidth = width
            var reqHeight = height
            reqWidth = if (reqWidth > 0) reqWidth else imageWidth
            reqHeight = if (reqHeight > 0) reqHeight else imageHeight
            var inSampleSize = 1
            if (imageHeight > reqHeight || imageWidth > reqWidth) {
                val halfHeight = imageHeight / 2
                val halfWidth = imageWidth / 2

                // Calculate the largest inSampleSize value that is a power of 2 and keeps both
                // height and width larger than the requested height and width.
                while (halfHeight / inSampleSize > reqHeight && halfWidth / inSampleSize > reqWidth) {
                    inSampleSize *= 2
                }

                // This offers some additional logic in case the image has a strange
                // aspect ratio. For example, a panorama may have a much larger
                // width than height. In these cases the total pixels might still
                // end up being too large to fit comfortably in memory, so we should
                // be more aggressive with sample down the image (=larger inSampleSize).
                var totalPixels =
                    (imageWidth / inSampleSize * (imageHeight / inSampleSize)).toLong()

                // Anything more than 2x the requested pixels we'll sample down further
                val totalReqPixelsCap = (reqWidth * reqHeight * 2).toLong()
                while (totalPixels > totalReqPixelsCap) {
                    inSampleSize *= 2
                    totalPixels =
                        (imageWidth / inSampleSize * (imageHeight / inSampleSize)).toLong()
                }
            }
            return inSampleSize
            // END_INCLUDE (calculate_sample_size)
        }
        private fun loadImage(
            src: String,
            imageWidth: Double,
            imageHeight: Double,
            width: Double,
            height: Double,
            rotation: Int,
            colorMatrix: String?,
            options: PDFLoadImageOptions
        ): Image? {
            var reqWidth  = width
            var reqHeight  = height
            if (options.imageSizeThreshold != 0) {
                val minSize = max(reqWidth, reqHeight)
                if (minSize > options.imageSizeThreshold) {
                    val resizeScale = 1.0 * minSize / options.imageSizeThreshold
                    reqWidth = ((reqWidth / resizeScale))
                    reqHeight = ((reqHeight / resizeScale))
                }
            }
            if (options.imageScale != 1.0) {
                reqWidth = ((reqWidth * options.imageScale))
                reqHeight = ((reqHeight * options.imageScale))
            }
            val finalBitmapOptions = BitmapFactory.Options()
            if (imageWidth != reqWidth || imageHeight != reqHeight) {
                finalBitmapOptions.inSampleSize =
                    calculateInSampleSize(imageWidth.toInt(), imageHeight.toInt(), reqWidth.toInt(), reqHeight.toInt())
            }
            finalBitmapOptions.inMutable = colorMatrix != null
            val bmp = BitmapFactory.decodeFile(src, finalBitmapOptions)
            if (colorMatrix != null) {
                val jsonArray = JSONArray(colorMatrix)
                val floatArray = Array(jsonArray.length()) {jsonArray.getDouble(it).toFloat()}
                val canvas = android.graphics.Canvas(bmp)
                val paint = Paint()
                paint.setColorFilter(ColorMatrixColorFilter(floatArray.toFloatArray()))
                canvas.drawBitmap(bmp, 0F, 0F, paint)
            }

            val imgBytes = ByteArrayOutputStream()
            bmp.compress(Bitmap.CompressFormat.JPEG, options.quality, imgBytes)
            bmp.recycle()
            val imageData = ImageDataFactory.create(imgBytes.toByteArray())
            return Image(imageData).setRotationAngle(-rotation * PI / 180.0)
        }

        private fun drawOCRData(pdfDoc:PdfDocument, page: JSONObject, posX:Float, posY:Float, imageScale: Float, toDrawHeight: Float, textScale: Float, debug: Boolean) {
            if (page.has("ocrData")) {
                val ocrData = page.getJSONObject("ocrData")
//                val canvas =  PdfCanvas(pdfDoc.lastPage).setExtGState(PdfExtGState().setFillOpacity(if (debug) 1.0F else 0.01F)).setTextRenderingMode(PdfCanvasConstants.TextRenderingMode.INVISIBLE)
                val imageWidth = ocrData.getDouble("imageWidth").toFloat()
                val imageHeight = ocrData.getDouble("imageHeight").toFloat()
                val blocks = ocrData.getJSONArray("blocks")
//                canvas.rectangle(Rectangle(posX ,
//                    posY,
//                    imageWidth * imageScale,
//                    imageHeight * imageScale
//                )).setFillColor(ColorConstants.BLUE)
//                    .fill();
                for (i in 0..<blocks.length()) {
                    val block = blocks.getJSONObject(i)
                    var box = block.getJSONObject("box")
                    val width = box.getDouble("width").toFloat()
                    val height = box.getDouble("height").toFloat()
                    val rect = Rectangle(posX + box.getDouble("x").toFloat() * imageScale,
                        posY + (imageHeight - height - box.getDouble("y").toFloat()) * imageScale,
                        width * imageScale,
                        height * imageScale
                    )
//                    canvas.rectangle(rect)
//                        .stroke();

                    Canvas(pdfDoc.lastPage, rect).setTextRenderingMode(if (debug) PdfCanvasConstants.TextRenderingMode.FILL else PdfCanvasConstants.TextRenderingMode.INVISIBLE).setFontColor(if (debug) ColorConstants.RED else ColorConstants.WHITE)
                        .setTextAlignment(TextAlignment.LEFT)
                        .setFixedPosition(posX, posY, width * imageScale)
                        .setFontSize(block.optDouble("fontSize", 16.0).toFloat() * textScale * imageScale)
                        .add(Paragraph(block.getString("text")))
                        .close()
                }
            }
        }

        fun generatePDF(context: Context, destFolder: String, fileName: String,  options: String): String {
            val destinationFilePath = "$destFolder/$fileName"
            var generateFilePath = destinationFilePath
            var needsCopy = false
            if (destFolder.startsWith("content://")) {
                needsCopy = true
                generateFilePath = context.cacheDir.toString() + "/compressed.pdf"
            }
            val jsonOps = JSONObject(options)
            val compressionLevel = jsonOps.optInt("compressionLevel", 9)
            val paperSize = jsonOps.optString("paper_size", "full")
//            var paperSize = "full"
            val orientation = jsonOps.optString("orientation", "portrait")
            val color = jsonOps.optString("color", "color")
            val blackAndWhite = color == "black_white"
            Log.d("JS", "generatePDF " + color+ " blackAndWhite:" + blackAndWhite)
            val drawOcrText = jsonOps.optBoolean("draw_ocr_text", true)
            val debug = jsonOps.optBoolean("debug", false)
            val pagePadding = jsonOps.optInt("page_padding", 0).toFloat()
            val textScale = jsonOps.optDouble("text_scale", 3.0).toFloat()
            val imageScale = jsonOps.optDouble("image_page_scale", 2.0).toFloat()
//            var pagePadding = 100F
            var itemsPerPage = jsonOps.optInt("items_per_page", 1)
            val loadImageOptions = PDFLoadImageOptions()
            loadImageOptions.imageScale = jsonOps.optDouble("imageLoadScale", 1.0)
            loadImageOptions.imageSizeThreshold = jsonOps.optInt("imageSizeThreshold", 0)
            loadImageOptions.quality = jsonOps.optInt("jpegQuality", 80)
            val pages = jsonOps.getJSONArray("pages")
            val pagesCount = pages.length()
            val isLandscape = orientation == "landscape"
            if(paperSize == "full") {
                itemsPerPage = 1
            }
//            when (paperSize) {
//                "full" -> {
//                    pageSize = PageSize(page.optInt("width", 0).toFloat(), page.optInt("height", 0).toFloat())
//                    itemsPerPage = 1
//                }
//                "a5" -> if (isLandscape) PageSize.A5.rotate() else PageSize.A5
//                "a3" -> if (isLandscape) PageSize.A3.rotate() else PageSize.A3
//                "a4" -> if (isLandscape) PageSize.A4.rotate() else PageSize.A4
//            }

            val writer = PdfWriter(generateFilePath, WriterProperties().setCompressionLevel(compressionLevel).setFullCompressionMode(true).setPdfVersion(
                PdfVersion.PDF_1_4
            ))
            val pdfDoc = PdfDocument(writer)
            var document: Document? = null
            if (paperSize == "full") {
                for (i in 0..<pagesCount) {
                    val page = pages.getJSONObject(i)
                    val imageRotation = page.optInt("rotation", 0)
                    val imageSrc= page.getString("imagePath")
                    val imageWidth = page.getDouble("width")
                    val imageHeight = page.getDouble("height")
                    val colorMatrix = if (blackAndWhite) BLACK_WHITE_COLOR_MATRIX else page.optString("colorMatrix", null)
                    val image = loadImage(imageSrc, imageWidth, imageHeight, imageWidth, imageHeight, imageRotation, colorMatrix, loadImageOptions)?: continue
                    var imageRatio = image.imageHeight / imageHeight

                    val pageSize = if (imageRotation % 180 !== 0) PageSize(image.imageHeight, image.imageWidth) else PageSize(image.imageWidth, image.imageHeight)
                    if (i == 0) {
                        document = Document(pdfDoc, pageSize)
                        document.setMargins(0F, 0F, 0F, 0F)
                    } else {
                        pdfDoc.addNewPage(pageSize)
                        document!!.add(AreaBreak())
                    }
                    document.add(image)
                    if (drawOcrText) {
                        drawOCRData(pdfDoc, page,  0F, 0F, imageRatio.toFloat(), imageHeight.toFloat(), textScale, debug)
                    }
                }
            } else {
                val list = mutableListOf<JSONObject>()
                for (i in 0 until pagesCount) {
                    list.add(pages.getJSONObject(i))
                }
                val pageSize = when (paperSize) {
                    "a5" -> if (isLandscape) PageSize.A5.rotate() else PageSize.A5
                    "a3" -> if (isLandscape) PageSize.A3.rotate() else PageSize.A3
                    else -> if (isLandscape) PageSize.A4.rotate() else PageSize.A4
                }
                var totalIndex = 0
                val items = list.chunked(itemsPerPage)
                items.forEachIndexed { idx, pageItems ->
                    val nbItems = pageItems.size
                    var columns = if (nbItems > 2) 2 else 1
                    var rows = if (nbItems > 2) ceil(nbItems / 2F).toInt() else nbItems
                    if (orientation == "landscape") {
                        val temp = columns
                        columns = rows
                        rows = temp
                    }
                    val availableWidth = pageSize.width
                    val availableHeight = pageSize.height
                    val shared = min(rows, columns)
                    val widthPerColumn = availableWidth / columns
                    val heightPerRow = availableHeight / rows
                    var ddx = pagePadding
                    var ddy = pagePadding
                    var toDrawWidth: Double
                    var toDrawHeight: Double
                    if (idx == 0) {
                        document = Document(pdfDoc, pageSize)
                        document!!.setMargins(pagePadding, pagePadding, pagePadding, pagePadding)
                        pdfDoc.addNewPage(pageSize)
                    } else if (idx < items.size - 1) {
                        pdfDoc.addNewPage(pageSize)
                    }
                    for (i in rows - 1 downTo 0) {
//                        for (i in 0..<rows) {
                            for (j in 0..<columns) {
                            val pageIndex = i * shared + j
                            if (pageIndex >= nbItems) {

                                continue
                            }
                            val last = pageIndex == nbItems - 1
                            val page = pageItems[pageIndex]
                            val imageRotation = page.optInt("rotation", 0)

                            val imageSrc = page.getString("imagePath")
                            val imageWidth = page.getDouble("width")
                            val imageHeight = page.getDouble("height")
                            val colorMatrix = if (blackAndWhite) BLACK_WHITE_COLOR_MATRIX else page.optString("colorMatrix", null)

//
//                            if (imageRotation % 180 !== 0) {
//                                val temp = imageWidth
//                                imageWidth = imageHeight
//                                imageHeight = temp
//                            }
                            val pageRatio = if (imageRotation % 180 !== 0) imageHeight/ imageWidth else imageWidth / imageHeight
                            var itemAvailableWidth = widthPerColumn - 2 * pagePadding
                            val itemAvailableHeight = heightPerRow - 2 * pagePadding
                            if (last && columns * rows > nbItems) {
                                itemAvailableWidth = 2 * widthPerColumn - 2 * pagePadding
                            }
                            val itemRatio = itemAvailableWidth / itemAvailableHeight
                            if (pageRatio > itemRatio) {
                                toDrawWidth = itemAvailableWidth.toDouble()
                                toDrawHeight = itemAvailableWidth / pageRatio
                            } else {
                                toDrawHeight = itemAvailableHeight.toDouble()
                                toDrawWidth = itemAvailableHeight * pageRatio
                            }
                            var reqWidth = toDrawWidth*imageScale
                            var reqHeight = toDrawHeight*imageScale
                            var imageRatio = toDrawHeight / imageHeight
                            if (imageRotation % 180 !== 0) {
                                val temp = reqWidth
                                reqWidth = reqHeight
                                reqHeight = temp
                                imageRatio = toDrawHeight / imageWidth
                            }
                            val image =
                                loadImage(imageSrc, imageWidth, imageHeight, reqWidth, reqHeight, imageRotation, colorMatrix, loadImageOptions)?.scaleAbsolute(
                                    (reqWidth / imageScale).toFloat(),
                                    (reqHeight / imageScale).toFloat()
                                )
                                    ?: continue


                            val posX = ddx + itemAvailableWidth / 2 - toDrawWidth.toFloat() / 2
                            var posY = ddy + itemAvailableHeight / 2 - toDrawHeight.toFloat() / 2

                            if (abs(imageRotation % 360) == 180) {
                                posY += toDrawHeight.toFloat()
                            }
                            image.setFixedPosition(posX, posY)
                                document!!.add(image)
                            if (drawOcrText) {
                                drawOCRData(pdfDoc, page, posX, posY,
                                    imageRatio.toFloat(), toDrawHeight.toFloat(), textScale, debug)
                            }

                            // for those same size!
                            ddx += widthPerColumn
                            totalIndex++
                        }
                        ddy += heightPerRow
                        ddx = pagePadding
                    }
                    if (totalIndex < pagesCount - 1) {
                        document!!.add(AreaBreak())
                    }
                }
            }
            document!!.close()
            if (needsCopy) {
                val outDocument =
                    androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(destFolder))
                        ?: throw Exception("could not create access folder $destFolder")
                val outfile = outDocument.createFile("application/pdf", fileName) ?: outDocument.findFile(fileName) ?: throw Exception("could not create file $fileName in $destFolder")
                val os = context.contentResolver.openOutputStream(outfile.uri)
                    ?: throw Exception("could not open file ${outfile.uri} for writing")
                FileInputStream(java.io.File(generateFilePath)).use { input ->
                    os.use { output ->
                        input.copyTo(output)
                    }
                }
                return outfile.uri.toString()
            }
            return destinationFilePath
        }
    }
}