import React, { useState } from "react";
import { BlueprintCardItem, KoreanLevel } from "../types";
import {
  FileText,
  ArrowDown,
  Edit2,
  Check,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";

interface WritingBlueprintProps {
  topic: string;
  level: KoreanLevel;
  cards: BlueprintCardItem[];
  onUpdateCard: (id: string, updatedText: string) => void;
  onProceedToParagraph: () => void;
  onBackToThinking?: () => void;
}

export const WritingBlueprint: React.FC<WritingBlueprintProps> = ({
  topic,
  level,
  cards,
  onUpdateCard,
  onProceedToParagraph,
  onBackToThinking,
}) => {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [tempEditText, setTempEditText] = useState<string>("");

  const handleStartEdit = (card: BlueprintCardItem) => {
    setEditingCardId(card.id);
    setTempEditText(card.studentAnswer);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateCard(id, tempEditText);
    setEditingCardId(null);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>{level}급 맞춤 글의 설계도</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          글의 뼈대와 흐름 확인하기
        </h2>
        <p className="text-xs text-stone-700">
          생각 코치에서 완성한 생각을 연결하기 전에 카드의 순서와 내용을 점검하세요.
        </p>
      </div>

      {/* Blueprint Visual Cards */}
      <div className="space-y-2">
        {cards.map((card, index) => {
          const isEditing = editingCardId === card.id;
          const isLast = index === cards.length - 1;

          return (
            <React.Fragment key={card.id}>
              <div
                id={`blueprint-card-${card.id}`}
                className="bg-white border-2 border-stone-200 hover:border-emerald-300 rounded-xl p-3.5 shadow-xs transition-all relative"
              >
                {/* Card Title Bar */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {card.title}
                    </span>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(card)}
                      className="text-[11px] text-stone-700 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>수정</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveEdit(card.id)}
                      className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>완료</span>
                    </button>
                  )}
                </div>

                {/* Card Content */}
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={tempEditText}
                    onChange={(e) => setTempEditText(e.target.value)}
                    className="w-full text-xs text-stone-900 border border-emerald-300 rounded-lg p-2 focus:outline-hidden leading-relaxed bg-emerald-50/20"
                  />
                ) : (
                  <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-normal">
                    {card.studentAnswer || (
                      <span className="text-stone-700 italic">
                        아직 내용이 작성되지 않았습니다. 수정을 눌러 작성해 보세요.
                      </span>
                    )}
                  </p>
                )}

                {/* Card Guidance Hint */}
                <div className="mt-2 pt-2 border-t border-dashed border-stone-100 flex items-center justify-between text-[10px] text-stone-700">
                  <span className="truncate max-w-[80%]">질문: {card.guideQuestion}</span>
                  {card.recommendedConnector && (
                    <span className="font-semibold text-emerald-700">
                      추천: {card.recommendedConnector}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Arrow between cards */}
              {!isLast && (
                <div className="flex justify-center my-0.5">
                  <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Action bar */}
      <div className="pt-2 space-y-2">
        <button
          id="btn-blueprint-proceed-paragraph"
          onClick={onProceedToParagraph}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm"
        >
          <span>문장 → 문단 연결 훈련하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {onBackToThinking && (
          <button
            onClick={onBackToThinking}
            className="w-full py-2.5 text-xs text-stone-700 hover:text-stone-800 cursor-pointer text-center"
          >
            ← 생각 코치 질문 다시 확인하기
          </button>
        )}
      </div>
    </div>
  );
};
