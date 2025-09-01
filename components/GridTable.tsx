"use client";
import clsx from "clsx";
import type { Match } from "../lib/find2x2";

export default function GridTable({
    grid,
    match,
}: {
    grid: number[][];
    match?: Match;
}) {
    return (
        <div className="card overflow-auto">
            <table className="mx-auto border-separate border-spacing-1">
                <tbody>
                    {grid.map((row, i) => (
                        <tr key={i}>
                            {row.map((v, j) => {
                                const inSel =
                                    match &&
                                    ((i === match.i && j === match.j) ||
                                        (i === match.i && j === match.j + 1) ||
                                        (i === match.i + 1 && j === match.j) ||
                                        (i === match.i + 1 &&
                                            j === match.j + 1));
                                return (
                                    <td key={j}>
                                        <div
                                            className={clsx(
                                                "grid-cell",
                                                inSel && "highlight"
                                            )}
                                        >
                                            {v}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
