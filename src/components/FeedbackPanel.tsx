import React, { useState } from "react";
import { AiEvaluationReport, SocraticFeedbackItem, KoreanLevel } from "../types";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Edit3,
  BarChart,
  BookOpen,
  LayoutTemplate,
  Languages,
} from "lucide-react";

interface FeedbackPanelProps {
  evaluation: AiEvaluationReport;
  originalText: string;
  level: KoreanLevel;
  onProceedToRevision: (answersToFeedback?: Record<number, string>) => void;
  onGoToVocabCoach?: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  evaluation,
  originalText,
  level,
  onProceedToRevision,
  onGoToVocabCoach,
}) => {
  const [socraticAnswers, setSocraticAnswers] = useState<Record<number, string>>({});
  const [activeAreaTab, setActiveAreaTab] = useState<"task" | "structure" | "language">("task");

  const handleAnswerChange = (stepIdx: number, val: string) => {
    setSocraticAnswers((prev) => ({ ...prev, [stepIdx]: val }));
  };

  const areas = [
    {
      id: "task" as const,
      label: "내용 및 과제 수행",
      score: evaluation.taskScore,
      icon: BookOpen,
      color: "emerald",
      feedbacks: evaluation.taskFeedback,
      checklist: [
        "문제의 요구사항을 빠짐없이 다루었는가",
        "자신의 주장과 논리적 이유가 제시되었는가",
        "구체적인 설명과 사례가 포함되었는가",
      ],
    },
    {
      id: "structure" as const,
      label: "글의 전개 구조",
      score: evaluation.structureScore,
      icon: LayoutTemplate,
      color: "blue",
      feedbacks: evaluation.structureFeedback,
      checklist: [
        "서론·본론·결론이 뚜렷하게 나뉘었는가",
        "문단의 중심 내용이 분명한가",
        "문단 간 연결 표현이 자연스러운가",
      ],
    },
    {
      id: "language" as const,
      label: "언어 사용 및 표현",
      score: evaluation.languageScore,
      icon: Languages,
      color: "indigo",
      feedbacks: evaluation.languageFeedback,
      checklist: [
        `${level}급에 적합한 어휘와 문법을 사용했는가`,
        "조사와 어미가 정확하게 쓰였는가",
        "격식 있는 문어체(~다/ㄴ다)로 통일되었는가",
      ],
    },
  ];

  const activeArea = areas.find((a) => a.id === activeAreaTab) || areas[0];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3대 영역 정밀 분석 결과</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          AI 코칭 평가 및 피드백
        </h2>
        <p className="text-xs text-stone-700">
          AI가 답을 대신 고쳐주지 않습니다. 아래 피드백과 질문을 보며 스스로 다듬어 보세요.
        </p>
      </div>

      {/* 3 Area Score Cards */}
      <div className="grid grid-cols-3 gap-2">
        {areas.map((area) => {
          const isSelected = activeAreaTab === area.id;
          const Icon = area.icon;

          return (
            <button
              key={area.id}
              onClick={() => setActiveAreaTab(area.id)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-white border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 mx-auto mb-1 ${
                  isSelected ? "text-emerald-700" : "text-stone-700"
                }`}
              />
              <div className="text-[11px] font-bold text-stone-700 truncate">
                {area.label}
              </div>
              <div
                className={`text-base font-black mt-0.5 ${
                  area.score >= 80
                    ? "text-emerald-700"
                    : area.score >= 70
                    ? "text-blue-600"
                    : "text-amber-700"
                }`}
              >
                {area.score}점
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Area Detail Feedback */}
      <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <span className="text-xs font-bold text-stone-900">
            [{activeArea.label}] 점검 기준 및 피드백
          </span>
          <span className="text-xs font-black text-emerald-700">
            {activeArea.score} / 100
          </span>
        </div>

        {/* Feedback List */}
        <div className="space-y-1.5">
          {activeArea.feedbacks.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-stone-800 leading-snug">
              <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="pt-2 border-t border-dashed border-stone-200 space-y-1">
          <span className="text-[10px] font-bold text-stone-700 block">평가 체크리스트:</span>
          {activeArea.checklist.map((check, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Step Socratic Feedback Section (section 16 in prompt) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>3단계 소크라테스식 생각 유도</span>
          </h3>
          <span className="text-[10px] text-stone-700">스스로 수정하기</span>
        </div>

        {evaluation.socraticQuestions && evaluation.socraticQuestions.length > 0 ? (
          <div className="space-y-2.5">
            {evaluation.socraticQuestions.map((q, idx) => (
              <div
                key={idx}
                className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2 shadow-2xs"
              >
                {/* 1단계: 위치 */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                  <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded-sm">
                    1단계: 문제 위치
                  </span>
                  <span>{q.location}</span>
                </div>

                <p className="text-xs text-stone-700 bg-white/80 p-2 rounded-lg border border-amber-100 italic">
                  &quot;{q.issue}&quot;
                </p>

                {/* 2단계: 질문 */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                    2단계: 생각 유도 질문
                  </span>
                  <p className="text-xs font-semibold text-stone-900 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200">
                    {q.guideQuestion}
                  </p>
                </div>

                {/* 3단계: 학생 직접 답변 */}
                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-bold text-stone-700 block">
                    3단계: 나의 수정 아이디어
                  </span>
                  <input
                    type="text"
                    value={socraticAnswers[idx] || ""}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="여기에 어떻게 고칠지 생각을 적어보세요..."
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
            글의 논리적 흐름이 매끄럽습니다. 어휘를 조금 더 다듬어 최종 글을 완성해 보세요!
          </div>
        )}
      </div>

      {/* Vocabulary Coach Quick Teaser */}
      {onGoToVocabCoach && (
        <button
          onClick={onGoToVocabCoach}
          className="w-full bg-white border border-emerald-300 hover:bg-emerald-50 rounded-xl p-3 text-left flex items-center justify-between shadow-2xs cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📚</span>
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                어휘 코치 (내 어휘 수준 분석 보기)
              </span>
              <span className="text-[11px] text-stone-700">
                현재 어휘 → 더 정확한 표현 → 한 단계 높은 고급 표현 추천
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>
      )}

      {/* Bottom Action: Proceed to Self-Revision */}
      <div className="pt-2">
        <button
          id="btn-feedback-proceed-revision"
          onClick={() => onProceedToRevision(socraticAnswers)}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
        >
          <Edit3 className="w-4 h-4" />
          <span>피드백 반영하여 스스로 글 수정하기</span>
        </button>
      </div>
    </div>
  );
};
