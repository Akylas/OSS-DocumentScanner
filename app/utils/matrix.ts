import ColorMatrices from './color_matrix';

// export const IMAGE_FILTERS = {
//     grayscale: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
//     bw: (value = 1) => [value, value, value, -1, 0, value, value, value, -1, 0, value, value, value, -1, 0, 0, 0, 0, 1, 0],
//     nightVision: [0.1, 0.4, 0, 0, 0, 0.3, 1, 0.3, 0, 0, 0, 0.4, 0.1, 0, 0, 0, 0, 0, 1, 0],
//     polaroid: [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0]
// };

const sortPriority = ['normal', 'grayscale', 'bw', 'sepia', 'invert', 'polaroid', 'nightvision'];
export const ColorMatricesTypes = Object.keys(ColorMatrices)
    .sort((a, b) => {
        const sortIndexA = sortPriority.indexOf(a);
        const sortIndexB = sortPriority.indexOf(b);
        if (sortIndexA !== -1) {
            if (sortIndexB !== -1) {
                return sortIndexA - sortIndexB;
            }
            return -1;
        } else if (sortIndexB !== -1) {
            return 1;
        }
        return a.localeCompare(b);
    })
    .map((k) => ({
        id: k,
        ...ColorMatrices[k]
    }));
export type ColorMatricesType = string;

export function getColorMatrix(type: string, ...args): number[] {
    return ColorMatrices[type]?.fn?.apply(ColorMatrices, args) ?? null;
}
