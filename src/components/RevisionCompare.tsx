import React, { useState } from "react";
import { EssayDraftRecord } from "../types";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
} from "lucide-react";

interface RevisionCompareProps {
  topic: string;
  drafts: EssayDraftRecord[];
  onFinish?: () => void;
  onRestartNewWriting?: () => void;
}

export const RevisionCompare: React.FC<RevisionCompareProps> = ({
  topic,
  drafts,
  onFinish,
  onRestartNewWriting,
}) => {
  const [selectedVersionLeft, setSelectedVersionLeft] = useState<number>(1);
  const [selectedVersionRight, setSelectedVersionRight] = useState<number>(
    drafts.length > 1 ? drafts.length : 1
  );
  const [copied, setCopied] = useState<boolean>(false);

  const leftDraft = drafts.find((d) => d.version === selectedVersionLeft) || drafts[0];
  const rightDraft =
    drafts.find((d) => d.version === selectedVersionRight) || drafts[drafts.length - 1];

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>수정 전 / 수정 후 비교</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          스스로 발전시킨 글의 변화
        </h2>
        <p className="text-xs text-stone-700">
          AI의 정답 복사가 아닌, 질문 코칭을 통해 나의 생각이 어떻게 확장되었는지 확인하세요.
        </p>
      </div>

      {/* Version Selector Buttons */}
      <div className="flex items-center justify-between bg-stone-100 p-1.5 rounded-xl text-xs font-semibold">
        <span className="text-stone-700 px-2">버전 선택:</span>
        <div className="flex items-center gap-1.5">
          {drafts.map((d) => (
            <button
              key={d.version}
              onClick={() => setSelectedVersionRight(d.version)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedVersionRight === d.version
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {d.version === 1 ? "초고" : d.version === 2 ? "수정한 글" : `버전 ${d.version}`}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side or stacked diff view */}
      <div className="space-y-3">
        {/* First Draft Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 text-xs">
            <span className="font-bold text-stone-700">
              ① 처음 작성한 글 (초고)
            </span>
            <span className="text-[11px] text-stone-700">
              {leftDraft?.charCount || 0}자
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-stone-200">
            {leftDraft?.text || "작성된 초고가 없습니다."}
          </p>
        </div>

        {/* Arrow Transition */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
          <div className="h-px bg-emerald-200 flex-1" />
          <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            AI 질문에 답하며 스스로 수정한 결과
          </span>
          <div className="h-px bg-emerald-200 flex-1" />
        </div>

        {/* Revised Draft Box */}
        <div className="bg-emerald-50/50 border border-emerald-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5 text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>② {selectedVersionRight === 1 ? "초고" : "수정본 (발전된 글)"}</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-800">
              {rightDraft?.charCount || 0}자
            </span>
          </div>
          <p className="text-xs text-stone-900 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-emerald-200 font-normal">
            {rightDraft?.text || "수정된 글이 없습니다."}
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => handleCopyText(rightDraft?.text || "")}
              className="text-[11px] text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "복사되었습니다!" : "완성된 글 복사하기"}</span>
            </button>

            {rightDraft?.charCount && leftDraft?.charCount && (
              <span className="text-[11px] text-emerald-700 font-semibold">
                +{Math.max(0, rightDraft.charCount - leftDraft.charCount)}자 확장됨
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completion Summary & Next Actions */}
      <div className="pt-2 space-y-2">
        {onFinish && (
          <button
            id="btn-compare-save-to-my-writings"
            onClick={onFinish}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>&apos;나의 글&apos;에 보관하고 학습 완료</span>
          </button>
        )}

        {onRestartNewWriting && (
          <button
            onClick={onRestartNewWriting}
            className="w-full py-2.5 text-xs text-stone-700 hover:text-stone-800 cursor-pointer text-center"
          >
            다른 새로운 주제로 글쓰기 연습하기
          </button>
        )}
      </div>
    </div>
  );
};
