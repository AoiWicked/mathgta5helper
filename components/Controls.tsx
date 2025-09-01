"use client";
import { useEffect, useMemo, useState } from "react";
import { findAll2x2, Match } from "../lib/find2x2";
import { asBracketTable } from "../lib/copyWithBrackets";

export default function Controls({
    grid,
    onMatch,
}: {
    grid: number[][];
    onMatch: (m?: Match) => void;
}) {
    const [target, setTarget] = useState(15);
    const matches = useMemo(() => findAll2x2(grid, target), [grid, target]);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        setIdx(0);
        onMatch(matches[0]);
    }, [matches.length]);

    const copy = async () => {
        const txt = asBracketTable(grid, matches[idx]);
        await navigator.clipboard.writeText(txt);
    };

    return (
        <div className="card flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2">
                Сумма 2×2:
                <input
                    className="input w-20"
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(+e.target.value || 0)}
                />
            </label>
            <div className="opacity-80">Найдено: {matches.length}</div>
            <button
                className="btn"
                disabled={!matches.length}
                onClick={() => {
                    const n = (idx + 1) % Math.max(1, matches.length);
                    setIdx(n);
                    onMatch(matches[n]);
                }}
            >
                Следующий
            </button>
            <button className="btn" disabled={!matches.length} onClick={copy}>
                Копировать как текст
            </button>
        </div>
    );
}
