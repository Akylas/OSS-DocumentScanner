/**
 * Simplifies a set of input poitns with the ramer-douglas-peucker algorithm.
 * @param	{Vector[]}	points	The list of points to simplify.
 * @param	{number}	epsilon	The amount of simplification to perform.
 * @return	{Vector[]}	The simplfied line.
 */
function simplify_line(points, nb_points) {
    // We need 3+ points to use this algorithm!
    if (points.length < 3) {
        return points;
    }

    points = points.slice(); // Shallow clone the array

    // eslint-disable-next-line no-constant-condition
    while (true) {
        let smallest_area = Number.MAX_SAFE_INTEGER,
            smallest_area_i = 1;

        for (let i = 1; i < points.length - 1; i++) {
            const next_area = triangle_area(points[i - 1], points[i], points[i + 1]);
            if (next_area < smallest_area) {
                smallest_area = next_area;
                smallest_area_i = i;
            }
        }

        if (points.length <= nb_points) {
            break;
        }

        // Remove the central point of the smallest triangle
        points.splice(smallest_area_i, 1);
    }

    return points;
}

/**
 * Calculates the area of a triangle with the vertices a, b, and c
 * @param  {Vector} a The first vertex of the triangle.
 * @param  {Vector} b The second vertex of the triangle.
 * @param  {Vector} c The third and final vertex of the triangle.
 * @return {number}   The area of the triangle.
 */
function triangle_area(a, b, c) {
    return Math.abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2);
}

export { simplify_line };
