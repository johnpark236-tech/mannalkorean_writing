import React, { useState } from "react";
import { BlueprintCardItem, KoreanLevel } from "../types";
import { Link2, ArrowRight, Check, Sparkles, Wand2 } from "lucide-react";

interface SentenceConnectorTrainerProps {
  level: KoreanLevel;
  cards: BlueprintCardItem[];
  onFinishTraining: (assembledText: string) => void;
  onBackToBlueprint: () => void;
}

const AVAILABLE_CONNECTORS = [
  { label: "왜냐하면", meaning: "이유 제시" },
  { label: "따라서", meaning: "결과 도출" },
  { label: "예를 들어", meaning: "구체적 사례" },
  { label: "그러나", meaning: "역접·대조" },
  { label: "반면에", meaning: "상반된 비교" },
  { label: "그러므로", meaning: "결론 정리" },
  { label: "이러한 점에서", meaning: "종합적 시각" },
  { label: "아울러", meaning: "추가 정보" },
];

export const SentenceConnectorTrainer: React.FC<SentenceConnectorTrainerProps> = ({
  level,
  cards,
  onFinishTraining,
  onBackToBlueprint,
}) => {
  // Between every card i and i+1, store selected connector
  const [selectedConnectors, setSelectedConnectors] = useState<Record<number, string>>({
    0: "",
    1: "왜냐하면",
    2: "예를 들어",
    3: "따라서",
  });

  const handleSelectConnector = (index: number, connector: string) => {
    setSelectedConnectors((prev) => ({
      ...prev,
      [index]: prev[index] === connector ? "" : connector,
    }));
  };

  // Generate assembled paragraph
  const getAssembledParagraph = () => {
    let result = "";
    cards.forEach((card, idx) => {
      let sentence = card.studentAnswer.trim();
      if (!sentence) return;

      // Ensure proper Korean ending if missing
      if (!sentence.endsWith(".") && !sentence.endsWith("!") && !sentence.endsWith("?")) {
        sentence += ".";
      }

      if (idx === 0) {
        result += sentence;
      } else {
        const conn = selectedConnectors[idx];
        if (conn) {
          result += ` ${conn} ${sentence}`;
        } else {
          result += ` ${sentence}`;
        }
      }
    });
    return result.trim();
  };

  const assembledText = getAssembledParagraph();

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
          <Link2 className="w-3.5 h-3.5" />
          <span>문장 → 문단 연결 훈련</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          알맞은 연결 표현으로 문단 완성하기
        </h2>
        <p className="text-xs text-stone-700">
          생각 카드 사이에 가장 적절한 접속 표현을 선택하여 자연스러운 글의 흐름을 만들어 보세요.
        </p>
      </div>

      {/* Cards with interactive connector buttons between them */}
      <div className="space-y-3">
        {cards.map((card, idx) => {
          const isNotFirst = idx > 0;
          const currentConnector = selectedConnectors[idx];

          return (
            <div key={card.id} className="space-y-2">
              {/* Connector selection pill bar before card if not first */}
              {isNotFirst && (
                <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-2.5 my-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-700 mb-1.5 font-semibold">
                    <span>앞 문장과 연결할 표현 선택:</span>
                    {currentConnector && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                        선택됨: {currentConnector}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_CONNECTORS.map((item) => {
                      const isChosen = currentConnector === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSelectConnector(idx, item.label)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                            isChosen
                              ? "bg-emerald-600 text-white font-bold shadow-xs scale-105"
                              : "bg-white border border-stone-200 text-stone-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* The Thought Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded-sm">
                    [{card.title}]
                  </span>
                </div>
                <p className="text-xs text-stone-900 leading-relaxed font-medium">
                  {card.studentAnswer || "작성된 생각이 없습니다."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Assembled Paragraph Preview */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>완성된 문단 미리보기</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-emerald-100 text-xs text-stone-900 leading-relaxed min-h-[70px] whitespace-pre-line shadow-2xs">
          {assembledText || "연결할 문장이 없습니다."}
        </div>
      </div>

      {/* Action to proceed to manuscript editor */}
      <div className="pt-2 space-y-2">
        <button
          id="btn-connector-proceed-manuscript"
          onClick={() => onFinishTraining(assembledText)}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm"
        >
          <span>원고지 작성으로 넘어가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onBackToBlueprint}
          className="w-full py-2.5 text-xs text-stone-700 hover:text-stone-800 cursor-pointer text-center"
        >
          ← 글의 설계도로 돌아가기
        </button>
      </div>
    </div>
  );
};
