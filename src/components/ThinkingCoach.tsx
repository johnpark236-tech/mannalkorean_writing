import React, { useState } from "react";
import { KoreanLevel, BlueprintCardItem } from "../types";
import {
  MessageSquare,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface ThinkingCoachProps {
  topic: string;
  level: KoreanLevel;
  onCompleteThinking: (completedCards: BlueprintCardItem[]) => void;
  writingType?: string;
  initialBlueprintItems?: BlueprintCardItem[];
}

interface CoachDialogItem {
  sender: "coach" | "student";
  text: string;
  stageTitle?: string;
  isEasierHint?: boolean;
}

export const ThinkingCoach: React.FC<ThinkingCoachProps> = ({
  topic,
  level,
  onCompleteThinking,
  writingType = "일반 글쓰기",
  initialBlueprintItems,
}) => {
  // Predefined graded questions for sample topic: "스마트폰 사용이 우리의 생활에 미치는 영향"
  const getGradedQuestions = () => {
    if (topic.includes("스마트폰")) {
      if (level <= 2) {
        return [
          {
            title: "스마트폰 사용 경험",
            question: "여러분은 하루에 스마트폰으로 무엇을 가장 많이 하나요?",
            easier: "친구와 메시지를 보내요? 아니면 유튜브를 봐요?",
            hint: "누가, 무엇을 하는지 짧은 문장으로 써 보세요.",
            keywords: ["유튜브", "카카오톡", "게임", "사진"],
          },
          {
            title: "좋은 점",
            question: "스마트폰이 있어서 왜 편리하고 좋은가요?",
            easier: "스마트폰이 없으면 어떤 점이 불편할까요?",
            hint: "좋은 이유를 '~어서/아서 좋아요'로 표현해 보세요.",
            keywords: ["편리하다", "빠르다", "재미있다", "연락하다"],
          },
          {
            title: "문제점과 생각",
            question: "스마트폰을 너무 많이 쓰면 어떤 문제가 생기나요?",
            easier: "눈이 아프거나 잠을 못 잔 적이 있나요?",
            hint: "경험을 바탕으로 솔직하게 적어 보세요.",
            keywords: ["눈이 아프다", "잠을 못 자다", "시간 낭비"],
          },
        ];
      } else if (level <= 4) {
        return [
          {
            title: "생활의 변화",
            question: "스마트폰은 우리의 일상생활 방식을 어떻게 바꾸어 놓았습니까?",
            easier: "스마트폰 덕분에 사람들의 소통 방식이나 정보 검색이 어떻게 달라졌나요?",
            hint: "과거와 현재의 차이를 간단히 비교해 보세요.",
            keywords: ["일상생활", "정보 검색", "실시간 소통", "필수품"],
          },
          {
            title: "장점과 이유",
            question: "스마트폰의 가장 대표적인 장점은 무엇이며, 왜 그렇게 생각합니까?",
            easier: "원하는 것을 즉시 해결할 수 있는 편리함에 대해 구체적인 예를 들어 볼까요?",
            hint: "장점과 함께 그 이유를 한 문단으로 엮어 보세요.",
            keywords: ["접근성", "효율적", "지리적 한계 극복", "유익하다"],
          },
          {
            title: "부작용 및 문제점",
            question: "반대로 스마트폰 과다 사용으로 인해 발생하는 문제점은 무엇입니까?",
            easier: "수면 부족이나 대화 단절 등 일상에서 겪는 부작용을 떠올려 보세요.",
            hint: "원인과 결과(~기 때문에 ~문제가 발생한다)로 써 보세요.",
            keywords: ["디지털 과의존", "수면 장애", "대면 대화 단절", "집중력 저하"],
          },
          {
            title: "해결 방안",
            question: "이러한 문제를 줄이고 유익하게 사용하기 위해 우리는 무엇을 실천해야 할까요?",
            easier: "개인이 사용 시간을 정하거나 알림을 끄는 방법은 어떨까요?",
            hint: "구체적인 실천 규칙이나 마음가짐을 결론으로 제언해 보세요.",
            keywords: ["자율적 조절", "사용 시간 제한", "디지털 디톡스", "올바른 습관"],
          },
        ];
      } else {
        // 5~6급 고급 수준 논술 사고 유도
        return [
          {
            title: "문제의 배경과 쟁점",
            question: "현대 사회에서 스마트폰의 보편화가 가져온 사회문화적 변화의 본질은 무엇입니까?",
            easier: "스마트폰이 단순한 통신 기기를 넘어 인간의 사고방식과 관계 맺기에 어떤 영향을 미치고 있나요?",
            hint: "기술 혁신이 인간의 삶의 양식을 재편하고 있는 배경을 논리적으로 서술하세요.",
            keywords: ["초연결 사회", "생활 양식 재편", "정보 격차", "양날의 검"],
          },
          {
            title: "핵심 주장 및 긍정적 편익",
            question: "스마트폰이 지닌 긍정적 가치를 인간 역량 증진의 관점에서 어떻게 평가할 수 있습니까?",
            easier: "업무 생산성 향상이나 지식의 민주화 측면에서 긍정적 사례를 들어볼까요?",
            hint: "구체적인 근거와 함께 설득력 있는 논리를 전개하세요.",
            keywords: ["지식 접근성", "생산성 제고", "글로벌 네트워크", "삶의 질 향상"],
          },
          {
            title: "심층적 문제 분석 및 구조적 원인",
            question: "스마트폰 의존 현상이 개인의 심리 및 사회적 연대감에 미치는 부정적 파급 효과는 무엇입니까?",
            easier: "피상적 인간관계 형성이나 정서적 고립감 문제를 어떻게 설명할 수 있을까요?",
            hint: "개인적 차원을 넘어 사회 구조적 문제점으로 시각을 확장하세요.",
            keywords: ["정서적 고립", "인지적 과부하", "알고리즘 편향", "사회적 소외"],
          },
          {
            title: "상반된 시각 검토",
            question: "스마트폰의 부정적 영향에 대해 '개인의 통제력 부족'과 '플랫폼 기업의 중독 유발 설계' 중 어느 쪽에 더 무게를 두어야 할까요?",
            easier: "기기 자체를 규제해야 한다는 주장과 개인의 자율성에 맡겨야 한다는 주장 중 어느 쪽에 동의합니까?",
            hint: "반대 의견을 논박하거나 두 요소를 균형 있게 조율해 보세요.",
            keywords: ["기업의 사회적 책임", "자율적 통제권", "미디어 리터러시"],
          },
          {
            title: "사회적 의미와 종합적 제언",
            question: "디지털 기술과 인간이 건강하게 공존하기 위해 개인과 제도적 차원에서 추진해야 할 종합 대책은 무엇입니까?",
            easier: "학교 교육 프로그램이나 사회적 제도 개선 방안을 제시해 볼까요?",
            hint: "글 전체를 아우르는 미래지향적 결론을 도출하세요.",
            keywords: ["디지털 웰빙", "제도적 가이드라인", "비판적 수용 태도", "조화로운 공존"],
          },
        ];
      }
    }

    // Default general graded questions
    return [
      {
        title: "주제 탐색",
        question: `"${topic}"에 대해 가장 먼저 떠오르는 생각이나 경험은 무엇인가요?`,
        easier: "이 주제를 들었을 때 좋다고 생각하나요, 아니면 걱정스럽다고 생각하나요?",
        hint: "처음 떠오르는 단어 하나만 적어도 좋습니다.",
        keywords: ["경험", "생각", "사회", "변화"],
      },
      {
        title: "이유 찾기",
        question: "그렇게 생각하게 된 주된 이유나 근거는 무엇인가요?",
        easier: "주변 친구들이나 뉴스에서 본 사례가 있나요?",
        hint: "왜냐하면 ~기 때문이라는 문장으로 시작해 보세요.",
        keywords: ["이유", "영향", "결과", "실제 사례"],
      },
      {
        title: "결론 및 제언",
        question: "이 내용을 바탕으로 독자에게 전달하고 싶은 최종 메시지는 무엇인가요?",
        easier: "앞으로 우리가 어떻게 행동해야 할까요?",
        hint: "따라서 ~해야 한다로 마무리해 보세요.",
        keywords: ["노력", "해결책", "태도", "실천"],
      },
    ];
  };

  const stageQuestions = getGradedQuestions();
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [studentInput, setStudentInput] = useState<string>("");
  const [isRequestingEasier, setIsRequestingEasier] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Accumulated dialog history
  const [dialogHistory, setDialogHistory] = useState<CoachDialogItem[]>([
    {
      sender: "coach",
      text: `안녕하세요! 글쓰기 코치입니다. 모범답안을 먼저 베끼지 않고, 한 단계씩 스스로 생각을 정리해 보아요.\n\n첫 번째 질문입니다:\n"${stageQuestions[0].question}"`,
      stageTitle: stageQuestions[0].title,
    },
  ]);

  // Answer accumulator for blueprint
  const [answeredSteps, setAnsweredSteps] = useState<
    { title: string; question: string; answer: string; hint: string }[]
  >([]);

  const activeQuestion = stageQuestions[currentStageIdx];

  const handleSendAnswer = () => {
    if (!studentInput.trim()) return;

    const newAnswer = studentInput.trim();
    const updatedAnswers = [
      ...answeredSteps,
      {
        title: activeQuestion.title,
        question: isRequestingEasier ? activeQuestion.easier : activeQuestion.question,
        answer: newAnswer,
        hint: activeQuestion.hint,
      },
    ];
    setAnsweredSteps(updatedAnswers);

    const newHistory: CoachDialogItem[] = [
      ...dialogHistory,
      { sender: "student", text: newAnswer },
    ];

    setStudentInput("");
    setIsRequestingEasier(false);

    // If more stages exist
    if (currentStageIdx + 1 < stageQuestions.length) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      const nextQ = stageQuestions[nextIdx];

      newHistory.push({
        sender: "coach",
        text: `좋은 생각입니다! 그 생각을 바탕으로 다음 단계로 나아가 볼까요?\n\n"${nextQ.question}"`,
        stageTitle: nextQ.title,
      });
      setDialogHistory(newHistory);
    } else {
      // Completed all thinking questions!
      newHistory.push({
        sender: "coach",
        text: `축하합니다! 단계별 질문에 모두 답하셨습니다. 작성하신 답변들이 '글의 설계도' 카드에 자동으로 배치되었습니다. 이제 설계도를 확인하고 글을 구성해 봅시다!`,
      });
      setDialogHistory(newHistory);

      // Convert to BlueprintCardItem list
      const blueprintCards: BlueprintCardItem[] = updatedAnswers.map((item, idx) => ({
        id: `bp-card-${idx}`,
        stepNumber: idx + 1,
        title: item.title,
        guideQuestion: item.question,
        hint: item.hint,
        studentAnswer: item.answer,
        levelRequired: level,
      }));

      setTimeout(() => {
        onCompleteThinking(blueprintCards);
      }, 1200);
    }
  };

  // "무슨 말을 써야 할지 모르겠어요" clicked
  const handleStuckHelp = async () => {
    setIsRequestingEasier(true);
    setIsLoadingAi(true);

    try {
      // Fetch dynamic easier question from /api/ai/coach
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          level,
          currentStage: activeQuestion.title,
          studentAnswer: "무슨 말을 써야 할지 모르겠어요.",
          previousQuestions: [activeQuestion.question],
          writingType,
        }),
      });
      const data = await res.json();
      const easierPrompt =
        data?.data?.easierQuestion || activeQuestion.easier;
      const encouragement =
        data?.data?.encouragement || "괜찮아요! 가장 쉬운 것부터 하나씩 생각해 봐요.";

      setDialogHistory((prev) => [
        ...prev,
        {
          sender: "student",
          text: "무슨 말을 써야 할지 잘 모르겠어요.",
        },
        {
          sender: "coach",
          text: `${encouragement}\n\n👉 조금 더 쉬운 보조 질문:\n"${easierPrompt}"`,
          isEasierHint: true,
        },
      ]);
    } catch {
      setDialogHistory((prev) => [
        ...prev,
        {
          sender: "student",
          text: "무슨 말을 써야 할지 잘 모르겠어요.",
        },
        {
          sender: "coach",
          text: `괜찮아요! 부담 갖지 말고 아래 질문에 떠오르는 단어 하나만 써 보세요:\n"${activeQuestion.easier}"`,
          isEasierHint: true,
        },
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleKeywordClick = (word: string) => {
    setStudentInput((prev) => (prev ? `${prev} ${word}` : word));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Header Info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-900">생각 코치 (소크라테스식 문답)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-white text-emerald-800 font-semibold border border-emerald-200">
              {level}급 맞춤
            </span>
          </div>
          <p className="text-xs font-semibold text-stone-800 mt-0.5 truncate">
            주제: {topic}
          </p>
          <p className="text-[11px] text-stone-700 mt-0.5">
            질문에 답한 내용은 &apos;글의 설계도&apos;에 자동 배치됩니다.
          </p>
        </div>
      </div>

      {/* Progress within thinking stages */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-700">
        <span className="font-semibold text-emerald-800">
          단계 {currentStageIdx + 1} / {stageQuestions.length} : {activeQuestion?.title}
        </span>
        <span>{Math.round(((currentStageIdx) / stageQuestions.length) * 100)}% 진행됨</span>
      </div>

      {/* Interactive Chat Stream Area */}
      <div
        id="thinking-chat-history"
        className="space-y-3 bg-white border border-stone-200 rounded-2xl p-3.5 min-h-[260px] max-h-[380px] overflow-y-auto shadow-inner"
      >
        {dialogHistory.map((item, idx) => (
          <div
            key={idx}
            className={`flex ${item.sender === "student" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                item.sender === "student"
                  ? "bg-emerald-600 text-white rounded-br-xs"
                  : item.isEasierHint
                  ? "bg-amber-50 border border-amber-200 text-stone-800 rounded-bl-xs"
                  : "bg-stone-100 text-stone-800 rounded-bl-xs"
              }`}
            >
              {item.stageTitle && (
                <div className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>[{item.stageTitle}]</span>
                </div>
              )}
              <div className="whitespace-pre-line">{item.text}</div>
            </div>
          </div>
        ))}
        {isLoadingAi && (
          <div className="flex justify-start">
            <div className="bg-stone-100 text-stone-700 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>더 쉬운 보조 질문을 생성하고 있습니다...</span>
            </div>
          </div>
        )}
      </div>

      {/* Keyword Assistance Chips */}
      {activeQuestion && activeQuestion.keywords && (
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-[11px] text-stone-700">
            <span className="font-semibold">추천 어휘 (터치하여 입력창에 추가)</span>
            <span>{level}급 추천</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeQuestion.keywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleKeywordClick(kw)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-full text-xs text-stone-700 transition-colors cursor-pointer active:scale-95"
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action: Stuck Help Button ("무슨 말을 써야 할지 모르겠어요") */}
      <div className="flex justify-end px-1">
        <button
          id="btn-stuck-easier-question"
          type="button"
          onClick={handleStuckHelp}
          disabled={isLoadingAi}
          className="text-xs text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer active:scale-95"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>무슨 말을 써야 할지 모르겠어요 (더 쉬운 질문 받기)</span>
        </button>
      </div>

      {/* Input Box & Submit */}
      <div className="bg-white border border-stone-300 focus-within:border-emerald-500 rounded-2xl p-2 shadow-xs transition-colors">
        <textarea
          id="input-thinking-student-answer"
          rows={3}
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          placeholder={
            isRequestingEasier
              ? "쉬운 질문에 생각나는 단어나 한 문장을 편하게 적어보세요..."
              : `${activeQuestion?.hint || "질문에 대한 자신의 생각을 한국어로 적어보세요..."}`
          }
          className="w-full text-xs text-stone-900 bg-transparent resize-none p-1.5 focus:outline-hidden placeholder:text-stone-700 leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendAnswer();
            }
          }}
        />

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 px-1">
          <span className="text-[11px] text-stone-700">
            {studentInput.length}자 입력됨
          </span>

          <button
            id="btn-submit-thinking-answer"
            type="button"
            onClick={handleSendAnswer}
            disabled={!studentInput.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <span>답변 저장</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
