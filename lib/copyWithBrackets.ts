import type { Match } from "./find2x2";


export function asBracketTable(grid: number[][], match?: Match): string {
const R = grid.length, C = grid[0]?.length ?? 0;
return grid.map((row, i) => row.map((v, j) => {
const inSel = match && (
(i === match.i && j === match.j) ||
(i === match.i && j === match.j+1) ||
(i === match.i+1 && j === match.j) ||
(i === match.i+1 && j === match.j+1)
);
return inSel ? `(${v})` : String(v);
}).join(" ")).join("\n");
}