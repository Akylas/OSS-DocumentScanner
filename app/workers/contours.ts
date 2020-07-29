import * as cv2 from 'nativescript-opencv';
cv2.init();
import { isAndroid } from '@nativescript/core';
const SMALL_HEIGHT = 300;
const FULL_HEIGHT = 800;
let resizedImage: cv2.Mat;
let edgesImage: cv2.Mat;

export function resize(img: cv2.Mat, output: cv2.Mat, height = SMALL_HEIGHT, allways = false) {
    const rat = height / img.size().height;
    cv2.Imgproc.resize(img, output, new cv2.Size(rat * img.size().width, height));

    output = img;
}

export function ratio(img: cv2.Mat, height = SMALL_HEIGHT) {
    return img.size().height / height;
}

function intersection(a, b) {
    const x = Math.max(a.x, b.x);
    const y = Math.max(a.y, b.y);
    const w = Math.min(a.x + a.width, b.x + b.width) - x;
    const h = Math.min(a.y + a.height, b.y + b.height) - y;
    if (w < 0 || h < 0) {
        return [0, 0, 0, 0];
    }
    return [x, y, w, h];
}

let hierarchyMat: cv2.Mat;


export function find_page_contours(edges: cv2.Mat, img: cv2.Mat, full = false) {
    // Getting contours
    if (!hierarchyMat) {
        hierarchyMat = new cv2.Mat(0, 0, cv2.CvType.CV_8UC1);
    }
    const nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_TREE, cv2.Imgproc.CHAIN_APPROX_SIMPLE, new cv2.Point(0, 0));
    // Finding biggest rectangle otherwise return original corners
    const height = img.size().height;
    const width = img.size().width;

    const contours: any[] = [];
    const page_contours = [];
    const temp_contours = [];

    // const max_area = MIN_COUNTOUR_AREA;
    for (let index = 0; index < nContours.size(); index++) {
        const contour = nContours.get(index);

        contours[index] = {
            contour,
            area: cv2.Imgproc.contourArea(contour)
        };
    }
    const maxLength = full ? 4 : 12;

    const MIN_COUNTOUR_AREA = height * width * 0.2 * 0.2;
    const MAX_COUNTOUR_AREA = height * width * 0.99 * 0.99;
    const sorted = contours.filter(c => MIN_COUNTOUR_AREA < c.area && c.area < MAX_COUNTOUR_AREA).sort((a, b) => b.area - a.area);


    for (let index = 0; index < sorted.length; index++) {
        const c = sorted[index];

        const cnt = c.contour;
        if (isAndroid) {
            const floatPoint = new org.opencv.core.MatOfPoint2f();
            cnt.convertTo(floatPoint, cv2.CvType.CV_32F);
            const perimeter = cv2.Imgproc.arcLength(floatPoint, true);
            contours[index] = cv2.Imgproc.approxPolyDP(floatPoint, floatPoint, 0.01 * perimeter, true);
            floatPoint.convertTo(cnt, cv2.CvType.CV_32S);
        }

        // Page has 4 corners and it is convex
        const area = c.area;
        const length = cnt.height();
        if (area <= MIN_COUNTOUR_AREA) {
            break;
        }
        // console.log('contour', index, MIN_COUNTOUR_AREA, area, MAX_COUNTOUR_AREA, length, cv2.Imgproc.isContourConvex(cnt));
        // const maxLength = 4;
        if (length === 4 && cv2.Imgproc.isContourConvex(cnt)) {
            let tooClose = false;
            for (let j = 0; j < temp_contours.length; j++) {
                const cnt2 = temp_contours[j];
                const inter = intersection(cv2.Imgproc.boundingRect(cnt2), cv2.Imgproc.boundingRect(cnt));
                if (inter[2] * inter[3] > 0) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) {
                const points = cnt.toArray();
                temp_contours.push(cnt);
                const offset = 0;
                const realPoints = [];
                for (let j = 0; j < length; j++) {
                    const element = points[j];
                    realPoints.push([element.x + offset, element.y + offset]);
                }

                page_contours.push(realPoints);
            }
        }
    }
    // return page_contours;
    return page_contours.map(c => order_points(c));
}

function norm(p1: [number, number], p2: [number, number]) {
    const res = [p1[0] - p2[0], p1[1] - p2[1]];
    return Math.sqrt(Math.pow(res[0], 2) + Math.pow(res[1], 2));
}

function order_points(pts: [number, number][]) {
    if (pts.length === 0) {
        return pts;
    }
    // sort the points based on their x-coordinates
    const xSorted = pts.sort(function(a, b) {
        return a[0] - b[0];
    });

    // grab the left-most and right-most points from the sorted
    // x-roodinate points
    let leftMost = xSorted.slice(0, 2);
    const rightMost = xSorted.slice(-2);

    // now, sort the left-most coordinates according to their
    // y-coordinates so we can grab the top-left and bottom-left
    // points, respectively
    leftMost = leftMost.sort(function(a, b) {
        return a[1] - b[1];
    });
    const [tl, bl] = leftMost;

    // now that we have the top-left coordinate, use it as an
    // anchor to calculate the Euclidean distance between the
    // top-left and right-most points; by the Pythagorean
    // theorem, the point with the largest distance will be
    // our bottom-right point
    const Ds = rightMost.map(p => norm(tl, p));
    const sortedIndexes = Ds.map((s, i) => i).sort(function(a, b) {
        return Ds[a] - Ds[b];
    });
    const br = rightMost[sortedIndexes[1]];
    const tr = rightMost[sortedIndexes[0]];
    // return the coordinates in top-left, top-right,
    // bottom-right, and bottom-left order
    return [tl, tr, br, bl];
}

function matFromArray(rows, cols, type, array) {
    const mat = new cv2.Mat(rows, cols, type);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const nArray = Array.create('float', 1);
            nArray[0] = array[i][j];
            mat.put(i, j,nArray);
        }
    }
    return mat;
}
export function persp_transform(img: cv2.Mat, s_points: [number, number][], ratio: number = 1) {
    if (ratio !== 1) {

        s_points = s_points.map(p => [Math.round(p[0] * ratio), Math.round(p[1] * ratio)]);
    }
    const sMat = matFromArray(s_points.length, 2, cv2.CvType.CV_32F, s_points);
    // Euclidean distance - calculate maximum height and width
    const [tl, tr, br, bl] = s_points;


    //  compute the width of the new image, which will be the
    //  maximum distance between bottom-right and bottom-left
    //  x-coordiates or the top-right and top-left x-coordinates
    const widthA = Math.sqrt((br[0] - bl[0]) ** 2 + (br[1] - bl[1]) ** 2);
    const widthB = Math.sqrt((tr[0] - tl[0]) ** 2 + (tr[1] - tl[1]) ** 2);
    const maxWidth = Math.max(Math.round(widthA), Math.round(widthB));

    //  compute the height of the new image, which will be the
    //  maximum distance between the top-right and bottom-right
    //  y-coordinates or the top-left and bottom-left y-coordinates
    const heightA = Math.sqrt((tr[0] - br[0]) ** 2 + (tr[1] - br[1]) ** 2);
    const heightB = Math.sqrt((tl[0] - bl[0]) ** 2 + (tl[1] - bl[1]) ** 2);
    const maxHeight = Math.max(Math.round(heightA), Math.round(heightB));
    // Create target points
    const t_points = [
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ];
    const tMat = matFromArray(t_points.length, 2, cv2.CvType.CV_32F, t_points);

    const M = cv2.Imgproc.getPerspectiveTransform(sMat, tMat);
    const out = new cv2.Mat(maxHeight, maxWidth, img.type());
    cv2.Imgproc.warpPerspective(img, out, M, new cv2.Size(maxWidth, maxHeight));
    return out;
}

let kernel9: cv2.Mat;
let kernel2: cv2.Mat;
let gray: cv2.Mat;

function edges_det(img: cv2.Mat, out, min_val, max_val, full = false) {
    if (full) {
        if (!gray) {
            gray = new cv2.Mat(img.size().height, img.size().width, cv2.CvType.CV_8UC1);
        }
        if (img.channels() === 4) {
            cv2.Imgproc.cvtColor(img, gray, cv2.Imgproc.COLOR_RGBA2GRAY);
            img = gray;
        } else if (img.channels() === 3) {
            cv2.Imgproc.cvtColor(img, gray, cv2.Imgproc.COLOR_RGB2GRAY);
            img = gray;
        }
        if (gray.type() !== cv2.CvType.CV_8UC1) {
            gray.convertTo(gray, cv2.CvType.CV_8UC1);
        }
    }
    cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(7, 7), 0);
    if (!kernel9) {
        kernel9 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(9, 9));
    }
    cv2.Imgproc.morphologyEx(out, out, cv2.Imgproc.MORPH_CLOSE, kernel9);


    cv2.Imgproc.Canny(out, out, min_val, max_val);
    if (!kernel2) {
        kernel2 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(2, 2));
    }
    cv2.Imgproc.dilate(out, out, kernel2);
    return out;
}

export function findDocuments(image: cv2.Mat, full = false) {
    const size = image.size();
    const w = size.width;
    const h = size.height;
    const wantedHeight = full ? FULL_HEIGHT : SMALL_HEIGHT;
    if (h > wantedHeight) {
        if (!resizedImage) {
            resizedImage = new cv2.Mat(h, w, cv2.CvType.CV_8UC1);
        }
        resize(image, resizedImage);
    } else {
        resizedImage = image;
    }
    const rsize = resizedImage.size();
    const rw = rsize.width;
    const rh = rsize.height;
    if (!edgesImage) {
        edgesImage = new cv2.Mat(rh, rw, cv2.CvType.CV_8UC1);
    }
    edges_det(resizedImage, edgesImage, 0, 84, full);
    const contours = find_page_contours(edgesImage, resizedImage, full);
    return { edgesImage, resizedImage, contours };
}
