"use client";
import { useCallback, useState } from "react";
import Tesseract from "tesseract.js";
import { parseTextGrid } from "../lib/parseTextGrid";

type Props = { onGrid: (grid: number[][], raw?: string) => void };

export default function DropZone({ onGrid }: Props) {
    const [busy, setBusy] = useState(false);
    const [hint, setHint] = useState<string | null>(null);

    const onDrop = useCallback(
        async (file: File) => {
            setBusy(true);
            setHint(null);
            try {
                if (
                    file.type.startsWith("text/") ||
                    /\.(txt|csv)$/i.test(file.name)
                ) {
                    const text = await file.text();
                    onGrid(parseTextGrid(text), text);
                    setHint("TXT/CSV разобран");
                } else if (file.type.startsWith("image/")) {
                    const { data } = await Tesseract.recognize(file, "eng", {
                        // @ts-expect-error
                        tessedit_char_whitelist: "0123456789 ",
                        preserve_interword_spaces: "1",
                    });
                    onGrid(parseTextGrid(data.text), data.text);
                    setHint("OCR готов");
                } else {
                    setHint("Формат не поддержан. Кинь TXT/CSV/PNG/JPG");
                }
            } catch (e) {
                console.error(e);
                setHint("Ошибка распознавания/парсинга");
            } finally {
                setBusy(false);
            }
        },
        [onGrid]
    );

    const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) onDrop(f);
    };

    const onDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDropEvt = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const f = e.dataTransfer.files?.[0];
        if (f) onDrop(f);
    };

    return (
        <div className="card">
            <div
                onDragEnter={onDrag}
                onDragOver={onDrag}
                onDrop={onDropEvt}
                className="border border-white/15 rounded-2xl p-6 text-center cursor-pointer hover:border-white/30"
            >
                <input
                    type="file"
                    className="hidden"
                    id="file-input"
                    onChange={handle}
                />
                <label htmlFor="file-input" className="btn">
                    {busy ? "Обработка…" : "Кинь файл сюда или выбери"}
                </label>
                <div className="opacity-80 text-sm mt-2">TXT/CSV/PNG/JPG</div>
                {hint && (
                    <div className="mt-2 text-emerald-300 text-sm">{hint}</div>
                )}
            </div>
        </div>
    );
}
