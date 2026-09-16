import React, { useState } from "react";
import { SavedEssay, KoreanLevel } from "../types";
import { INITIAL_SAVED_ESSAYS } from "../data/sampleData";
import {
  FolderHeart,
  BarChart3,
  GitCompare,
  Sparkles,
  BookMarked,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";

interface StudentRecordsProps {
  level: KoreanLevel;
  savedEssays: SavedEssay[];
  onOpenDiffModal?: (essay: SavedEssay) => void;
}

export const StudentRecords: React.FC<StudentRecordsProps> = ({
  level,
  savedEssays,
  onOpenDiffModal,
}) => {
  const [activeTab, setActiveTab] = useState<"essays" | "analytics">("essays");
  const [selectedEssay, setSelectedEssay] = useState<SavedEssay>(
    savedEssays[0] || INITIAL_SAVED_ESSAYS[0]
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
          <FolderHeart className="w-3.5 h-3.5" />
          <span>나의 글 보관함 및 학습 통계</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          내가 쓴 글과 성장 기록
        </h2>
        <p className="text-xs text-stone-700">
          초고부터 최종 수정본까지 내 글의 발전 과정과 어휘·문법 성장을 확인하세요.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab("essays")}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "essays"
              ? "bg-white text-stone-900 shadow-xs font-bold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <FolderHeart className="w-3.5 h-3.5 text-rose-600" />
          <span>작성한 글 목록 ({savedEssays.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "analytics"
              ? "bg-white text-stone-900 shadow-xs font-bold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          <span>성장 분석 및 통계</span>
        </button>
      </div>

      {/* TAB 1: Essay List & Versions */}
      {activeTab === "essays" && (
        <div className="space-y-3">
          {savedEssays.map((essay) => (
            <div
              key={essay.id}
              className="bg-white border border-stone-200 hover:border-emerald-300 rounded-2xl p-4 shadow-2xs space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-700 uppercase">
                    {essay.category}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 mt-1">
                    {essay.title}
                  </h3>
                </div>
                <span className="text-[11px] text-stone-700 flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {essay.date}
                </span>
              </div>

              {/* Version pill list */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-700 text-[11px] font-semibold">
                  작성 단계:
                </span>
                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[11px]">
                  초고 ({essay.drafts[0]?.charCount || 0}자)
                </span>
                <ArrowRight className="w-3 h-3 text-stone-400" />
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px]">
                  수정본 ({essay.drafts[1]?.charCount || essay.drafts[0]?.charCount}자)
                </span>
              </div>

              {/* Snippet of revised draft */}
              <p className="text-xs text-stone-700 leading-relaxed line-clamp-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                {essay.drafts[1]?.text || essay.drafts[0]?.text}
              </p>

              {/* Action Button: Compare versions */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onOpenDiffModal && onOpenDiffModal(essay)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>초고 vs 수정본 비교하기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Learning Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-3">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-2xs space-y-1">
              <span className="text-[11px] text-stone-700 block">총 작성 완료한 글</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-stone-900">
                  {savedEssays.length}
                </span>
                <span className="text-xs text-stone-700">편</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-2xs space-y-1">
              <span className="text-[11px] text-stone-700 block">평균 글자 수 확장</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-700">+160</span>
                <span className="text-xs text-stone-700">자 (질문 유도 효과)</span>
              </div>
            </div>
          </div>

          {/* Frequent Grammar & Connector Patterns */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-stone-900 block">
              가장 자주 활용한 연결 표현 순위
            </span>
            <div className="space-y-1.5 text-xs">
              {[
                { word: "따라서", count: 8, label: "결과 도출" },
                { word: "그러나 / 반면에", count: 6, label: "대조 표현" },
                { word: "예를 들어", count: 5, label: "구체적 사례" },
                { word: "왜냐하면 ~기 때문이다", count: 4, label: "원인 및 근거" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200"
                >
                  <span className="font-semibold text-stone-800">{item.word}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-700">{item.label}</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {item.count}회
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Diagnostic Tips */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs text-stone-800">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>자주 주의해야 할 문법 포인트</span>
            </span>
            <ul className="space-y-1 text-stone-700">
              <li>• 구어체 종결어미(~해요)를 공식 문어체(~다/ㄴ다)로 일관되게 유지하기</li>
              <li>• 주어와 서술어 호응 (예: &apos;목적은 ~것이다&apos;, &apos;원인은 ~때문이다&apos;)</li>
              <li>• 반복되는 &apos;많이&apos;, &apos;좋다&apos;를 정확한 문어체 어휘로 대체하기</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
