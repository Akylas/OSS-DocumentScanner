<script context="module" lang="ts">
    import { BitmapShader, Canvas, CanvasView, Matrix, Paint, Path, Style, TileMode } from '@nativescript-community/ui-canvas';
    import { ApplicationSettings, ImageSource, Screen, TouchGestureEventData, Utils } from '@nativescript/core';
    import { debounce } from '@nativescript/core/utils';
    import { QRCodeData, QuadPoint, Quads } from 'plugin-nativeprocessor';
    import { onDestroy } from 'svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { MAGNIFIER_SENSITIVITY } from '~/utils/constants';
    import { loadImage, recycleImages } from '~/utils/images';
    import { showError } from '~/utils/showError';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { colors } from '~/variables';
    import RotableImageView from './RotableImageView.svelte';
    const padding = 20;
    const ZOOOM_GLASS_SIZE = 50;
    const ZOOM_IMAGE_MAX_SIZE = Math.max(Screen.mainScreen.widthDIPs, Screen.mainScreen.heightDIPs);
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
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
    let closestCornerQuadIndex: number[] = [];
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
    export let quads: Quads;
    export let quadChanged = false;
    export let qrcode: QRCodeData = null;
    export let undos = [];
    export let redos = [];

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

    function distance(point1: QuadPoint, point2: QuadPoint) {
        return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
    }

    function isConvex(arr: QuadPoint[]) {
        const { length } = arr;
        let pre = 0,
            curr = 0;
        for (let i = 0; i < length; ++i) {
            const dx1 = arr[(i + 1) % length][0] - arr[i][0];
            const dx2 = arr[(i + 2) % length][0] - arr[(i + 1) % length][0];
            const dy1 = arr[(i + 1) % length][1] - arr[i][1];
            const dy2 = arr[(i + 2) % length][1] - arr[(i + 1) % length][1];
            curr = dx1 * dy2 - dx2 * dy1;
            if (curr !== 0) {
                if ((curr > 0 && pre < 0) || (curr < 0 && pre > 0)) {
                    return false;
                } else {
                    pre = curr;
                }
            }
        }
        return true;
    }
    function getQuadAndCornerClosestToPoint(point1: QuadPoint) {
        let centerDist = Number.MAX_SAFE_INTEGER;
        let centerDistIndex = -1;

        let minHandleIndex = -1;
        let minHandleDist = Number.MAX_SAFE_INTEGER;
        let minHandleCorners: number[] = [];

        let minIndex = -1;
        let minDist = Number.MAX_SAFE_INTEGER;
        let minCorner = 0;
        for (let index = 0; index < quads.length; index++) {
            const quad = mappedQuads[index];
            const length = quad.length;
            let minX, maxX, minY, maxY;
            for (let j = 0; j < length; j++) {
                const point = quad[j];
                const nextPoint = quad[(j + 1) % length];
                minX = point[0] < minX || minX == null ? point[0] : minX;
                maxX = point[0] > maxX || maxX == null ? point[0] : maxX;
                minY = point[1] < minY || minY == null ? point[1] : minY;
                maxY = point[1] > maxY || maxY == null ? point[1] : maxY;
                const handleCenter = [(nextPoint[0] + point[0]) / 2, (nextPoint[1] + point[1]) / 2] as QuadPoint;
                const hdist = distance(point1, handleCenter);
                if (hdist < minHandleDist) {
                    minHandleCorners = [j, (j + 1) % length];
                    minHandleDist = hdist;
                    minHandleIndex = index;
                }
                const dist = distance(point1, point);
                if (dist < minDist) {
                    minCorner = j;
                    minDist = dist;
                    minIndex = index;
                }
                // currentPoint = point;
            }
            const quadCenterDist = distance([(minX + maxX) / 2, (minY + maxY) / 2], point1);
            if (quadCenterDist < centerDist) {
                centerDistIndex = index;
                centerDist = quadCenterDist;
            }
        }
        // DEV_LOG && console.log('getQuadAndCornerClosestToPoint', minIndex, minHandleIndex, centerDistIndex, centerDist, minHandleDist, minDist);
        if (minIndex !== -1 || minHandleIndex !== -1 || centerDistIndex !== -1) {
            const dists = [centerDist, minHandleDist, minDist];
            const minVal = Math.min(...dists);
            switch (dists.indexOf(minVal)) {
                case 0:
                    return [centerDistIndex, [0, 1, 2, 3]] as [number, number[]];
                case 1:
                    return [minHandleIndex, minHandleCorners] as [number, number[]];
                case 2:
                    return [minIndex, [minCorner]] as [number, number[]];
            }
            // if (minHandleDist < minDist) {
            //     return [minHandleIndex, minHandleCorners] as [number, number[]];
            // } else  if (minHandleDist < minDist) {
            //     return [minHandleIndex, minHandleCorners] as [number, number[]];
            // } else {
            //     return [minIndex, [minCorner]] as [number, number[]];
            // }
        }
        return [-1, []] as [number, number[]];
    }
    const sensitivityFactor = ApplicationSettings.getNumber('magnifier_sensitivity', MAGNIFIER_SENSITIVITY);
    let changeOnTouch = false;
    let lastUndo;
    function onTouch(event: TouchGestureEventData) {
        try {
            const x = event.getX();
            const y = event.getY();
            switch (event.action) {
                case 'down': {
                    lastUndo = {
                        quads: JSON.stringify(currentQuads),
                        mappedQuads: JSON.stringify(mappedQuads)
                    };
                    changeOnTouch = false;
                    prevTouchPoint = [x, y];
                    startTouchPoint = getMatrixMappedPoint(inversedCurrentMatrix, prevTouchPoint);
                    [closestQuadIndex, closestCornerQuadIndex] = getQuadAndCornerClosestToPoint(prevTouchPoint);
                    // if (result) {
                    //     closestQuadIndex = [result[0]];
                    //     closestCornerQuadIndex = [result[1]];
                    // } else {
                    //     closestQuadIndex = [];
                    //     closestCornerQuadIndex = [];
                    // }
                    break;
                }
                case 'up':
                case 'cancel': {
                    closestQuadIndex = -1;
                    closestCornerQuadIndex = [];
                    if (changeOnTouch) {
                        redos.splice(0, redos.length);
                        undos.push(lastUndo);
                        dispatch('undosChanged');
                    } else {
                        lastUndo = null;
                    }
                    break;
                }
                case 'move': {
                    if (closestQuadIndex !== -1) {
                        let canUpdate = true;
                        const updates = [];
                        for (let index = 0; index < closestCornerQuadIndex.length; index++) {
                            const cornerQuadIndex = closestCornerQuadIndex[index];
                            const quad = mappedQuads[closestQuadIndex];
                            const touchMoveXDistance = (x - prevTouchPoint[0]) * sensitivityFactor;
                            const touchMoveYDistance = (y - prevTouchPoint[1]) * sensitivityFactor;

                            const newX = Math.round(quad[cornerQuadIndex][0] + touchMoveXDistance);
                            const newY = Math.round(quad[cornerQuadIndex][1] + touchMoveYDistance);
                            const cornerNewPosition = getMatrixMappedPoint(inversedCurrentMatrix, [newX, newY]);
                            // console.log('cornerNewPosition', x, y, quad[closestCornerQuadIndex], newX, newY, cornerNewPosition);
                            // make sure the user doesn't drag the corner outside the image preview container
                            if (cornerNewPosition[0] >= 0 && cornerNewPosition[0] < actualWidth && cornerNewPosition[1] >= 0 && cornerNewPosition[1] < actualHeight) {
                                updates.push({
                                    cornerIndex: cornerQuadIndex,
                                    mappedPoint: [newX, newY],
                                    point: cornerNewPosition.map(Math.round)
                                });
                                // quad[cornerQuadIndex][0] = newX;
                                // quad[cornerQuadIndex][1] = newY;
                                // currentQuads[closestQuadIndex][cornerQuadIndex][0] = Math.round(cornerNewPosition[0]);
                                // currentQuads[closestQuadIndex][cornerQuadIndex][1] = Math.round(cornerNewPosition[1]);
                                // quadChanged = true;
                            } else {
                                canUpdate = false;
                            }
                        }
                        if (canUpdate) {
                            const quad = [...mappedQuads[closestQuadIndex]];
                            const currentQuad = [...currentQuads[closestQuadIndex]];
                            updates.forEach((u) => {
                                quad[u.cornerIndex] = u.mappedPoint;
                                currentQuad[u.cornerIndex] = u.point;
                            });
                            if (isConvex(quad)) {
                                quadChanged = true;
                                changeOnTouch = true;
                                for (let index = 0; index < quad.length; index++) {
                                    currentQuads[closestQuadIndex][index] = currentQuad[index];
                                }
                                mappedQuads[closestQuadIndex] = quad;
                            }
                        }
                        prevTouchPoint = [x, y];
                    } else {
                        return;
                    }
                    break;
                }
            }
            canvasView.nativeView.invalidate();
        } catch (error) {
            console.error(error, error.stack);
        }
    }
    function updateUndoRedo(lastData) {
        mappedQuads = JSON.parse(lastData.mappedQuads);
        const quads = JSON.parse(lastData.quads);
        for (let index = 0; index < quads.length; index++) {
            const quad = quads[index];
            if (currentQuads[index]) {
                for (let j = 0; j < quad.length; j++) {
                    currentQuads[index][j] = quad[j];
                }
            }
        }
        quadChanged = undos.length > 0;
        canvasView.nativeView.invalidate();
    }
    export function applyUndo() {
        try {
            if (undos.length) {
                const lastUndo = undos.pop();
                redos.push({
                    quads: JSON.stringify(currentQuads),
                    mappedQuads: JSON.stringify(mappedQuads)
                });
                updateUndoRedo(lastUndo);
                dispatch('undosChanged');
            }
        } catch (error) {
            showError(error);
        }
    }

    export function applyRedo() {
        try {
            if (redos.length) {
                const lastRedo = redos.pop();
                undos.push({
                    quads: JSON.stringify(currentQuads),
                    mappedQuads: JSON.stringify(mappedQuads)
                });
                updateUndoRedo(lastRedo);
                dispatch('undosChanged');
            }
        } catch (error) {
            showError(error);
        }
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
                if (zoomImage?.android || zoomImage?.ios) {
                    zoomImageScale = width / zoomImage.width;
                    zoomImageShader = new BitmapShader(zoomImage, TileMode.CLAMP, TileMode.CLAMP);
                    shaderPaint.setShader(zoomImageShader);
                }
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
            console.error(error, error.stack);
        }
    }, 1);
    function drawZoomGlass(canvas: Canvas, point: QuadPoint, mappedPoint: QuadPoint) {
        // we are working in image coords
        //find where to draw the zoom glass
        const [w, h] = getMatrixMappedPoint(inversedCurrentMatrix, [canvas.getWidth() - padding, 0]);
        const glassSize = ZOOOM_GLASS_SIZE / drawingRatio;
        const glassDecale = padding + 10 + glassSize;
        // find furtherst corner
        // const drawingPosition = point;
        const drawingPosition = [glassDecale, glassDecale] as QuadPoint;
        if (startTouchPoint[0] <= 2 * glassDecale + 20 && startTouchPoint[1] <= 2 * glassDecale + 20) {
            drawingPosition[0] = w - glassDecale;
            if (distance(point, drawingPosition) <= glassSize) {
                drawingPosition[0] = glassDecale;
            }
        } else {
            if (distance(point, drawingPosition) <= glassSize) {
                drawingPosition[0] = w - glassDecale;
            }
        }
        shaderMatrix.reset();
        shaderMatrix.postScale(zoomImageScale, zoomImageScale, 0, 0);
        shaderMatrix.postScale(2, 2, point[0], point[1]);
        zoomImageShader?.setLocalMatrix(shaderMatrix);

        canvas.translate(drawingPosition[0] - point[0], drawingPosition[1] - point[1]);
        canvas.drawCircle(point[0], point[1], glassSize, shaderPaint);
        canvas.drawCircle(point[0], point[1], glassSize, cornersPaint);
        cornersPaint.strokeWidth = 1 / drawingRatio;
        const arrowWidth = 10 / drawingRatio;
        canvas.drawLine(point[0] - arrowWidth, point[1], point[0] + arrowWidth, point[1], cornersPaint);
        canvas.drawLine(point[0], point[1] - arrowWidth, point[0], point[1] + arrowWidth, cornersPaint);
    }

    function createRectangleAlongLine(point1: QuadPoint, point2: QuadPoint, width, height) {
        // Calculate the midpoint
        const mx = (point1[0] + point2[0]) / 2;
        const my = (point1[1] + point2[1]) / 2;

        // Calculate the angle of the line
        const theta = Math.atan2(point2[1] - point1[1], point2[0] - point1[0]);

        // Calculate half dimensions
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Calculate the corners
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const hSinTheta = halfHeight * sinTheta;
        const hCosTheta = halfHeight * cosTheta;
        const wSinTheta = halfWidth * sinTheta;
        const wCosTheta = halfWidth * cosTheta;
        const dx1 = -wCosTheta - hSinTheta;
        const dy1 = -wSinTheta + hCosTheta;

        const dx2 = wCosTheta - hSinTheta;
        const dy2 = wSinTheta + hCosTheta;

        const dx3 = wCosTheta + hSinTheta;
        const dy3 = wSinTheta - hCosTheta;

        const dx4 = -wCosTheta + hSinTheta;
        const dy4 = -wSinTheta - hCosTheta;

        return [
            [mx + dx1, my + dy1],
            [mx + dx2, my + dy2],
            [mx + dx3, my + dy3],
            [mx + dx4, my + dy4]
        ] as QuadPoint[];
    }
    const path: Path = new Path();
    function drawLineAndHandle(canvas: Canvas, pos1: QuadPoint, pos2: QuadPoint, drawingRatio: number) {
        canvas.drawLine(pos1[0], pos1[1], pos2[0], pos2[1], cornersPaint);
        const d = distance(pos1, pos2);
        const rect = createRectangleAlongLine(pos1, pos2, Math.min(0.3 * d, 90 / drawingRatio), 10 / drawingRatio);
        path.reset();
        path.moveTo(rect[0][0], rect[0][1]);
        path.lineTo(rect[1][0], rect[1][1]);
        path.lineTo(rect[2][0], rect[2][1]);
        path.lineTo(rect[3][0], rect[3][1]);
        path.close();
        canvas.drawPath(path, cornersPaint);
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
                    drawLineAndHandle(canvas, currentCornerPoint, point, drawingRatio);
                    currentCornerPoint = point;
                }
                drawLineAndHandle(canvas, currentCornerPoint, corners[0], drawingRatio);

                //draw corner indicators
                for (let index2 = 0; index2 < corners.length; index2++) {
                    const point = corners[index2];
                    canvas.drawCircle(point[0], point[1], 10 / drawingRatio, cornersPaint);
                }

                if (closestCornerQuadIndex.length === 1 && closestQuadIndex === index) {
                    drawZoomGlass(canvas, corners[closestCornerQuadIndex[0]], mappedQuads[index][closestCornerQuadIndex[0]]);
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

<gridlayout backgroundColor="black" {...$$restProps} id="cropView" on:redo={applyRedo} on:undo={applyUndo}>
    <RotableImageView decodeWidth={ZOOM_IMAGE_MAX_SIZE} margin={padding} src={imagePath} stretch="aspectFit" />
    <canvasView bind:this={canvasView} on:draw={onCanvasDraw} on:layoutChanged={() => updateMatrix()} on:touch={onTouch} />
</gridlayout>
