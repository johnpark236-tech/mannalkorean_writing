import React, { useState, useEffect } from "react";
import { KoreanLevel } from "../types";
import {
  Grid,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Sliders,
} from "lucide-react";

interface ManuscriptEditorProps {
  initialText: string;
  topic: string;
  level: KoreanLevel;
  writingType?: string;
  minChars?: number;
  maxChars?: number;
  onSubmitForFeedback: (text: string) => void;
  onSaveDraft?: (text: string) => void;
  onBackToPrevious?: () => void;
}

export const ManuscriptEditor: React.FC<ManuscriptEditorProps> = ({
  initialText,
  topic,
  level,
  writingType = "일반 글쓰기",
  minChars = 200,
  maxChars = 600,
  onSubmitForFeedback,
  onSaveDraft,
  onBackToPrevious,
}) => {
  const [text, setText] = useState<string>(initialText || "");
  const [viewMode, setViewMode] = useState<"comfortable" | "grid">("comfortable");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Default target adjustment by level if not overridden
  let actualMin = minChars;
  let actualMax = maxChars;
  if (writingType === "topik53") {
    actualMin = 200;
    actualMax = 300;
  } else if (writingType === "topik54") {
    actualMin = 600;
    actualMax = 700;
  } else {
    if (level <= 2) {
      actualMin = 100;
      actualMax = 200;
    } else if (level <= 4) {
      actualMin = 300;
      actualMax = 450;
    } else {
      actualMin = 600;
      actualMax = 750;
    }
  }

  // Pure character count (excluding spaces or including spaces? TOPIK includes spaces and punctuation in grid cells)
  const charCount = text.length;
  const isWithinTarget = charCount >= actualMin && charCount <= actualMax;
  const isUnderTarget = charCount < actualMin;
  const isOverTarget = charCount > actualMax;

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(text);
    }
    setSaveToast("임시 저장되었습니다.");
    setTimeout(() => setSaveToast(null), 2000);
  };

  const handleReset = () => {
    if (window.confirm("작성 중인 내용을 지우고 처음부터 다시 쓰시겠습니까?")) {
      setText("");
    }
  };

  const handleAddIndent = () => {
    setText((prev) => "  " + prev);
  };

  // Grid renderer: break text into 20-cell rows (standard Korean manuscript format)
  const renderGridRows = () => {
    const chars: string[] = text.split("");
    const cellsPerRow = 20;
    const rows: string[][] = [];

    let currentRow: string[] = [];
    chars.forEach((ch: string) => {
      if (ch === "\n") {
        // Pad rest of row with empty and start new row with indent
        while (currentRow.length < cellsPerRow) {
          currentRow.push("");
        }
        rows.push(currentRow);
        currentRow = [" "]; // Korean manuscript indents first square of new paragraph
      } else {
        currentRow.push(ch);
        if (currentRow.length === cellsPerRow) {
          rows.push(currentRow);
          currentRow = [];
        }
      }
    });

    if (currentRow.length > 0) {
      while (currentRow.length < cellsPerRow) {
        currentRow.push("");
      }
      rows.push(currentRow);
    }

    // Minimum 10 rows to show genuine manuscript feel
    while (rows.length < 8) {
      rows.push(Array(cellsPerRow).fill(""));
    }

    return rows;
  };

  const gridRows = renderGridRows();

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Top Header & View Toggle */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
            {writingType === "topik53" ? "TOPIK 53번" : writingType === "topik54" ? "TOPIK 54번" : `${level}급 원고지`}
          </span>
          <h2 className="text-sm font-bold text-stone-900 mt-1 truncate max-w-[200px]">
            {topic}
          </h2>
        </div>

        {/* Toggle between Comfortable vs Grid */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            id="btn-manuscript-mode-comfortable"
            type="button"
            onClick={() => setViewMode("comfortable")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === "comfortable"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-stone-700 hover:text-stone-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>편하게 쓰기</span>
          </button>
          <button
            id="btn-manuscript-mode-grid"
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-stone-700 hover:text-stone-800"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>원고지 보기</span>
          </button>
        </div>
      </div>

      {/* Character Counter & Status Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-700">현재 글자 수:</span>
            <span
              className={`font-black text-sm ${
                isWithinTarget
                  ? "text-emerald-700"
                  : isOverTarget
                  ? "text-rose-600"
                  : "text-amber-700"
              }`}
            >
              {charCount}자
            </span>
          </div>

          <div className="text-right text-[11px] text-stone-700">
            목표: <span className="font-bold text-stone-800">{actualMin} ~ {actualMax}자</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-300 ${
              isWithinTarget
                ? "bg-emerald-500"
                : isOverTarget
                ? "bg-rose-500"
                : "bg-amber-400"
            }`}
            style={{
              width: `${Math.min(100, (charCount / actualMax) * 100)}%`,
            }}
          />
        </div>

        {/* Status Hint */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-700 flex items-center gap-1">
            {isWithinTarget && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 목표 분량 충족
              </span>
            )}
            {isUnderTarget && (
              <span className="text-amber-700 font-medium">
                목표까지 {actualMin - charCount}자 더 작성해 보세요.
              </span>
            )}
            {isOverTarget && (
              <span className="text-rose-600 font-medium">
                목표 범위를 {charCount - actualMax}자 초과했습니다.
              </span>
            )}
          </span>

          <button
            onClick={handleAddIndent}
            className="text-[10px] text-stone-700 hover:text-stone-800 underline cursor-pointer"
          >
            + 문단 들여쓰기
          </button>
        </div>
      </div>

      {/* Editor Main Content */}
      {viewMode === "comfortable" ? (
        <div className="bg-white border border-stone-300 focus-within:border-emerald-500 rounded-2xl p-3 shadow-xs transition-all">
          <textarea
            id="input-manuscript-comfortable-textarea"
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 한국어로 글을 작성하세요.
앞서 '생각 코치'와 '글의 설계도'에서 정리한 내용을 바탕으로 문단과 연결 표현을 살려 완성해 보세요."
            className="w-full text-xs text-stone-900 bg-transparent resize-none focus:outline-hidden leading-relaxed font-sans placeholder:text-stone-700"
          />
        </div>
      ) : (
        /* Real Korean Grid Paper (원고지 보기) */
        <div className="bg-[#fcfbf7] border-2 border-emerald-800/30 rounded-2xl p-3 shadow-xs space-y-3 overflow-x-auto">
          <div className="flex items-center justify-between text-[11px] text-emerald-900 font-semibold border-b border-emerald-800/20 pb-1.5">
            <span>한국어 원고지 (줄당 20자)</span>
            <span>첫 칸 비우기(문단 시작) 자동 적용</span>
          </div>

          <div className="min-w-[340px] space-y-1 font-mono text-xs select-none">
            {gridRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-1">
                <span className="w-4 text-[10px] text-stone-700 text-right shrink-0">
                  {rowIdx + 1}
                </span>
                <div className="grid grid-cols-20 gap-0 border border-emerald-800/40 bg-white shadow-2xs">
                  {row.map((ch, colIdx) => (
                    <div
                      key={colIdx}
                      className="w-[15px] h-[22px] border-r border-b border-emerald-700/20 flex items-center justify-center text-[12px] font-medium text-stone-900 last:border-r-0"
                    >
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Input Bar below Grid for instant modification */}
          <div className="pt-2 border-t border-emerald-800/20">
            <span className="text-[10px] text-stone-700 block mb-1">빠른 수정 (입력창):</span>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-xs text-stone-900 bg-white border border-stone-300 rounded-lg p-2 focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Editor Action Buttons (임시 저장, 다시 쓰기) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            id="btn-manuscript-save-draft"
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>임시 저장</span>
          </button>

          <button
            id="btn-manuscript-reset"
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 쓰기</span>
          </button>
        </div>

        {saveToast && (
          <span className="text-xs font-bold text-emerald-800 animate-fade-in">
            ✓ {saveToast}
          </span>
        )}
      </div>

      {/* Big Action Button: AI Evaluation */}
      <div className="pt-2 space-y-2">
        <button
          id="btn-submit-for-ai-evaluation"
          type="button"
          onClick={() => onSubmitForFeedback(text)}
          disabled={!text.trim() || charCount < 20}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-300 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>작성 완료 및 AI 피드백 받기</span>
        </button>

        {onBackToPrevious && (
          <button
            type="button"
            onClick={onBackToPrevious}
            className="w-full py-2 text-xs text-stone-700 hover:text-stone-800 cursor-pointer text-center"
          >
            ← 문단 연결 훈련으로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
};
