import React from "react";
import { LearningStep } from "../types";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: LearningStep;
  onStepClick?: (step: LearningStep) => void;
  writingType?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepClick }) => {
  const steps: { id: LearningStep; label: string; shortLabel: string }[] = [
    { id: "topic_check", label: "문제 파악", shortLabel: "문제" },
    { id: "thinking_coach", label: "생각 코치", shortLabel: "생각" },
    { id: "blueprint", label: "글의 설계도", shortLabel: "설계" },
    { id: "paragraph_link", label: "문단 연결", shortLabel: "문단" },
    { id: "manuscript", label: "원고지 작성", shortLabel: "작성" },
    { id: "ai_feedback", label: "AI 피드백", shortLabel: "피드백" },
    { id: "self_revision", label: "자기 수정", shortLabel: "수정" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-stone-200 py-2.5 px-3 sticky top-[53px] z-30 shadow-2xs">
      <div className="max-w-md mx-auto">
        {/* Step dots & connector line */}
        <div className="relative flex items-center justify-between">
          {/* Background gray bar */}
          <div className="absolute left-2 right-2 top-3.5 -translate-y-1/2 h-0.5 bg-stone-200 z-0" />

          {/* Active green progress bar */}
          <div
            className="absolute left-2 top-3.5 -translate-y-1/2 h-0.5 bg-emerald-600 z-0 transition-all duration-300"
            style={{
              width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 94}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={step.id}
                id={`btn-step-progress-${step.id}`}
                disabled={!onStepClick || idx > currentIndex}
                onClick={() => onStepClick && onStepClick(step.id)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden disabled:cursor-default`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : isCurrent
                      ? "bg-emerald-700 text-white ring-3 ring-emerald-100 scale-110 shadow-xs"
                      : "bg-white border-2 border-stone-300 text-stone-700"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>

                <span
                  className={`text-[10px] mt-1 whitespace-nowrap tracking-tight transition-colors ${
                    isCurrent
                      ? "font-bold text-emerald-800"
                      : isCompleted
                      ? "font-medium text-stone-700"
                      : "text-stone-700"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
