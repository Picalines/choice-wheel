export function randomRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export function clamp(x: number, min: number, max: number) {
    return Math.min(max, Math.max(min, x));
}

export function lerp(x: number, a: number, b: number) {
    x = clamp(x, 0, 1);
    return a * (1 - x) + b * x;
}
