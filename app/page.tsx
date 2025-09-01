"use client";
import { useState } from "react";
import DropZone from "../components/DropZone";
import GridTable from "../components/GridTable";
import Controls from "../components/Controls";
import type { Match } from "../lib/find2x2";

export default function Page() {
    const [grid, setGrid] = useState<number[][]>([]);
    const [match, setMatch] = useState<Match | undefined>(undefined);

    return (
        <main className="space-y-4">
            <h1 className="text-2xl font-bold">2×2 Finder</h1>
            <DropZone
                onGrid={(g) => {
                    setGrid(g);
                    setMatch(undefined);
                }}
            />
            {grid.length > 0 && (
                <>
                    <Controls grid={grid} onMatch={setMatch} />
                    <GridTable grid={grid} match={match} />
                </>
            )}
        </main>
    );
}
