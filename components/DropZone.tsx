"use client";
import { useCallback, useState, useEffect } from "react";
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
                    const opts = {
                        tessedit_char_whitelist: "0123456789 ",
                        preserve_interword_spaces: "1",
                    } as unknown as Partial<
                        import("tesseract.js").WorkerOptions
                    >;

                    const { data } = await Tesseract.recognize(
                        file,
                        "eng",
                        opts
                    );
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

    // ⬇️ Вставка из буфера обмена (Ctrl+V): изображение или текстовая таблица
    useEffect(() => {
        const onPaste = async (e: ClipboardEvent) => {
            const dt = e.clipboardData;
            if (!dt) return;

            // 1) Если есть картинка в буфере — обрабатываем как файл
            const items = Array.from(dt.items || []);
            const imgItem = items.find(
                (it) => it.kind === "file" && it.type.startsWith("image/")
            );
            if (imgItem) {
                const f = imgItem.getAsFile();
                if (f) {
                    e.preventDefault();
                    await onDrop(f);
                    setHint("Скрин из буфера обработан");
                }
                return;
            }

            // 2) Иначе пробуем текст
            const text = dt.getData("text/plain");
            if (text && /\d/.test(text)) {
                e.preventDefault();
                setBusy(true);
                setHint(null);
                try {
                    onGrid(parseTextGrid(text), text);
                    setHint("Таблица из буфера обработана");
                } catch (err) {
                    console.error(err);
                    setHint("Ошибка парсинга текста из буфера");
                } finally {
                    setBusy(false);
                }
            }
        };

        window.addEventListener("paste", onPaste);
        return () => window.removeEventListener("paste", onPaste);
    }, [onDrop, onGrid]);

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
                title="Кликни сюда и нажми Ctrl+V — можно вставлять скрин/таблицу"
            >
                <input
                    type="file"
                    className="hidden"
                    id="file-input"
                    onChange={handle}
                />
                <label htmlFor="file-input" className="btn">
                    {busy
                        ? "Обработка…"
                        : "Кинь файл сюда, выбери или нажми Ctrl+V"}
                </label>
                <div className="opacity-80 text-sm mt-2">
                    TXT/CSV/PNG/JPG • поддерживается вставка из буфера
                </div>
                {hint && (
                    <div className="mt-2 text-emerald-300 text-sm">{hint}</div>
                )}
            </div>
        </div>
    );
}
