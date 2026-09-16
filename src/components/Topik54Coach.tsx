import React, { useState } from "react";
import { Topik54Problem, KoreanLevel, BlueprintCardItem } from "../types";
import { TOPIK_54_PROBLEMS } from "../data/sampleData";
import {
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";

interface Topik54CoachProps {
  level: KoreanLevel;
  onProceedToThinking: (problem: Topik54Problem, initialCards?: BlueprintCardItem[]) => void;
}

export const Topik54Coach: React.FC<Topik54CoachProps> = ({
  level,
  onProceedToThinking,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(
    TOPIK_54_PROBLEMS[0].id
  );
  const problem =
    TOPIK_54_PROBLEMS.find((p) => p.id === selectedProblemId) || TOPIK_54_PROBLEMS[0];

  const [activeTab, setActiveTab] = useState<"analysis" | "structure">("analysis");

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>TOPIK 54번 600~700자 논술</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          3가지 하위 질문 분해와 논리 전개
        </h2>
        <p className="text-xs text-stone-700">
          복잡한 논술 문제를 3개 핵심 질문으로 쪼개어 서론·본론·결론으로 구조화합니다.
        </p>
      </div>

      {/* Problem Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {TOPIK_54_PROBLEMS.map((prob) => (
          <button
            key={prob.id}
            onClick={() => setSelectedProblemId(prob.id)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedProblemId === prob.id
                ? "bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                : "bg-white border-stone-200 hover:bg-stone-50"
            }`}
          >
            <span className="text-[10px] font-bold text-indigo-800 block">
              논술 주제 {prob.id.includes("smartphone") ? "1" : "2"}
            </span>
            <span className="text-xs font-bold text-stone-900 line-clamp-1">
              {prob.title}
            </span>
          </button>
        ))}
      </div>

      {/* Prompt Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <span className="text-xs font-bold text-indigo-400">
            [TOPIK II 쓰기 54번 공식 출제 유형]
          </span>
          <span className="text-[11px] text-stone-400">목표 600~700자</span>
        </div>

        <h3 className="text-sm font-bold text-stone-100">{problem.title}</h3>
        <p className="text-xs text-stone-300 leading-relaxed bg-stone-800/80 p-3 rounded-xl border border-stone-700">
          {problem.promptBackground}
        </p>

        {/* 3 Sub-questions cards */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-stone-300 block">
            반드시 포함해야 할 3가지 질문:
          </span>
          {problem.subQuestions.map((sq, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-stone-800/90 p-2.5 rounded-xl border border-stone-700 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-stone-200 font-medium leading-snug">{sq}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords Cloud */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 space-y-1.5">
        <span className="text-[11px] font-bold text-indigo-950 block">
          출제 관련 핵심 고급 어휘:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {problem.keywords.map((kw, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-full font-medium shadow-2xs"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Standard Structure Blueprint */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>5단계 논술 문단 구조 안내</span>
          </h3>
          <span className="text-[11px] text-stone-700">서론·본론·결론</span>
        </div>

        <div className="space-y-2">
          {problem.structureTemplate.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-xl p-3 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {item.section}
                </span>
                <span className="text-[11px] text-stone-700">{item.guide}</span>
              </div>
              <ul className="text-xs text-stone-700 space-y-0.5 pl-2">
                {item.elements.map((el, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Action to Start Socratic Thinking */}
      <div className="pt-2">
        <button
          id="btn-topik54-start-thinking"
          onClick={() => onProceedToThinking(problem)}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>생각 코치와 3가지 질문 단계별 답변하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
