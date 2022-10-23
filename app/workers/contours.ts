import * as cv2 from 'nativescript-opencv';
cv2.init();
import { ImageWorkerOptions } from './options';
import { simplify_line } from './simplify';
import { presimplify } from 'topojson-simplify/src';
const SMALL_HEIGHT = 300;
const FULL_HEIGHT = 300;
let resizedImage: cv2.Mat;
let edgesImage: cv2.Mat;

export function getCVRotation(rotation) {
    switch (rotation) {
        case -90:
            return cv2.Core.ROTATE_90_COUNTERCLOCKWISE;
        case 90:
            return cv2.Core.ROTATE_90_CLOCKWISE;
        case 180:
            return cv2.Core.ROTATE_180;
        default:
            return -1;
    }
}

export function resize(img: cv2.Mat, output: cv2.Mat, height = SMALL_HEIGHT, allways = false) {
    const rat = height / img.size().height;
    cv2.Imgproc.resize(img, output, new cv2.Size(rat * img.size().width, height), cv2.Imgproc.INTER_NEAREST);

    output = img;
    return rat;
}

export function ratio(img: cv2.Mat, height = SMALL_HEIGHT) {
    return img.size().height / height;
}

function getQuadrilateral(points: [number, number][]) {
    // if document has a bent corner
    let shortestDistance = Number.MAX_SAFE_INTEGER;
    let shortestPoint1 = null;
    let shortestPoint2 = null;

    let diagonal = 0;
    let diagonalPoint1 = null;
    let diagonalPoint2 = null;

    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const d = getDistance(points[i], points[j]);
            if (d < shortestDistance) {
                shortestDistance = d;
                shortestPoint1 = points[i];
                shortestPoint2 = points[j];
            }
            if (d > diagonal) {
                diagonal = d;
                diagonalPoint1 = points[i];
                diagonalPoint2 = points[j];
            }
        }
    }
    const newArray = [shortestPoint1, shortestPoint2, diagonalPoint1, diagonalPoint2];
    const difference = points.filter((x) => newArray.indexOf(x) === -1);

    const trianglePointWithHypotenuse = difference[0];
    let newPoint;
    if (
        trianglePointWithHypotenuse[0] > shortestPoint1[0] &&
        trianglePointWithHypotenuse[0] > shortestPoint2[0] &&
        trianglePointWithHypotenuse[1] > shortestPoint1[1] &&
        trianglePointWithHypotenuse[1] > shortestPoint2[1]
    ) {
        newPoint = [Math.min(shortestPoint1[0], shortestPoint2[0]), Math.min(shortestPoint1[1], shortestPoint2[1])];
    } else if (
        trianglePointWithHypotenuse[0] < shortestPoint1[0] &&
        trianglePointWithHypotenuse[0] < shortestPoint2[0] &&
        trianglePointWithHypotenuse[1] > shortestPoint1[1] &&
        trianglePointWithHypotenuse[1] > shortestPoint2[1]
    ) {
        newPoint = [Math.max(shortestPoint1[0], shortestPoint2[0]), Math.min(shortestPoint1[1], shortestPoint2[1])];
    } else if (
        trianglePointWithHypotenuse[0] < shortestPoint1[0] &&
        trianglePointWithHypotenuse[0] < shortestPoint2[0] &&
        trianglePointWithHypotenuse[1] < shortestPoint1[1] &&
        trianglePointWithHypotenuse[1] < shortestPoint2[1]
    ) {
        newPoint = [Math.max(shortestPoint1[0], shortestPoint2[0]), Math.max(shortestPoint1[1], shortestPoint2[1])];
    } else if (
        trianglePointWithHypotenuse[0] > shortestPoint1[0] &&
        trianglePointWithHypotenuse[0] > shortestPoint2[0] &&
        trianglePointWithHypotenuse[1] < shortestPoint1[1] &&
        trianglePointWithHypotenuse[1] < shortestPoint2[1]
    ) {
        newPoint = [Math.min(shortestPoint1[0], shortestPoint2[0]), Math.max(shortestPoint1[1], shortestPoint2[1])];
    } else {
        newPoint = [0.0, 0.0];
    }

    return [trianglePointWithHypotenuse, diagonalPoint1, diagonalPoint2, newPoint];
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

function simplify(inPoints, nbPoints) {
    const presimplified = presimplify({ arcs: [inPoints] });
    // Remove points whose weight is less than the minimum weight.
    const sorted = presimplified.arcs[0].sort((a, b) => a[2] - b[2]);
    const result = sorted.splice(0, nbPoints);
    return result.map((p) => p.slice(0, 2));
}

export function find_page_contours(edges: cv2.Mat, img: cv2.Mat, data: ImageWorkerOptions) {
    // Getting contours
    if (!hierarchyMat) {
        hierarchyMat = new cv2.Mat(0, 0, cv2.CvType.CV_8UC1);
    }
    if (data.debug && img.channels() === 1) {
        cv2.Imgproc.cvtColor(img, img, cv2.Imgproc.COLOR_GRAY2RGB);
    }
    let nContours;
    switch (data.pageContourType) {
        case 0:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_EXTERNAL, cv2.Imgproc.CHAIN_APPROX_SIMPLE);
            break;
        case 1:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_EXTERNAL, cv2.Imgproc.CHAIN_APPROX_NONE);
            break;
        case 2:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_TREE, cv2.Imgproc.CHAIN_APPROX_SIMPLE);
            break;
        case 3:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_TREE, cv2.Imgproc.CHAIN_APPROX_NONE);
            break;
        case 4:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_LIST, cv2.Imgproc.CHAIN_APPROX_NONE);
            break;
        case 5:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_LIST, cv2.Imgproc.CHAIN_APPROX_SIMPLE);
            break;
        case 6:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_CCOMP, cv2.Imgproc.CHAIN_APPROX_NONE);
            break;
        case 7:
            nContours = cv2.Imgproc.findContours(edges, null, hierarchyMat, cv2.Imgproc.RETR_CCOMP, cv2.Imgproc.CHAIN_APPROX_SIMPLE);
            break;
    }
    if (!nContours) {
        return;
    }
    // Finding biggest rectangle otherwise return original corners
    const height = img.size().height;
    const width = img.size().width;

    const contours: {
        contour: cv2.MatOfPoint;
        index: number;
        area: number;
    }[] = [];
    const page_contours = [];
    const temp_contours = [];
    if (data.debug) {
        cv2.Imgproc.drawContours(img, nContours, -1, new cv2.Scalar(255, 255, 0), 2);
    }
    // const max_area = MIN_COUNTOUR_AREA;
    for (let index = 0; index < nContours.size(); index++) {
        const contour = nContours.get(index) as cv2.MatOfPoint;
        contours.push({
            contour,
            index,
            area: cv2.Imgproc.contourArea(contour)
        });
    }

    const MIN_COUNTOUR_AREA = height * width * 0.15 * 0.15;
    const MAX_COUNTOUR_AREA = height * width * 0.99 * 0.99;
    // console.log(
    //     'test',
    //     contours.length,
    // );
    const sorted = contours.filter((a) => MIN_COUNTOUR_AREA < a.area && a.area < MAX_COUNTOUR_AREA).sort((a, b) => b.area - a.area);
    // console.log('sorted', sorted.length);
    const foundContoursLength = sorted.length;

    const approx = data.approxValue || 0.02;
    for (let index = 0; index < foundContoursLength; index++) {
        const c = sorted[index];

        const cnt = c.contour;
        if (global.isAndroid) {
            const floatPoint = new org.opencv.core.MatOfPoint2f();
            cnt.convertTo(floatPoint, cv2.CvType.CV_32F);
            const perimeter = cv2.Imgproc.arcLength(floatPoint, true);
            cv2.Imgproc.approxPolyDP(floatPoint, floatPoint, approx * perimeter, true);
            floatPoint.convertTo(cnt, cv2.CvType.CV_32S);
            contours[index].contour = cnt;
            nContours.set(index, cnt);
        }
        // cv2.Imgproc.drawContours(img, nContours, index, new cv2.Scalar(255, 0, 255), 1);

        const area = c.area;
        const length = cnt.height();
        if (length >= 4 && cv2.Imgproc.isContourConvex(cnt)) {
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
                temp_contours.push(cnt);
                let points: any[] = [];
                let realPoints = [];
                if (data.boundType === 0) {
                    points = cnt.toArray() as any;

                    if (data.boundType === 0) {
                        const length = points.length;
                        for (let j = 0; j < length; j++) {
                            const element = points[j];
                            realPoints.push([element.x, element.y]);
                        }
                        if (realPoints.length > 4) {
                            realPoints = minBoundingRect(realPoints);
                        } else {
                            realPoints = sortCorners(realPoints);
                            // realPoints = four_corners_sort(realPoints);
                        }
                    }
                    if (data.debug) {
                        cv2.Imgproc.drawContours(img, nContours, c.index, new cv2.Scalar(0, 255, 0), 2);
                        for (let i = 0; i < realPoints.length; i++) {
                            const realPoint1 = realPoints[i];
                            const realPoint2 = realPoints[(i + 1) % realPoints.length];
                            cv2.Imgproc.line(img, new cv2.Point(realPoint1[0], realPoint1[1]), new cv2.Point(realPoint2[0], realPoint2[1]), new cv2.Scalar(0, 0, 255), 2);
                        }
                    }
                } else if (data.boundType === 1) {
                    const rect = cv2.Imgproc.boundingRect(cnt);
                    if (data.boundType === 1) {
                        realPoints = [
                            [rect.x + rect.width - 1, rect.y],
                            [rect.x, rect.y],
                            [rect.x, rect.y + rect.height - 1],
                            [rect.x + rect.width - 1, rect.y + rect.height - 1]
                        ];
                    }
                    if (data.debug) {
                        for (let i = 0; i < 4; i++) {
                            const realPoint1 = realPoints[i];
                            const realPoint2 = realPoints[(i + 1) % 4];
                            cv2.Imgproc.line(img, new cv2.Point(realPoint1[0], realPoint1[1]), new cv2.Point(realPoint2[0], realPoint2[1]), new cv2.Scalar(0, 0, 255), 2);
                        }
                    }
                } else if (data.boundType === 2) {
                    const floatPoint = new org.opencv.core.MatOfPoint2f();
                    cnt.convertTo(floatPoint, cv2.CvType.CV_32F);
                    const points = Array.create(org.opencv.core.Point, 4);
                    const rotrect = cv2.Imgproc.minAreaRect(floatPoint);
                    rotrect.points(points);
                    if (data.boundType === 2) {
                        realPoints = [
                            [points[2].x, points[2].y],
                            [points[1].x, points[1].y],
                            [points[0].x, points[0].y],
                            [points[3].x, points[3].y]
                        ];
                    }
                    if (data.debug) {
                        for (let i = 0; i < 4; i++) {
                            cv2.Imgproc.line(img, points[i], points[(i + 1) % 4], new cv2.Scalar(0, 0, 255), 2);
                        }
                    }
                } else if (data.boundType === 3) {
                    const floatPoint = new org.opencv.core.MatOfPoint2f();
                    cnt.convertTo(floatPoint, cv2.CvType.CV_32F);
                    const rotrect = cv2.Imgproc.minAreaRect(floatPoint);
                    const circleCenter = new cv2.Point();
                    const radius = Array.create('float', 1);
                    cv2.Imgproc.minEnclosingCircle(floatPoint, circleCenter, radius);
                    cv2.Imgproc.circle(img, circleCenter, radius[0], new cv2.Scalar(0, 255, 255), 2);
                    const npoints = cnt.toArray();
                    const nbPoints = npoints.length;
                    let points: cv2.Point[] = [];
                    for (let i = 0; i < nbPoints; i++) {
                        points[i] = npoints[i];
                    }
                    if (nbPoints > 4) {
                        const areapoints: cv2.Point[] = Array.create(org.opencv.core.Point, 4);
                        rotrect.points(areapoints);
                        let areapoint;
                        for (let i = 0; i < areapoints.length; i++) {
                            areapoint = areapoints[i];
                            if (Math.abs(cvnorm(areapoint, circleCenter) - radius[0]) > 3) {
                                const sortedDistances = Array.from(Array(points.length).keys()).sort((a, b) => cvnorm(points[a], points[b]));
                                points.splice(sortedDistances[0] + 1, 0, areapoint);
                            }
                        }
                        const npoints: cv2.Point[] = Array.create(org.opencv.core.Point, points.length);
                        points.forEach((p, i) => (npoints[i] = points[i]));
                        const newArrayPoints = new org.opencv.core.MatOfPoint2f(npoints);
                        cv2.Imgproc.minEnclosingCircle(newArrayPoints, circleCenter, radius);
                        let Ds = points.map((p, i) => Math.abs(cvnorm(circleCenter, p) - radius[0]) * (360 - (cvangle(p, circleCenter) - cvangle(points[(i + 1) % nbPoints], circleCenter))));
                        let sortedIndexes = Ds.map((s, i) => i).sort((a, b) => Ds[a] - Ds[b]);
                        points = sortedIndexes.slice(0, 4).map((i) => points[i]);
                        Ds = points.map((p) => cvangle(p, circleCenter));
                        sortedIndexes = Ds.map((s, i) => i).sort((a, b) => Ds[b] - Ds[a]);
                        points = sortedIndexes.map((i) => points[i]);
                        // points = order_cv_points(points);
                    }
                    // points = order_cv_points(points);
                    if (data.boundType === 3) {
                        realPoints = [
                            [points[3].x, points[3].y],
                            [points[0].x, points[0].y],
                            [points[1].x, points[1].y],
                            [points[2].x, points[2].y]
                        ];
                    }
                    if (data.debug) {
                        for (let i = 0; i < points.length; i++) {
                            cv2.Imgproc.line(img, points[i], points[(i + 1) % 4], new cv2.Scalar(0, 0, 255), 2);
                        }
                    }
                }
                page_contours.push(realPoints);
            }
        } else {
        }
        // cnt.release();
    }
    // release native objects
    for (let index = 0; index < contours.length; index++) {
        const contour = contours[index].contour;
        contour.release();
    }
    return page_contours;
}

// function norm(p1: [number, number], p2: [number, number]) {
//     const res = [p1[0] - p2[0], p1[1] - p2[1]];
//     return Math.sqrt(Math.pow(res[0], 2) + Math.pow(res[1], 2));
// }
function cvnorm(p1: cv2.Point, p2: cv2.Point) {
    const res = [p1.x - p2.x, p1.y - p2.y];
    return Math.sqrt(Math.pow(res[0], 2) + Math.pow(res[1], 2));
}

function cvangle(p1: cv2.Point, p2: cv2.Point) {
    const radian = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = radian * (180 / Math.PI) - 90;
    if (angle < 0.0) angle += 360.0;
    return angle;
}

// function order_points(pts: [number, number][]) {
//     if (pts.length === 0) {
//         return pts;
//     }
//     // sort the points based on their x-coordinates
//     const xSorted = pts.sort(function (a, b) {
//         return a[0] - b[0];
//     });

//     // grab the left-most and right-most points from the sorted
//     // x-roodinate points
//     let leftMost = xSorted.slice(0, 2);
//     const rightMost = xSorted.slice(-2);

//     // now, sort the left-most coordinates according to their
//     // y-coordinates so we can grab the top-left and bottom-left
//     // points, respectively
//     leftMost = leftMost.sort(function (a, b) {
//         return a[1] - b[1];
//     });
//     const [tl, bl] = leftMost;

//     // now that we have the top-left coordinate, use it as an
//     // anchor to calculate the Euclidean distance between the
//     // top-left and right-most points; by the Pythagorean
//     // theorem, the point with the largest distance will be
//     // our bottom-right point
//     const Ds = rightMost.map((p) => norm(tl, p));
//     const sortedIndexes = Ds.map((s, i) => i).sort(function (a, b) {
//         return Ds[a] - Ds[b];
//     });
//     const br = rightMost[sortedIndexes[1]];
//     const tr = rightMost[sortedIndexes[0]];
//     // return the coordinates in top-left, top-right,
//     // bottom-right, and bottom-left order
//     return [tl, tr, br, bl];
// }

// function order_cv_points(pts: cv2.Point[]) {
//     if (pts.length === 0) {
//         return pts;
//     }
//     // sort the points based on their x-coordinates
//     const xSorted = pts.sort((a, b) => a.x - b.x);
//     // console.log('xSorted', xSorted);

//     // grab the left-most and right-most points from the sorted
//     // x-roodinate points
//     let leftMost = xSorted.slice(0, 2);
//     const rightMost = xSorted.slice(-2);

//     // now, sort the left-most coordinates according to their
//     // y-coordinates so we can grab the top-left and bottom-left
//     // points, respectively
//     leftMost = leftMost.sort((a, b) => a.y - b.y);
//     const [tl, bl] = leftMost;

//     // now that we have the top-left coordinate, use it as an
//     // anchor to calculate the Euclidean distance between the
//     // top-left and right-most points; by the Pythagorean
//     // theorem, the point with the largest distance will be
//     // our bottom-right point
//     const Ds = rightMost.map((p) => cvnorm(tl, p));

//     const sortedIndexes = Ds.map((s, i) => i).sort((a, b) => Ds[b] - Ds[a]);

//     const br = rightMost[sortedIndexes[1]];
//     const tr = rightMost[sortedIndexes[0]];
//     // return the coordinates in top-left, top-right,
//     // bottom-right, and bottom-left order
//     return [tl, tr, br, bl];
// }

function matFromArray(rows, cols, type, array) {
    const mat = new cv2.Mat(rows, cols, type);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const nArray = Array.create('float', 1);
            nArray[0] = array[i][j];
            mat.put(i, j, nArray);
        }
    }
    return mat;
}
function getMassCenter(points: [number, number][]): [number, number] {
    let xSum = 0.0;
    let ySum = 0.0;
    const len = points.length;
    for (let index = 0; index < len; index++) {
        const point = points[index];
        xSum += point[0];
        ySum += point[1];
    }
    return [xSum / len, ySum / len];
}

function getMinPointIndex(point1, point2, index) {
    if (point1[index] < point2[index]) {
        return point1;
    }
    return point2;
}
function sortCorners(points: [number, number][]): [number, number][] {
    let diagonal = 0;
    let diagonal1Point1 = null;
    let diagonal1Point2 = null;
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const d = getDistance(points[i], points[j]);
            if (d > diagonal) {
                diagonal = d;
                diagonal1Point1 = points[i];
                diagonal1Point2 = points[j];
            }
        }
    }
    const difference = points.filter((x) => x !== diagonal1Point1 && x !== diagonal1Point2);
    const diagonal2Point1 = difference[0];
    const diagonal2Point2 = difference[1];
    const tops = [getMinPointIndex(diagonal1Point1, diagonal1Point2, 1), getMinPointIndex(diagonal2Point1, diagonal2Point2, 1)];
    const bottoms = points.filter((x) => tops.indexOf(x) === -1);
    const topLeft = getMinPointIndex(tops[0], tops[1], 0);
    const bottomLeft = getMinPointIndex(bottoms[0], bottoms[1], 0);

    return [topLeft, tops[0] === topLeft ? tops[1] : tops[0], bottoms[0] === bottomLeft ? bottoms[1] : bottoms[0], bottomLeft];
}

function linearDiff(array) {
    const result = [];
    for (let index = 0; index < array.length; index++) {
        result[index] = result[index + 1] - result[index];
    }
    return result;
}
function four_corners_sort(pts: [number, number][]) {
    let minDiffCurrent = Number.MAX_SAFE_INTEGER;
    let minDiffCurrentIndex = 0;
    let maxDiffCurrent = 0;
    let maxDiffCurrentIndex = 0;
    let minSumCurrent = Number.MAX_SAFE_INTEGER;
    let minSumCurrentIndex = 0;
    let maxSumCurrent = 0;
    let maxSumCurrentIndex = 0;
    let p, diff, sum;
    for (let index = 0; index < pts.length; index++) {
        p = pts[index];
        diff = p[1] - p[0];
        sum = p[1] + p[0];
        if (diff < minDiffCurrent) {
            minDiffCurrent = diff;
            minDiffCurrentIndex = index;
        } else if (diff > maxDiffCurrent) {
            maxDiffCurrent = diff;
            maxDiffCurrentIndex = index;
        }
        if (sum < minSumCurrent) {
            minSumCurrent = sum;
            minSumCurrentIndex = index;
        } else if (sum > maxSumCurrent) {
            maxSumCurrent = sum;
            maxSumCurrentIndex = index;
        }
    }
    return [pts[minSumCurrentIndex], pts[minDiffCurrentIndex], pts[maxSumCurrentIndex], pts[maxDiffCurrentIndex]];
}

function nanmin(array) {
    return Math.min(...array.filter((n) => !isNaN(n)));
}

function nanmax(array) {
    return Math.max(...array.filter((n) => !isNaN(n)));
}

const mmultiply = (a, b) => a.map((x) => transpose(b).map((y) => dotproduct(x, y)));
const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
const transpose = (a) => a[0].map((x, i) => a.map((y) => y[i]));
function matrixDot(A, B) {
    const result = new Array(A.length).fill(0).map((row) => new Array(B[0].length).fill(0));
    return result.map((row, i) => row.map((val, j) => A[i].reduce((sum, elm, k) => sum + elm * B[k][j], 0)));
}
const PI_2 = Math.PI / 2;

function minBoundingRect(hull_points_2d) {
    // console.log('minBoundingRect', hull_points_2d);
    // Compute edges (x2-x1,y2-y1)
    const edges = [];
    let edge_x, edge_y;
    for (let i = 0; i < hull_points_2d.length - 1; i++) {
        edge_x = hull_points_2d[i + 1][0] - hull_points_2d[i][0];
        edge_y = hull_points_2d[i + 1][1] - hull_points_2d[i][1];
        edges[i] = [edge_x, edge_y];
    }
    //print "Edges: \n", edges
    // console.log('Edges', edges);

    // Calculate edge angles   atan2(y/x)
    let edge_angles = [];
    for (let i = 0; i < edges.length; i++) {
        edge_angles[i] = Math.atan2(edges[i][1], edges[i][0]);
    }
    // console.log('Edges angles1', edge_angles);
    //print "Edge angles: \n", edge_angles

    // Check for angles in 1st quadrant
    for (let i = 0; i < edge_angles.length; i++) {
        edge_angles[i] = Math.abs(edge_angles[i] % PI_2); // want strictly positive answers
    }
    //print "Edge angles in 1st Quadrant: \n", edge_angles

    // Remove duplicate angles
    edge_angles = [...new Set(edge_angles)];
    //print "Unique edge angles: \n", edge_angles
    // console.log('Unique Edges angles', edge_angles);

    // Test each angle to find bounding box with smallest area
    let min_bbox = [0, Number.MAX_SAFE_INTEGER, 0, 0, 0, 0, 0, 0]; // rot_angle, area, width, height, min_x, max_x, min_y, max_y
    // print('Testing', edge_angles.length, 'possible rotations for bounding box... \n');

    let R, rot_points, min_x, max_x, min_y, max_y, area, width, height;
    for (let i = 0; i < edge_angles.length; i++) {
        // Create rotation matrix to shift points to baseline
        // R = [ cos(theta)      , cos(theta-PI/2)
        //       cos(theta+PI/2) , cos(theta)     ]
        R = [
            [Math.cos(edge_angles[i]), Math.cos(edge_angles[i] - PI_2)],
            [Math.cos(edge_angles[i] + PI_2), Math.cos(edge_angles[i])]
        ];
        //print "Rotation matrix for ", edge_angles[i], " is \n", R
        // console.log('Rotation matrix for', edge_angles[i], R);

        // Apply this rotation to convex hull points
        rot_points = matrixDot(R, transpose(hull_points_2d)); // 2x2 * 2xn
        //print "Rotated hull points are \n", rot_points
        // console.log('rotated hull points are', rot_points);

        // Find min/max x,y points
        min_x = nanmin(rot_points[0]);
        max_x = nanmax(rot_points[0]);
        min_y = nanmin(rot_points[1]);
        max_y = nanmax(rot_points[1]);
        // console.log('Min x:', min_x, ' Max x: ', max_x, '   Min y:', min_y, ' Max y: ', max_y);
        //print "Min x:", min_x, " Max x: ", max_x, "   Min y:", min_y, " Max y: ", max_y

        // Calculate height/width/area of this bounding rectangle
        width = max_x - min_x;
        height = max_y - min_y;
        area = width * height;
        //print "Potential bounding box ", i, ":  width: ", width, " height: ", height, "  area: ", area
        // console.log('Potential bounding box ', i, ':  width: ', width, ' height: ', height, '  area: ', area);

        // Store the smallest rect found first (a simple convex hull might have 2 answers with same area)
        if (area < min_bbox[1]) {
            min_bbox = [edge_angles[i], area, width, height, min_x, max_x, min_y, max_y];
        }
        // Bypass, return the last found rect
        //min_bbox = ( edge_angles[i], area, width, height, min_x, max_x, min_y, max_y )
    }
    // Re-create rotation matrix for smallest rect
    const angle = min_bbox[0];
    R = [
        [Math.cos(angle), Math.cos(angle - PI_2)],
        [Math.cos(angle + PI_2), Math.cos(angle)]
    ];
    //print "Projection matrix: \n", R

    // Project convex hull points onto rotated frame
    // const proj_points = dotproduct(R, transpose(hull_points_2d)); // 2x2 * 2xn
    //print "Project hull points are \n", proj_points

    // min/max x,y points are against baseline
    min_x = min_bbox[4];
    max_x = min_bbox[5];
    min_y = min_bbox[6];
    max_y = min_bbox[7];
    // console.log('Min x:', min_x, ' Max x: ', max_x, '   Min y:', min_y, ' Max y: ', max_y);
    //print "Min x:", min_x, " Max x: ", max_x, "   Min y:", min_y, " Max y: ", max_y

    // Calculate center point and project onto rotated frame
    // const center_x = (min_x + max_x) / 2;
    // const center_y = (min_y + max_y) / 2;
    // const center_point = dotproduct([center_x, center_y], R);
    //print "Bounding box center point: \n", center_point

    // Calculate corner points and project onto rotated frame
    const corner_points = []; // empty 2 column array
    corner_points[0] = matrixDot([[max_x, min_y]], R)[0];
    corner_points[1] = matrixDot([[min_x, min_y]], R)[0];
    corner_points[2] = matrixDot([[min_x, max_y]], R)[0];
    corner_points[3] = matrixDot([[max_x, max_y]], R)[0];
    // print('Bounding box corner points: \n', corner_points);
    // console.log('Bounding box corner points', corner_points);

    //print "Angle of rotation: ", angle, "rad  ", angle * (180/math.pi), "deg"

    //rot_angle, area, width, height, center_point, corner_points
    return corner_points;
}

function getDistance(p1: [number, number], p2: [number, number]) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
}
function getRectangleSize(corners: [number, number][]): cv2.Size {
    const top = getDistance(corners[0], corners[1]);
    const right = getDistance(corners[1], corners[2]);
    const bottom = getDistance(corners[2], corners[3]);
    const left = getDistance(corners[3], corners[0]);
    const averageWidth = (top + bottom) / 2;
    const averageHeight = (right + left) / 2;
    return new cv2.Size(averageWidth, averageHeight);
}

function getOutline(size: cv2.Size): cv2.Mat {
    const topLeft = [0, 0];
    const topRight = [size.width, 0];
    const bottomRight = [size.width, size.height];
    const bottomLeft = [0, size.height];
    const points = [topLeft, topRight, bottomRight, bottomLeft];
    return matFromArray(points.length, 2, cv2.CvType.CV_32F, points);
}
export function persp_transform(img: cv2.Mat, s_points: [number, number][], ratio: number = 1) {
    let sortedCorners = sortCorners(s_points);
    if (ratio !== 1) {
        sortedCorners = sortedCorners.map((p) => [Math.round(p[0] * ratio), Math.round(p[1] * ratio)]);
    }
    const size = getRectangleSize(sortedCorners);
    const result = new cv2.Mat();
    const imageOutline = getOutline(size);
    const transformation = cv2.Imgproc.getPerspectiveTransform(matFromArray(sortedCorners.length, 2, cv2.CvType.CV_32F, sortedCorners), imageOutline);
    cv2.Imgproc.warpPerspective(img, result, transformation, size);
    cv2.Imgproc.cvtColor(result, result, cv2.Imgproc.COLOR_RGBA2RGB);
    return result;
}

// export function persp_transform(img: cv2.Mat, s_points: [number, number][], ratio: number = 1) {
//     // s_points = sortCorners(s_points);
//     if (ratio !== 1) {
//         s_points = s_points.map((p) => [Math.round(p[0] * ratio), Math.round(p[1] * ratio)]);
//     }
//     const sMat = matFromArray(s_points.length, 2, cv2.CvType.CV_32F, s_points);
//     // Euclidean distance - calculate maximum height and width
//     const [tl, tr, br, bl] = s_points;

//     //  compute the width of the new image, which will be the
//     //  maximum distance between bottom-right and bottom-left
//     //  x-coordiates or the top-right and top-left x-coordinates
//     const widthA = Math.sqrt((br[0] - bl[0]) ** 2 + (br[1] - bl[1]) ** 2);
//     const widthB = Math.sqrt((tr[0] - tl[0]) ** 2 + (tr[1] - tl[1]) ** 2);
//     const maxWidth = Math.max(Math.round(widthA), Math.round(widthB));

//     //  compute the height of the new image, which will be the
//     //  maximum distance between the top-right and bottom-right
//     //  y-coordinates or the top-left and bottom-left y-coordinates
//     const heightA = Math.sqrt((tr[0] - br[0]) ** 2 + (tr[1] - br[1]) ** 2);
//     const heightB = Math.sqrt((tl[0] - bl[0]) ** 2 + (tl[1] - bl[1]) ** 2);
//     const maxHeight = Math.max(Math.round(heightA), Math.round(heightB));
//     // Create target points
//     const t_points = [
//         [0, 0],
//         [maxWidth - 1, 0],
//         [maxWidth - 1, maxHeight - 1],
//         [0, maxHeight - 1]
//     ];
//     const tMat = matFromArray(t_points.length, 2, cv2.CvType.CV_32F, t_points);

//     const M = cv2.Imgproc.getPerspectiveTransform(sMat, tMat);
//     const out = new cv2.Mat();
//     cv2.Imgproc.warpPerspective(img, out, M, new cv2.Size(maxWidth, maxHeight));
//     // cv2.Imgproc.cvtColor(out, out, cv2.Imgproc.COLOR_RGBA2RGB);
//     return out;
// }

let kernel9: cv2.Mat;
let kernel2: cv2.Mat;
let kernel1: cv2.Mat;
let kernel3: cv2.Mat;
let kernel4: cv2.Mat;
let gray: cv2.Mat;

function apply_brightness_contrast(input_img, buf, brightness = 0, contrast = 0) {
    if (brightness !== 0) {
        let shadow, highlight;
        if (brightness > 0) {
            shadow = brightness;
            highlight = 255;
        } else {
            shadow = 0;
            highlight = 255 + brightness;
        }
        const alpha_b = (highlight - shadow) / 255;
        const gamma_b = shadow;

        cv2.Core.addWeighted(input_img, alpha_b, input_img, 0, gamma_b, buf);
    }
    if (contrast !== 0) {
        const f = (131 * (contrast + 127)) / (127 * (131 - contrast));
        const alpha_c = f;
        const gamma_c = 127 * (1 - f);

        cv2.Core.addWeighted(buf, alpha_c, buf, 0, gamma_c, buf);
    }
    return buf;
}

function edges_det(img: cv2.Mat, out, data: ImageWorkerOptions, hardTest = false) {
    // if (full) {
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
    switch (data.algo) {
        case 0:
            cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            // cv2.Imgproc.bilateralFilter(img, out, 7, 50, 50);
            if (!kernel9) {
                kernel9 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(9, 9));
            }
            cv2.Imgproc.morphologyEx(out, out, cv2.Imgproc.MORPH_CLOSE, kernel9);

            cv2.Imgproc.Canny(out, out, 0, 84);
            if (!kernel3) {
                kernel3 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(3, 3));
            }
            cv2.Imgproc.dilate(out, out, kernel3);
            break;
        case 1:
            cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            if (!kernel2) {
                kernel2 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(9, 9));
            }
            cv2.Imgproc.dilate(out, out, kernel2);
            cv2.Imgproc.Canny(out, out, 0, 84);
            break;
        case 2:
            cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            cv2.Imgproc.Canny(out, out, 0, 84);
            break;
        case 3:
            cv2.Imgproc.bilateralFilter(img, out, 9, 75, 75);

            cv2.Imgproc.adaptiveThreshold(out, out, 255, cv2.Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.Imgproc.THRESH_BINARY, 115, 4);
            cv2.Imgproc.medianBlur(out, out, 11);
            cv2.Core.copyMakeBorder(out, out, 5, 5, 5, 5, cv2.Core.BORDER_CONSTANT, new cv2.Scalar(0, 0, 0));
            cv2.Imgproc.Canny(out, out, 200, 250);
            break;
        case 4:
            cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(5, 5), 0);
            // apply_brightness_contrast(out, out, -64, 64);
            cv2.Imgproc.Canny(out, out, 75, 200);
            if (!kernel3) {
                kernel3 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(3, 3));
            }
            cv2.Imgproc.dilate(out, out, kernel3);
            break;
        case 5:
            // cv2.Imgproc.blur(img, out, new cv2.Size(3, 3));
            cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            // cv2.Core.normalize(out, out, 0, 255, cv2.Core.NORM_MINMAX);
            // cv2.Imgproc.threshold(out, out, 150, 255, cv2.Imgproc.THRESH_TRUNC);
            // cv2.Core.normalize(out, out, 0, 255, cv2.Core.NORM_MINMAX);
            // apply_brightness_contrast(out, out, -64, 64);
            cv2.Imgproc.Canny(out, out, 0, 85);
            cv2.Imgproc.threshold(out, out, 155, 255, cv2.Imgproc.THRESH_TOZERO);
            // const kernel9 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_ELLIPSE, new cv2.Size(9, 9));
            // cv2.Imgproc.morphologyEx(out, out, cv2.Imgproc.MORPH_CLOSE, kernel9);
            cv2.Imgproc.morphologyEx(out, out, cv2.Imgproc.MORPH_CLOSE, new cv2.Mat(new cv2.Size(10, 10), cv2.CvType.CV_8UC1, new cv2.Scalar(255)), new cv2.Point(-1.0, -1.0), 1);
            if (!kernel3) {
                kernel3 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(3, 3));
            }
            cv2.Imgproc.dilate(out, out, kernel3);
            break;
        case 6:
            if (data.contrast && data.contrast !== 1) {
                img.convertTo(out, -1, data.contrast, 0);
                cv2.Imgproc.GaussianBlur(out, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            } else {
                cv2.Imgproc.GaussianBlur(img, out, new cv2.Size(data.blurSize, data.blurSize), 0);
            }

            if (hardTest) {
                if (!kernel4) {
                    kernel4 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(4, 4));
                }
                out = cv2.Imgproc.morphologyEx(out, out, cv2.Imgproc.MORPH_RECT, kernel4);
                cv2.Imgproc.Canny(out, out, 200, 200);
            } else {
                cv2.Imgproc.Canny(out, out, 75, 200);
            }
            if (!kernel1) {
                kernel1 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_RECT, new cv2.Size(2, 2));
            }
            cv2.Imgproc.dilate(out, out, kernel1);
            break;
    }
    // }

    return out;
}
function resizeIfNeeded(image, data) {
    const size = image.size();
    const w = size.width;
    const h = size.height;
    const wantedHeight = data.full ? FULL_HEIGHT : SMALL_HEIGHT;

    if (h > wantedHeight) {
        if (!resizedImage) {
            resizedImage = new cv2.Mat();
        }
        resize(image, resizedImage, wantedHeight);
    } else {
        resizedImage = image.clone();
    }
    return resizedImage;
}
export function findDocuments(image: cv2.Mat, data: ImageWorkerOptions) {
    if (!edgesImage) {
        edgesImage = new cv2.Mat();
    }
    resizedImage = resizeIfNeeded(image, data);
    edges_det(resizedImage, edgesImage, data);
    let contours = find_page_contours(edgesImage, resizedImage, data);
    if (!contours) {
        resizedImage = resizeIfNeeded(image, data);
        edges_det(resizedImage, edgesImage, data);
        contours = find_page_contours(edgesImage, resizedImage, data);
    }
    if (!contours) {
        return null;
    }
    return { edgesImage, resizedImage, contours };
}

// The angle is calculated by Hough transform
let midImage: cv2.Mat, dstImage: cv2.Mat;
export function calculateTextRotation(img: cv2.Mat, dst?: cv2.Mat) {
    if (!midImage) {
        midImage = new cv2.Mat();
    }
    // edges_det(img, dst);
    const size = img.size();
    const w = size.width;
    const h = size.height;
    const ratio = resize(img, midImage, 600, true);
    const crop = 30;
    // midImage = midImage.submat(new org.opencv.core.Rect(30, 30, midImage.size().width - 60, midImage.size().height - 60));
    midImage = new cv2.Mat(midImage, new org.opencv.core.Rect(crop, crop, midImage.size().width - 2 * crop, midImage.size().height - 2 * crop));

    // if (midImage.channels() === 4) {
    //     cv2.Imgproc.cvtColor(midImage, midImage, cv2.Imgproc.COLOR_RGBA2GRAY);
    // } else if (midImage.channels() === 3) {
    //     cv2.Imgproc.cvtColor(midImage, midImage, cv2.Imgproc.COLOR_RGB2GRAY);
    // }

    apply_brightness_contrast(midImage, midImage, -64, 80);

    // const sharpen = new cv2.Mat();
    // cv2.Imgproc.GaussianBlur(midImage, sharpen, new cv2.Size(0, 0), 3);
    // cv2.Core.addWeighted(midImage, 1.5, sharpen, -0.5, 0, midImage);
    // cv2.Imgproc.GaussianBlur(midImage, dst, new cv2.Size(5, 5), 0);
    cv2.Imgproc.GaussianBlur(midImage, midImage, new cv2.Size(9, 9), 0);
    // cv2.Imgproc.medianBlur(midImage, midImage, 11);
    // cv2.Imgproc.Canny(midImage, dst, 0, 20);
    cv2.Imgproc.Canny(midImage, midImage, 75, 200);
    const kernel9 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_ELLIPSE, new cv2.Size(9, 9));
    // cv2.Imgproc.morphologyEx(midImage, dst, cv2.Imgproc.MORPH_CLOSE, kernel9);
    cv2.Imgproc.morphologyEx(midImage, midImage, cv2.Imgproc.MORPH_CLOSE, kernel9);
    // kernel9 = cv2.Imgproc.getStructuringElement(cv2.Imgproc.MORPH_ERODE, new cv2.Size(9,9));
    // cv2.Imgproc.erode(midImage, dst, kernel9);
    cv2.Imgproc.erode(midImage, midImage, kernel9);

    // Line detection by Hough transform
    const lines = new cv2.Mat();
    cv2.Imgproc.HoughLinesP(midImage, lines, 1, Math.PI / 180, 20, 0, 40); // the fifth parameter is the threshold. The larger the threshold, the higher the detection accuracy
    const length = lines.rows();
    let sum = 0;
    // Draw each line in turn
    for (let i = 0; i < length; i++) {
        const points = lines.get(i, 0);
        // console.log('test line', points.length);

        const x1 = (points[0] + crop) / ratio;
        const y1 = (points[1] + crop) / ratio;
        const x2 = (points[2] + crop) / ratio;
        const y2 = (points[3] + crop) / ratio;
        if (x1 <= 10 || x1 >= w - 10 || x2 <= 10 || x2 >= w - 10 || y1 <= 10 || y1 >= h - 10 || y2 <= 10 || y2 >= h - 10) {
            continue;
        }

        const pt1 = new cv2.Point(x1, y1);
        const pt2 = new cv2.Point(x2, y2);
        sum += Math.atan2(y1 - y2, x1 - x2);
        // Drawing lines on an image
        if (dst) {
            cv2.Imgproc.line(dst, pt1, pt2, new cv2.Scalar(0, 255, 0), 2); // scalar function is used to adjust line segment color
        }
    }

    if (length > 0) {
        const average = sum / length; // average all angles so that the rotation effect is better
        return Math.round(((average / Math.PI) * 180) / 90) * 90;
    }

    return 0;
}

export function toBlackAndWhite(img: cv2.Mat, dest: cv2.Mat) {
    if (img.channels() === 4) {
        cv2.Imgproc.cvtColor(img, dest, cv2.Imgproc.COLOR_RGBA2GRAY);
    } else if (img.channels() === 3) {
        cv2.Imgproc.cvtColor(img, dest, cv2.Imgproc.COLOR_RGB2GRAY);
    }
    // apply adaptive threshold to get black and white effect
    cv2.Imgproc.threshold(dest, dest, 127, 255, cv2.Imgproc.THRESH_BINARY);
    cv2.Imgproc.adaptiveThreshold(dest, dest, 255, cv2.Imgproc.ADAPTIVE_THRESH_MEAN_C, cv2.Imgproc.THRESH_BINARY, 11, 12);
}
