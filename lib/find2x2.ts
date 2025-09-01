export type Match = { i: number; j: number };


export function findAll2x2(grid: number[][], target: number): Match[] {
const res: Match[] = [];
const R = grid.length; if (!R) return res; const C = grid[0].length;
for (let i = 0; i < R - 1; i++) {
for (let j = 0; j < C - 1; j++) {
const s = grid[i][j] + grid[i][j+1] + grid[i+1][j] + grid[i+1][j+1];
if (s === target) res.push({ i, j });
}
}
return res;
}