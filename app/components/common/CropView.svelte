<script context="module" lang="ts">
    import { debounce } from '@nativescript/core/utils';
    import { BitmapShader, Canvas, CanvasView, Matrix, Paint, Style, TileMode } from '@nativescript-community/ui-canvas';
    import { ApplicationSettings, ImageSource, Screen, TouchGestureEventData, Utils } from '@nativescript/core';
    import { QRCodeData } from 'plugin-nativeprocessor';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { colors } from '~/variables';
    import { loadImage, recycleImages } from '~/utils/images';
    import { IMAGE_DECODE_HEIGHT, MAGNIFIER_SENSITIVITY } from '~/models/constants';
    import { onDestroy } from 'svelte';
    import RotableImageView from './RotableImageView.svelte';
    const padding = 20;
    const ZOOOM_GLASS_SIZE = 50;
    const ZOOM_IMAGE_MAX_SIZE = Math.max(Screen.mainScreen.widthDIPs, Screen.mainScreen.heightDIPs);
</script>

<script lang="ts">
    let { colorPrimary, colorSecondary } = $colors;
    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSecondary } = $colors);

    let canvasView: NativeViewElementNode<CanvasView>;
    let prevTouchPoint;
    let startTouchPoint;
    let drawingRatio: number;
    const shaderMatrix: Matrix = new Matrix();
    const currentImageMatrix: Matrix = new Matrix();
    const currentCropMatrix: Matrix = new Matrix();
    const inversedCurrentMatrix: Matrix = new Matrix();
    let closestQuadIndex = -1;
    let closestCornerQuadIndex = -1;
    const cornersPaint = new Paint();
    cornersPaint.color = colorPrimary;
    cornersPaint.setStrokeWidth(14);
    cornersPaint.style = Style.STROKE;
    const shaderPaint = new Paint();
    shaderPaint.style = Style.FILL;
    shaderPaint.color = 'black';

    export let imagePath: string = null;
    export let imageWidth: number = null;
    export let imageHeight: number = null;
    export let imageRotation: number = null;
    export let quads;
    export let quadChanged = false;
    export let qrcode: QRCodeData = null;

    let actualWidth = imageWidth;
    let actualHeight = imageHeight;
    let needRotation = false;
    $: {
        const theRotation = rotation || imageRotation || 0;
        needRotation = theRotation && theRotation % 180 !== 0;
        if (needRotation) {
            actualWidth = imageHeight;
            actualHeight = imageWidth;
        } else {
            actualWidth = imageWidth;
            actualHeight = imageHeight;
        }
    }

    let currentQuads = quads;
    $: currentQuads = quads;

    const rotation = 0;
    let zoomImageShader: BitmapShader;
    let zoomImage: ImageSource;
    let zoomImagePath: string;
    let zoomImageScale: number = 1;
    let mappedQuads;
    $: updateMatrix(canvasView, imagePath, actualWidth, actualHeight);

    $: if (quads && canvasView) {
        updateMatrix(canvasView, imagePath, actualWidth, actualHeight);
        quadChanged = true;
        canvasView.nativeView.invalidate();
    }

    function distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }
    function getQuadAndCornerClosestToPoint(x, y) {
        // first we need to get the point coordinates back
        let minIndex = -1;
        let minDist = Number.MAX_SAFE_INTEGER;
        let minCorner = 0;
        for (let index = 0; index < quads.length; index++) {
            const quad = mappedQuads[index];
            for (let j = 0; j < quad.length; j++) {
                const point = quad[j];
                const dist = distance(x, y, point[0], point[1]);
                if (dist < minDist) {
                    minCorner = j;
                    minDist = dist;
                    minIndex = index;
                }
            }
        }
        if (minIndex !== -1) {
            return [minIndex, minCorner];
        }
    }
    const sensitivityFactor = ApplicationSettings.getNumber('magnifier_sensitivity', MAGNIFIER_SENSITIVITY);
    function onTouch(event: TouchGestureEventData) {
        const x = event.getX();
        const y = event.getY();
        switch (event.action) {
            case 'down': {
                prevTouchPoint = [x, y];
                startTouchPoint = getMatrixMappedPoint(inversedCurrentMatrix, prevTouchPoint);
                const result = getQuadAndCornerClosestToPoint(x, y);
                if (result) {
                    closestQuadIndex = result[0];
                    closestCornerQuadIndex = result[1];
                } else {
                    closestQuadIndex = -1;
                    closestCornerQuadIndex = -1;
                }
                break;
            }
            case 'up':
            case 'cancel': {
                closestQuadIndex = -1;
                closestCornerQuadIndex = -1;
                break;
            }
            case 'move': {
                if (closestCornerQuadIndex !== -1) {
                    const quad = mappedQuads[closestQuadIndex];
                    const touchMoveXDistance = (x - prevTouchPoint[0]) * sensitivityFactor;
                    const touchMoveYDistance = (y - prevTouchPoint[1]) * sensitivityFactor;

                    const newX = Math.round(quad[closestCornerQuadIndex][0] + touchMoveXDistance);
                    const newY = Math.round(quad[closestCornerQuadIndex][1] + touchMoveYDistance);
                    const cornerNewPosition = getMatrixMappedPoint(inversedCurrentMatrix, [newX, newY]);
                    // console.log('cornerNewPosition', x, y, quad[closestCornerQuadIndex], newX, newY, cornerNewPosition);
                    // make sure the user doesn't drag the corner outside the image preview container
                    if (cornerNewPosition[0] >= 0 && cornerNewPosition[0] < actualWidth && cornerNewPosition[1] >= 0 && cornerNewPosition[1] < actualHeight) {
                        quad[closestCornerQuadIndex][0] = newX;
                        quad[closestCornerQuadIndex][1] = newY;
                        currentQuads[closestQuadIndex][closestCornerQuadIndex][0] = Math.round(cornerNewPosition[0]);
                        currentQuads[closestQuadIndex][closestCornerQuadIndex][1] = Math.round(cornerNewPosition[1]);
                        quadChanged = true;
                    }
                    prevTouchPoint = [x, y];
                }
                break;
            }
        }
        canvasView.nativeView.invalidate();
    }

    function getMatrixMappedPoint(matrix: Matrix, p) {
        if (__ANDROID__) {
            const nArray = Array.create('float', 2);
            nArray[0] = p[0];
            nArray[1] = p[1];
            matrix.mapPoints(nArray);
            return [nArray[0], nArray[1]];
        } else {
            const dst = [];
            matrix.mapPoints(dst, p);
            return dst;
        }
    }

    // function getRotation() {
    //     return rotation || imageRotation || 0;
    // }
    function clearImages() {
        if (zoomImage) {
            recycleImages(zoomImage);
            zoomImage = null;
        }
    }
    onDestroy(() => {
        clearImages();
    });
    const updateMatrix = debounce(async function updateMatrix(canvas = canvasView, image = imagePath, width = actualWidth, height = actualHeight) {
        try {
            const nCanvas = canvas?.nativeView;
            if (!nCanvas || !image) {
                return;
            }

            if (!zoomImage || zoomImagePath !== image) {
                clearImages();
                zoomImagePath = image;
                zoomImage = await loadImage(imagePath, { sourceWidth: width, sourceHeight: height, resizeThreshold: ZOOM_IMAGE_MAX_SIZE });
                zoomImageScale = width / zoomImage.width;
                zoomImageShader = new BitmapShader(zoomImage, TileMode.CLAMP, TileMode.CLAMP);
                shaderPaint.setShader(zoomImageShader);
            }
            const w = Utils.layout.toDeviceIndependentPixels(nCanvas.getMeasuredWidth()) - 2 * padding;
            const h = Utils.layout.toDeviceIndependentPixels(nCanvas.getMeasuredHeight()) - 2 * padding;
            if (w <= 0 || h <= 0) {
                return;
            }
            const canvasRatio = w / h;
            // let imageWidth = width;
            // let imageHeight = height;
            // // const needRotation = false ;
            // if (needRotation) {
            //     imageWidth = height;
            //     imageHeight = width;
            // }
            const imageRatio = width / height;
            let cx = padding;
            let cy = padding;
            if (imageRatio < canvasRatio) {
                drawingRatio = h / height;
                cx += (w - h * imageRatio) / 2;
            } else {
                drawingRatio = w / width;
                cy += (h - w / imageRatio) / 2;
            }
            // DEV_LOG && console.log('updateMatrix', w, h, cx, cy, width, height, imageRatio, canvasRatio);
            currentImageMatrix.reset();
            currentCropMatrix.reset();
            // if (needRotation) {
            //     currentImageMatrix.postTranslate(-image.width / 2, -image.height / 2);
            //     currentImageMatrix.postRotate(rotation);
            //     currentImageMatrix.postTranslate(image.height / 2, image.width / 2);
            // }
            // console.log('updateMatrix', imageWidth, imageHeight, editingImage.rotationAngle, needRotation, editingImage.rotationAngle % 180, imageRatio, canvasRatio, drawingRatio, cx, cy,  quads)
            currentImageMatrix.postScale(drawingRatio, drawingRatio);
            currentCropMatrix.postScale(drawingRatio, drawingRatio);
            currentImageMatrix.postTranslate(cx, cy);
            currentCropMatrix.postTranslate(cx, cy);
            // inversedCurrentMatrix = new Matrix();
            currentCropMatrix.invert(inversedCurrentMatrix);
            mappedQuads = quads.map((quad) => quad.map((p) => getMatrixMappedPoint(currentCropMatrix, p)));
            nCanvas.invalidate();
        } catch (error) {
            console.error(error);
        }
    }, 1);
    function drawZoomGlass(canvas: Canvas, point: [number, number], mappedPoint: [number, number]) {
        // we are working in image coords
        //find where to draw the zoom glass
        const [w, h] = getMatrixMappedPoint(inversedCurrentMatrix, [canvas.getWidth() - padding, 0]);
        const glassSize = ZOOOM_GLASS_SIZE / drawingRatio;
        const glassDecale = padding + 10 + glassSize;
        // find furtherst corner
        // const drawingPosition = point;
        const drawingPosition = [glassDecale, glassDecale];
        if (startTouchPoint[0] <= 2 * glassDecale + 20 && startTouchPoint[1] <= 2 * glassDecale + 20) {
            drawingPosition[0] = w - glassDecale;
            if (distance(point[0], point[1], drawingPosition[0], drawingPosition[1]) <= glassSize) {
                drawingPosition[0] = glassDecale;
            }
        } else {
            if (distance(point[0], point[1], drawingPosition[0], drawingPosition[1]) <= glassSize) {
                drawingPosition[0] = w - glassDecale;
            }
        }
        shaderMatrix.reset();
        shaderMatrix.postScale(zoomImageScale, zoomImageScale, 0, 0);
        shaderMatrix.postScale(2, 2, point[0], point[1]);
        zoomImageShader.setLocalMatrix(shaderMatrix);

        canvas.translate(drawingPosition[0] - point[0], drawingPosition[1] - point[1]);
        canvas.drawCircle(point[0], point[1], glassSize, shaderPaint);
        canvas.drawCircle(point[0], point[1], glassSize, cornersPaint);
        cornersPaint.strokeWidth = 1 / drawingRatio;
        const arrowWidth = 10 / drawingRatio;
        canvas.drawLine(point[0] - arrowWidth, point[1], point[0] + arrowWidth, point[1], cornersPaint);
        canvas.drawLine(point[0], point[1] - arrowWidth, point[0], point[1] + arrowWidth, cornersPaint);
    }
    function onCanvasDraw({ canvas }: { canvas: Canvas }) {
        // DEV_LOG && console.log('onCanvasDraw', canvas.getWidth(), canvas.getHeight(), drawingRatio);
        if (!drawingRatio) {
            return;
        }
        // canvas.save();
        canvas.concat(currentImageMatrix);
        // if (editingImage) {
        //     canvas.drawBitmap(editingImage, 0, 0, null);
        // }
        cornersPaint.color = colorPrimary;

        // canvas.restore();
        // canvas.concat(currentCropMatrix);
        // canvas.rotate(-rotation);

        cornersPaint.strokeWidth = 2 / drawingRatio;
        if (quads?.length > 0) {
            for (let index = 0; index < quads.length; index++) {
                const corners = quads[index];
                let currentCornerPoint = corners[0];
                for (let index = 1; index < corners.length; index++) {
                    const point = corners[index];
                    canvas.drawLine(currentCornerPoint[0], currentCornerPoint[1], point[0], point[1], cornersPaint);
                    currentCornerPoint = point;
                }
                canvas.drawLine(currentCornerPoint[0], currentCornerPoint[1], corners[0][0], corners[0][1], cornersPaint);

                //draw corner indicators
                for (let index2 = 0; index2 < corners.length; index2++) {
                    const point = corners[index2];

                    // } else {
                    cornersPaint.strokeWidth = 2 / drawingRatio;
                    canvas.drawCircle(point[0], point[1], 10 / drawingRatio, cornersPaint);
                    // }
                }
                if (closestQuadIndex === index) {
                    drawZoomGlass(canvas, corners[closestCornerQuadIndex], mappedQuads[index][closestCornerQuadIndex]);
                }
            }
        }
        if (qrcode?.length) {
            cornersPaint.color = colorSecondary;
            cornersPaint.strokeWidth = 4 / drawingRatio;
            for (let index = 0; index < qrcode.length; index++) {
                const corners = qrcode[index].position;
                let currentCornerPoint = corners[0];
                for (let index = 1; index < corners.length; index++) {
                    const point = corners[index];
                    canvas.drawLine(currentCornerPoint[0], currentCornerPoint[1], point[0], point[1], cornersPaint);
                    currentCornerPoint = point;
                }
                canvas.drawLine(currentCornerPoint[0], currentCornerPoint[1], corners[0][0], corners[0][1], cornersPaint);
            }
        }
    }
</script>

<gridlayout backgroundColor="black" {...$$restProps}>
    <RotableImageView margin={padding} src={imagePath} stretch="aspectFit" />
    <canvasView bind:this={canvasView} on:draw={onCanvasDraw} on:layoutChanged={() => updateMatrix()} on:touch={onTouch} />
</gridlayout>
