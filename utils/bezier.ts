/**
 * Creates a cubic Bezier easing function
 * @param x1 - X coordinate of first control point (0-1)
 * @param y1 - Y coordinate of first control point
 * @param x2 - X coordinate of second control point (0-1)
 * @param y2 - Y coordinate of second control point
 * @param epsilon - Precision threshold for calculations (default: 1e-6)
 * @returns A function that takes a time value (0-1) and returns the eased value
 */
export const bezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  epsilon: number = 1e-6
): ((t: number) => number) => {
  const curveX = (t: number): number => {
    const v = 1 - t;
    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
  };

  const curveY = (t: number): number => {
    const v = 1 - t;
    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
  };

  const derivativeCurveX = (t: number): number => {
    const v = 1 - t;
    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
  };

  return (t: number): number => {
    let x = t,
      t0: number,
      t1: number,
      t2: number,
      x2: number,
      d2: number,
      i: number;

    for (t2 = x, i = 0; i < 8; i++) {
      x2 = curveX(t2) - x;
      if (Math.abs(x2) < epsilon) return curveY(t2);
      d2 = derivativeCurveX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }

    ((t0 = 0), (t1 = 1), (t2 = x));

    if (t2 < t0) return curveY(t0);
    if (t2 > t1) return curveY(t1);

    while (t0 < t1) {
      x2 = curveX(t2);
      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return curveY(t2);
  };
};
