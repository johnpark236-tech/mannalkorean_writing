import React, { useState } from "react";
import { VocabUpgradeSuggestion, KoreanLevel } from "../types";
import { BookMarked, Sparkles, ArrowRight, Search, Check, Copy } from "lucide-react";

interface VocabularyCoachProps {
  level: KoreanLevel;
  onSelectWord?: (word: string) => void;
  customSuggestions?: VocabUpgradeSuggestion[];
}

const COMMON_VOCAB_DB: VocabUpgradeSuggestion[] = [
  {
    originalWord: "좋다",
    accurateWord: "편리하다 / 유익하다",
    advancedWord: "효용성이 높다 / 긍정적인 영향을 미치다",
    example: "스마트폰을 통한 신속한 정보 검색은 현대인의 일상에 긍정적인 영향을 미친다.",
  },
  {
    originalWord: "나쁘다",
    accurateWord: "해롭다 / 부적절하다",
    advancedWord: "심각한 부작용을 야기하다 / 폐해가 크다",
    example: "무분별한 디지털 기기 과의존은 청소년의 심신 건강에 심각한 부작용을 야기한다.",
  },
  {
    originalWord: "많다",
    accurateWord: "다양하다 / 풍부하다",
    advancedWord: "다수 존재하다 / 비약적으로 증가하다",
    example: "최근 한국 문화를 체험하고자 하는 외국인 관광객의 수요가 비약적으로 증가하였다.",
  },
  {
    originalWord: "생각하다",
    accurateWord: "판단하다 / 여기다",
    advancedWord: "인식하다 / 견해를 견지하다",
    example: "환경 보호는 더 이상 선택이 아닌 생존을 위한 필수 과제로 인식해야 한다.",
  },
  {
    originalWord: "필요하다",
    accurateWord: "요구되다 / 마땅하다",
    advancedWord: "절실히 요청되다 / 당위성을 지니다",
    example: "기후 위기에 대응하기 위한 범정부적 차원의 제도 보완이 절실히 요청된다.",
  },
  {
    originalWord: "중요하다",
    accurateWord: "핵심적이다 / 결정적이다",
    advancedWord: "중대한 시사점을 던지다 / 지대한 영향을 미치다",
    example: "어린 시절의 올바른 독서 습관은 전 생애의 사고력 형성에 지대한 영향을 미친다.",
  },
  {
    originalWord: "다르다",
    accurateWord: "차이가 있다 / 구별되다",
    advancedWord: "현격한 격차를 보이다 / 상반된 양상을 띠다",
    example: "세대 간 가치관의 변화는 디지털 기술 수용 태도에서 상반된 양상을 띠고 있다.",
  },
  {
    originalWord: "줄이다",
    accurateWord: "절감하다 / 감소시키다",
    advancedWord: "억제하다 / 최소화하다",
    example: "일회용품 사용을 억제하고 폐기물 발생량을 최소화하는 노력이 시급하다.",
  },
];

export const VocabularyCoach: React.FC<VocabularyCoachProps> = ({
  level,
  onSelectWord,
  customSuggestions,
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const allSuggestions = customSuggestions && customSuggestions.length > 0
    ? [...customSuggestions, ...COMMON_VOCAB_DB]
    : COMMON_VOCAB_DB;

  const filtered = allSuggestions.filter(
    (item) =>
      item.originalWord.includes(searchKeyword) ||
      item.accurateWord.includes(searchKeyword) ||
      item.advancedWord.includes(searchKeyword)
  );

  const handleCopy = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    if (onSelectWord) {
      onSelectWord(word);
    }
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          <BookMarked className="w-3.5 h-3.5" />
          <span>단계별 어휘 향상 코치</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          내 어휘 수준을 한 단계 올리기
        </h2>
        <p className="text-xs text-stone-700">
          같은 단어의 반복을 줄이고, 내 생각에 딱 맞는 정확하고 세련된 문어체 어휘를 익혀 보세요.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="바꾸고 싶은 기초 어휘 검색 (예: 좋다, 많다, 필요하다)"
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Vocabulary Cards */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 hover:border-emerald-300 rounded-xl p-3.5 shadow-2xs space-y-2.5 transition-all"
          >
            {/* Original word tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                현재 어휘: <span className="text-rose-600 underline decoration-dashed">{item.originalWord}</span>
              </span>
              <span className="text-[10px] text-stone-700">추천 대체 표현</span>
            </div>

            {/* 2-Tier Upgrade Ladder */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {/* Level 1: More accurate */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 block">
                    더 정확한 표현 (3~4급)
                  </span>
                  <span className="text-xs font-semibold text-blue-950">
                    {item.accurateWord}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(item.accurateWord)}
                  className="px-2 py-1 bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedWord === item.accurateWord ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWord === item.accurateWord ? "복사됨" : "활용"}</span>
                </button>
              </div>

              {/* Level 2: Advanced academic */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 block">
                    한 단계 높은 고급 표현 (5~6급)
                  </span>
                  <span className="text-xs font-semibold text-emerald-950">
                    {item.advancedWord}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(item.advancedWord)}
                  className="px-2 py-1 bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedWord === item.advancedWord ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWord === item.advancedWord ? "복사됨" : "활용"}</span>
                </button>
              </div>
            </div>

            {/* Example sentence */}
            <div className="bg-stone-50 rounded-lg p-2 text-[11px] text-stone-700 leading-relaxed border border-stone-200">
              <span className="font-semibold text-stone-700 block mb-0.5">실전 예문:</span>
              <span>{item.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
