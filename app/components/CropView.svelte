<script lang="ts">
    import { BitmapShader, Canvas, CanvasView, Matrix, Paint, Style, TileMode } from '@nativescript-community/ui-canvas';
    import { ImageSource, TouchGestureEventData, Utils } from '@nativescript/core';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { primaryColor } from '~/variables';

    const padding = 20;
    let canvasView: NativeViewElementNode<CanvasView>;
    let prevTouchPoint;
    let drawingRatio: number;
    const shaderMatrix: Matrix = new Matrix();
    const currentImageMatrix: Matrix = new Matrix();
    const currentCropMatrix: Matrix = new Matrix();
    const inversedCurrentMatrix: Matrix = new Matrix();
    let closestQuadIndex = -1;
    let closestCornerQuadIndex = -1;
    const cornersPaint = new Paint();
    cornersPaint.color = primaryColor;
    cornersPaint.setStrokeWidth(14);
    cornersPaint.style = Style.STROKE;
    const shaderPaint = new Paint();
    shaderPaint.style = Style.FILL;
    shaderPaint.color = 'black';

    export let editingImage: ImageSource;
    let rotation = 0;
    export let quads;
    export let quadChanged = false;
    let editingImageShader: BitmapShader;
    let mappedQuads;

    $: updateMatrix(canvasView, editingImage);

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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
    function onTouch(event: TouchGestureEventData) {
        const x = event.getX();
        const y = event.getY();
        switch (event.action) {
            case 'down': {
                prevTouchPoint = [x, y];
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
                    const touchMoveXDistance = x - prevTouchPoint[0];
                    const touchMoveYDistance = y - prevTouchPoint[1];

                    const newX = quad[closestCornerQuadIndex][0] + touchMoveXDistance;
                    const newY = quad[closestCornerQuadIndex][1] + touchMoveYDistance;
                    const cornerNewPosition = getMatrixMappedPoint(inversedCurrentMatrix, [newX, newY]);
                    // console.log('cornerNewPosition', x, y, quad[closestCornerQuadIndex], newX, newY, cornerNewPosition);
                    // make sure the user doesn't drag the corner outside the image preview container
                    if (cornerNewPosition[0] >= 0 && cornerNewPosition[0] < editingImage.width && cornerNewPosition[1] >= 0 && cornerNewPosition[1] < editingImage.height) {
                        quad[closestCornerQuadIndex][0] = newX;
                        quad[closestCornerQuadIndex][1] = newY;
                        quads[closestQuadIndex][closestCornerQuadIndex][0] = cornerNewPosition[0];
                        quads[closestQuadIndex][closestCornerQuadIndex][1] = cornerNewPosition[1];
                        quadChanged = true;
                    }
                    prevTouchPoint = [x, y];
                }
                break;
            }
        }
        canvasView.nativeView.invalidate();
    }

    function getMatrixMappedPoint(matrix, p) {
        if (__ANDROID__) {
            const nArray = Array.create('float', 2);
            nArray[0] = p[0];
            nArray[1] = p[1];
            matrix.mapPoints(nArray);
            return [nArray[0], nArray[1]];
        } else {
            return matrix.mapPoints(p);
        }
    }

    function getRotation() {
        return rotation || editingImage.rotationAngle;
    }
    function updateMatrix(canvas = canvasView, image = editingImage) {
        try {
            if (!canvas?.nativeView || !image) {
                return;
            }
            editingImageShader = new BitmapShader(image, TileMode.CLAMP, TileMode.CLAMP);
            shaderPaint.setShader(editingImageShader);
            const w = Utils.layout.toDeviceIndependentPixels(canvas.nativeView.getMeasuredWidth()) - 2*padding;
            const h = Utils.layout.toDeviceIndependentPixels(canvas.nativeView.getMeasuredHeight()) - 2*padding;
            if (w === 0 || h === 0) {
                return;
            }
            const canvasRatio = w / h;
            let imageWidth = image.width;
            let imageHeight = image.height;
            rotation = getRotation();
            const needRotation = rotation && rotation % 180 !== 0;
            // const needRotation = false ;
            console.log('updateMatrix', rotation, needRotation, editingImage.rotationAngle, editingImage.width, editingImage.height);
            if (needRotation) {
                imageWidth = image.height;
                imageHeight = image.width;
            }
            const imageRatio = imageWidth / imageHeight;
            let cx = padding;
            let cy = padding;
            if (imageRatio < canvasRatio) {
                drawingRatio = h / imageHeight;
                cx += (w - h * imageRatio) / 2;
            } else {
                drawingRatio = w / imageWidth;
                cy += (h - w / imageRatio) / 2;
            }
            console.log('imageRatio', imageRatio, canvasRatio, w, h, imageWidth, imageHeight, cx, cy);
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
            canvas?.nativeView.invalidate();
        } catch (error) {
            console.error(error);
        }
    }
    function onCanvasDraw({ canvas }: { canvas: Canvas }) {
        // canvas.save();
        canvas.concat(currentImageMatrix);

        canvas.drawBitmap(editingImage, 0, 0, null);

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
                    if (closestQuadIndex === index && closestCornerQuadIndex === index2) {
                        shaderMatrix.reset();
                        // matrix.postScale(point[0], point[1], 0, 0);
                        shaderMatrix.postScale(4, 4, point[0], point[1]);
                        editingImageShader.setLocalMatrix(shaderMatrix);
                        canvas.drawCircle(point[0], point[1], 30 / drawingRatio, shaderPaint);
                        canvas.drawCircle(point[0], point[1], 30 / drawingRatio, cornersPaint);
                        cornersPaint.strokeWidth = 1 / drawingRatio;
                        const arrowWidth = 10 / drawingRatio;
                        canvas.drawLine(point[0] - arrowWidth, point[1], point[0] + arrowWidth, point[1], cornersPaint);
                        canvas.drawLine(point[0], point[1] - arrowWidth, point[0], point[1] + arrowWidth, cornersPaint);
                    } else {
                        canvas.drawCircle(point[0], point[1], 10 / drawingRatio, cornersPaint);
                    }
                }
            }
        }
    }
</script>

<canvasView
    bind:this={canvasView}
    backgroundColor="black"
    on:draw={onCanvasDraw}
    on:layoutChanged={() => updateMatrix()}
    on:touch={onTouch}
    {...$$restProps}
/>
