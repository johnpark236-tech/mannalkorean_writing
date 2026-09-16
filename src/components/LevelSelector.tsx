import React from "react";
import { KoreanLevel } from "../types";
import { LEVEL_CONFIGS } from "../data/sampleData";
import { Check, Info, Sparkles, ArrowRight } from "lucide-react";

interface LevelSelectorProps {
  currentLevel: KoreanLevel;
  onSelectLevel: (level: KoreanLevel) => void;
  onConfirm?: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  onConfirm,
}) => {
  const levels: KoreanLevel[] = [1, 2, 3, 4, 5, 6];
  const activeConfig = LEVEL_CONFIGS[currentLevel];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Title block */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          나의 한국어 수준
        </h2>
        <p className="text-xs text-stone-700">
          선택한 급수에 따라 질문 난이도, 어휘, 문단 구조가 자동으로 조절됩니다.
        </p>
      </div>

      {/* Grid of 6 levels: 2 columns */}
      <div className="grid grid-cols-2 gap-2.5">
        {levels.map((lvl) => {
          const config = LEVEL_CONFIGS[lvl];
          const isSelected = currentLevel === lvl;

          return (
            <button
              key={lvl}
              id={`btn-level-select-${lvl}`}
              onClick={() => onSelectLevel(lvl)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-base font-bold ${
                    isSelected ? "text-emerald-800" : "text-stone-800"
                  }`}
                >
                  {lvl}급
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="text-xs font-semibold text-stone-700 mt-1">
                {lvl <= 2 ? "초급 글쓰기" : lvl <= 4 ? "중급 문단 쓰기" : "고급 논술"}
              </div>

              <div className="text-[11px] text-stone-700 mt-1 line-clamp-2 leading-tight">
                {config.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail info card for selected level */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{activeConfig.title} 학습 방향과 평가 기준</span>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="bg-white rounded-lg p-2.5 border border-stone-200">
            <span className="font-semibold text-stone-700 block mb-1">핵심 훈련 포인트</span>
            <ul className="list-disc list-inside space-y-0.5 text-stone-600">
              {activeConfig.focusAreas.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-2.5 border border-stone-200 flex justify-between items-center">
            <div>
              <span className="font-semibold text-stone-700 block">권장 분량</span>
              <span className="text-stone-600">
                {activeConfig.charTarget.min} ~ {activeConfig.charTarget.max}자
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-stone-700 block">설계도 카드 개수</span>
              <span className="text-emerald-700 font-bold">
                {activeConfig.blueprintStepTitles.length}단계 구조
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Action Button */}
      {onConfirm && (
        <button
          id="btn-confirm-level"
          onClick={onConfirm}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm"
        >
          <span>{currentLevel}급으로 학습 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
