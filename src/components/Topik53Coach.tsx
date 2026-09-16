import React, { useState } from "react";
import { Topik53Problem, KoreanLevel } from "../types";
import { TOPIK_53_PROBLEMS } from "../data/sampleData";
import {
  BarChart2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";

interface Topik53CoachProps {
  level: KoreanLevel;
  onProceedToManuscript: (assembledText: string, problem: Topik53Problem) => void;
}

export const Topik53Coach: React.FC<Topik53CoachProps> = ({
  level,
  onProceedToManuscript,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(
    TOPIK_53_PROBLEMS[0].id
  );
  const problem =
    TOPIK_53_PROBLEMS.find((p) => p.id === selectedProblemId) || TOPIK_53_PROBLEMS[0];

  // Answers to the 5 analysis steps
  const [answers, setAnswers] = useState<Record<number, string>>({
    0: problem.analysisSteps[0].sampleSentence,
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const handleAnswerChange = (idx: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  const handleInsertSample = (idx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [idx]: problem.analysisSteps[idx].sampleSentence,
    }));
  };

  const handleAddPhrase = (idx: number, phrase: string) => {
    setAnswers((prev) => ({
      ...prev,
      [idx]: prev[idx] ? `${prev[idx]} ${phrase}` : phrase,
    }));
  };

  // Build the complete 200~300 character draft
  const getFullDraft = () => {
    return (Object.values(answers) as string[])
      .filter((a) => a && a.trim().length > 0)
      .join(" ");
  };

  const currentDraft = getFullDraft();

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>TOPIK 53번 쓰기 특훈</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          도표·그래프 분석 7단계 훈련
        </h2>
        <p className="text-xs text-stone-700">
          자료의 핵심 수치와 변화 추세를 객관적으로 200~300자 원고지로 기술하는 연습입니다.
        </p>
      </div>

      {/* Problem Selector Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {TOPIK_53_PROBLEMS.map((prob) => (
          <button
            key={prob.id}
            onClick={() => {
              setSelectedProblemId(prob.id);
              setAnswers({
                0: prob.analysisSteps[0].sampleSentence,
                1: "",
                2: "",
                3: "",
                4: "",
              });
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedProblemId === prob.id
                ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                : "bg-white border-stone-200 hover:bg-stone-50"
            }`}
          >
            <span className="text-[10px] font-bold text-blue-800 block">
              문제 {prob.id.includes("smartphone") ? "1" : "2"}
            </span>
            <span className="text-xs font-bold text-stone-900 line-clamp-1">
              {prob.title}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Chart Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <span className="text-xs font-bold text-emerald-400">
            [조사 기관: {problem.institution}]
          </span>
          <span className="text-[11px] text-stone-400">{problem.timeframe}</span>
        </div>

        <h3 className="text-sm font-bold text-stone-100">{problem.title}</h3>
        <p className="text-xs text-stone-300">{problem.topic}</p>

        {/* Visual Bar representation of main data */}
        <div className="space-y-2 pt-1 bg-stone-800/80 p-3 rounded-xl">
          <span className="text-[11px] font-bold text-stone-300 block">
            연도별 추이 변화:
          </span>
          <div className="space-y-1.5">
            {problem.mainData.map((d, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300">{d.yearOrCategory}</span>
                  <span className="font-bold text-emerald-400">
                    {d.value} {d.unit}
                  </span>
                </div>
                <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(Number(d.value) / Number(problem.mainData[problem.mainData.length - 1].value)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Pie / Breakdown Data */}
        <div className="bg-stone-800/80 p-3 rounded-xl space-y-1.5">
          <span className="text-[11px] font-bold text-stone-300 block">
            주요 세부 구성 비율:
          </span>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {problem.secondaryData.map((sec, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-stone-700/60 px-2.5 py-1.5 rounded-lg"
              >
                <span className="text-stone-200">{sec.category}</span>
                <span className="font-bold text-amber-400">{sec.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Phrases Recommendation Box */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center gap-1 text-xs font-bold text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>TOPIK 53 필수 비교 및 서술 표현 (터치하여 추가)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {problem.essentialPhrases.map((phrase, i) => (
            <button
              key={i}
              onClick={() => handleAddPhrase(1, phrase)}
              className="text-[11px] px-2 py-0.5 bg-white border border-blue-300 hover:bg-blue-100 text-blue-900 rounded-md cursor-pointer transition-colors"
            >
              + {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-step 5 analysis answering cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-stone-800">
            단계별 문장 작성 (총 5문장으로 완성)
          </h3>
          <span className="text-[11px] text-stone-700">목표: 200~300자</span>
        </div>

        {problem.analysisSteps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                {step.question}
              </span>
              <button
                onClick={() => handleInsertSample(idx)}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
              >
                예시 문장 채우기
              </button>
            </div>

            <p className="text-[11px] text-stone-700">{step.guidance}</p>

            <textarea
              rows={2}
              value={answers[idx] || ""}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              placeholder="위 안내를 바탕으로 공식 문어체 문장으로 작성하세요..."
              className="w-full text-xs text-stone-900 border border-stone-300 rounded-lg p-2 focus:outline-hidden focus:border-blue-500 leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* Live Assembled Preview */}
      <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 text-xs font-bold">
          <span className="text-stone-900">완성된 초고 미리보기</span>
          <span
            className={`${
              currentDraft.length >= 200 && currentDraft.length <= 300
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {currentDraft.length}자 / 200~300자
          </span>
        </div>
        <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line bg-stone-50 p-2.5 rounded-lg border border-stone-200 min-h-[60px]">
          {currentDraft || "작성된 문장이 없습니다."}
        </p>
      </div>

      {/* Proceed to Manuscript button */}
      <div className="pt-2">
        <button
          id="btn-topik53-proceed-manuscript"
          onClick={() => onProceedToManuscript(currentDraft, problem)}
          disabled={currentDraft.length < 50}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-300 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all text-sm"
        >
          <span>원고지에서 격자 칸 확인하고 다듬기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
