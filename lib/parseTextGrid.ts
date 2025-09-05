export function parseTextGrid(text: string): number[][] {
    const lines = text
        .replace(/[^\d\n\r ]+/g, " ")
        .split(/\r?\n+/)
        .map((l) => l.trim())
        .filter(Boolean);

    const rows: number[][] = lines.map((line) => {
        const tokens = line.match(/\d/g) ?? [];
        return tokens.map((t) => Number(t));
    });

    const minW = Math.min(...rows.map((r) => r.length));
    return rows.map((r) => r.slice(0, minW));
}
