/** The cost for orthogonals directions in A*. */
export const D = 1;

/** The cost for diagonals directions in A*. */
export const D2 = Math.sqrt(2);

/** Orthogonal directions. */
export const ORTHOG = [[0, -1], [0, 1], [-1, 0], [1, 0]];

/** Diagonal directions. */
export const DIAG = [[-1, -1], [1, -1], [-1, 1], [1, 1]];