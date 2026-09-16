import React, { useState } from "react";
import { ReadingTask, KoreanLevel } from "../types";
import { READING_TASKS } from "../data/sampleData";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  ArrowDown,
} from "lucide-react";

interface ReadingToWritingCoachProps {
  level: KoreanLevel;
  onProceedToFullWriting: (topic: string, studentThought: string) => void;
}

export const ReadingToWritingCoach: React.FC<ReadingToWritingCoachProps> = ({
  level,
  onProceedToFullWriting,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const task = READING_TASKS[0];

  // State for Step 2: Topic quiz
  const [selectedTopicIdx, setSelectedTopicIdx] = useState<number | null>(null);
  const [topicFeedback, setTopicFeedback] = useState<string | null>(null);

  // State for Step 3: Keyword selection feedback
  const [keywordFeedbackMap, setKeywordFeedbackMap] = useState<
    Record<string, { status: "correct" | "tryAgain"; reason: string }>
  >({});

  // State for Step 4: Key sentence index
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState<number | null>(null);

  // State for Step 6: Student's personal thought sentence
  const [studentThought, setStudentThought] = useState<string>("");

  const handleTopicCheck = (idx: number) => {
    setSelectedTopicIdx(idx);
    if (idx === task.correctTopicIndex) {
      setTopicFeedback("정답입니다! 글 전체를 관통하는 핵심 주제를 정확하게 찾았습니다.");
    } else {
      setTopicFeedback("한 번 더 생각해 보세요. 글의 일부분이나 예시가 아닌 전체 중심 내용을 골라보세요.");
    }
  };

  const handleKeywordTap = (kw: { word: string; isKey: boolean; reason: string }) => {
    setKeywordFeedbackMap((prev) => ({
      ...prev,
      [kw.word]: {
        status: kw.isKey ? "correct" : "tryAgain",
        reason: kw.reason,
      },
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>읽기 기반 글쓰기 7단계</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          좋은 글을 분석하며 쓰기 감각 익히기
        </h2>
        <p className="text-xs text-stone-700">
          모범 지문의 구조(두괄식)와 핵심어를 파악한 뒤, 나의 생각으로 확장해 보세요.
        </p>
      </div>

      {/* Step Navigator Bar */}
      <div className="flex items-center justify-between bg-stone-100 p-1.5 rounded-xl text-[11px] font-bold text-stone-600">
        {[1, 2, 3, 4, 5, 6].map((st) => (
          <button
            key={st}
            onClick={() => setCurrentStep(st)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              currentStep === st
                ? "bg-emerald-600 text-white shadow-xs"
                : currentStep > st
                ? "bg-emerald-100 text-emerald-800"
                : "text-stone-700 hover:bg-stone-200"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* STEP 1: Reading the passage */}
      {currentStep === 1 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-emerald-800">
              STEP 1: 짧은 지문 천천히 읽기
            </span>
            <span className="text-[11px] text-stone-700">제목: {task.title}</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3 font-sans text-xs leading-relaxed text-stone-800">
            {task.passage.map((p, idx) => (
              <p key={idx} className="indent-2">
                {p}
              </p>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>다 읽었습니다 (STEP 2: 주제 찾기)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 2: Find the main topic */}
      {currentStep === 2 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 block">
              STEP 2: 글의 중심 주제 찾기
            </span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">
              {task.topicQuestion}
            </h3>
          </div>

          <div className="space-y-2">
            {task.topicOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicCheck(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedTopicIdx === idx
                    ? idx === task.correctTopicIndex
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                      : "bg-rose-50 border-rose-400 text-rose-900"
                    : "bg-white border-stone-200 hover:bg-stone-50 text-stone-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>

          {topicFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                selectedTopicIdx === task.correctTopicIndex
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-amber-50 border border-amber-200 text-amber-900"
              }`}
            >
              {selectedTopicIdx === task.correctTopicIndex ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-700 shrink-0" />
              )}
              <span>{topicFeedback}</span>
            </div>
          )}

          {selectedTopicIdx === task.correctTopicIndex && (
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>다음 단계 (STEP 3: 핵심 어휘 찾기)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* STEP 3: Keywords with instant feedback */}
      {currentStep === 3 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 block">
              STEP 3: 핵심 어휘 찾기
            </span>
            <p className="text-xs text-stone-700 mt-1">
              아래 단어들을 터치하여 글의 핵심어인지 확인해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.keywords.map((kw, i) => {
              const res = keywordFeedbackMap[kw.word];
              return (
                <button
                  key={i}
                  onClick={() => handleKeywordTap(kw)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    res
                      ? res.status === "correct"
                        ? "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-2xs"
                        : "bg-amber-100 border-amber-400 text-amber-900"
                      : "bg-white border-stone-300 text-stone-800 hover:border-emerald-300"
                  }`}
                >
                  {kw.word}
                  {res && (
                    <span className="ml-1 font-bold text-[10px]">
                      {res.status === "correct" ? "✓" : "△"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback messages for clicked words */}
          <div className="space-y-1.5 pt-1">
            {Object.entries(keywordFeedbackMap).map(([word, val]: [string, { status: "correct" | "tryAgain"; reason: string }]) => (
              <div
                key={word}
                className={`p-2.5 rounded-lg text-xs leading-tight flex items-start gap-2 ${
                  val.status === "correct"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}
              >
                <span className="font-bold shrink-0">
                  {val.status === "correct" ? "[잘 찾았어요!]" : "[한 번 더 생각해 보세요]"}
                </span>
                <span>
                  &apos;{word}&apos;: {val.reason}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(4)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <span>다음 단계 (STEP 4 & 5: 문단 구조 분석)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 4 & 5: Visual Paragraph Structure (두괄식) */}
      {(currentStep === 4 || currentStep === 5) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800">
                STEP 5: 문단 구조 확인
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                {task.structureType} 구조
              </span>
            </div>
            <p className="text-xs text-stone-700 mt-1">
              {task.structureExplanation}
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="space-y-2 pt-1">
            {task.structureFlow.map((flow, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      {flow.stage}
                    </span>
                    <span className="text-xs text-stone-700 mt-0.5 block">
                      {flow.description}
                    </span>
                  </div>
                </div>

                {idx < task.structureFlow.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(6)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <span>다음 단계 (STEP 6: 나의 생각 한 문장 쓰기)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 6 & 7: Write own thought and expand */}
      {currentStep === 6 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 block">
              STEP 6: 나의 생각 한 문장 쓰기
            </span>
            <p className="text-xs text-stone-700 mt-1">
              &apos;혼밥 문화&apos;에 대해 당신의 생각은 어떠한가요? 한 문장으로 적어보세요.
            </p>
          </div>

          <textarea
            rows={3}
            value={studentThought}
            onChange={(e) => setStudentThought(e.target.value)}
            placeholder="예: 나는 혼자 식사하면서 책을 읽거나 생각을 정리할 수 있어서 혼밥 문화를 긍정적으로 생각한다."
            className="w-full text-xs text-stone-900 border border-stone-300 rounded-xl p-3 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
          />

          <button
            disabled={!studentThought.trim()}
            onClick={() => onProceedToFullWriting(task.title, studentThought)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>STEP 7: 생각 코치와 전체 글로 확장하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
