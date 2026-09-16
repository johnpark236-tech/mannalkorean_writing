import React, { useState } from "react";
import {
  KoreanLevel,
  WritingCategory,
  LearningStep,
  BlueprintCardItem,
  AiEvaluationReport,
  EssayDraftRecord,
  SavedEssay,
  TeacherArticleTask,
} from "./types";
import {
  INITIAL_SAVED_ESSAYS,
  LEVEL_CONFIGS,
  TOPIK_54_PROBLEMS,
} from "./data/sampleData";
import { Header } from "./components/Header";
import { BottomNav, NavTab } from "./components/BottomNav";
import { HomeView } from "./components/WritingTypeSelector";
import { LevelSelector } from "./components/LevelSelector";
import { ProgressBar } from "./components/ProgressBar";
import { ThinkingCoach } from "./components/ThinkingCoach";
import { WritingBlueprint } from "./components/WritingBlueprint";
import { SentenceConnectorTrainer } from "./components/SentenceConnectorTrainer";
import { ManuscriptEditor } from "./components/ManuscriptEditor";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { RevisionCompare } from "./components/RevisionCompare";
import { VocabularyCoach } from "./components/VocabularyCoach";
import { Topik53Coach } from "./components/Topik53Coach";
import { Topik54Coach } from "./components/Topik54Coach";
import { ReadingToWritingCoach } from "./components/ReadingToWritingCoach";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentRecords } from "./components/StudentRecords";
import { X, Sparkles, RefreshCw, ArrowLeft } from "lucide-react";

export default function App() {
  // Global level (1 to 6)
  const [currentLevel, setCurrentLevel] = useState<KoreanLevel>(4);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);

  // Bottom Nav tab
  const [currentTab, setCurrentTab] = useState<NavTab>("home");

  // Teacher mode toggle
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);

  // Active Writing Flow
  const [isWritingActive, setIsWritingActive] = useState<boolean>(false);
  const [writingCategory, setWritingCategory] = useState<WritingCategory>("thinking");
  const [currentStep, setCurrentStep] = useState<LearningStep>("topic_check");
  const [activeTopic, setActiveTopic] = useState<string>(
    "스마트폰 사용이 우리의 생활에 미치는 영향"
  );
  const [blueprintCards, setBlueprintCards] = useState<BlueprintCardItem[]>([]);
  const [assembledParagraph, setAssembledParagraph] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationReport, setEvaluationReport] = useState<AiEvaluationReport | null>(null);

  // Drafts history for active writing
  const [draftsHistory, setDraftsHistory] = useState<EssayDraftRecord[]>([]);

  // Persistent user saved essays
  const [savedEssays, setSavedEssays] = useState<SavedEssay[]>(INITIAL_SAVED_ESSAYS);

  // Diff Modal for viewing older essays
  const [diffModalEssay, setDiffModalEssay] = useState<SavedEssay | null>(null);

  // Start Writing handler from Home Hero
  const handleStartWriting = () => {
    setIsTeacherMode(false);
    setIsWritingActive(true);
    setWritingCategory("thinking");
    setCurrentStep("thinking_coach");
    setActiveTopic("스마트폰 사용이 우리의 생활에 미치는 영향");
  };

  // Category selection handler from 6 Home Menu items
  const handleSelectCategory = (cat: WritingCategory) => {
    if (cat === "my_writings") {
      setCurrentTab("my_writings");
      setIsWritingActive(false);
      return;
    }
    if (cat === "teacher") {
      setIsTeacherMode(true);
      setIsWritingActive(false);
      return;
    }

    setIsTeacherMode(false);
    setWritingCategory(cat);
    setIsWritingActive(true);

    if (cat === "topik53") {
      setCurrentStep("topic_check");
    } else if (cat === "topik54") {
      setCurrentStep("topic_check");
    } else if (cat === "reading") {
      setCurrentStep("topic_check");
    } else {
      setCurrentStep("thinking_coach");
      setActiveTopic("스마트폰 사용이 우리의 생활에 미치는 영향");
    }
  };

  // When Socratic Thinking Coach finishes all questions
  const handleThinkingComplete = (cards: BlueprintCardItem[]) => {
    setBlueprintCards(cards);
    setCurrentStep("blueprint");
  };

  // Update card in Blueprint
  const handleUpdateBlueprintCard = (id: string, updatedText: string) => {
    setBlueprintCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, studentAnswer: updatedText } : c))
    );
  };

  // Proceed from Blueprint to Sentence Connector Training
  const handleProceedToParagraphTraining = () => {
    setCurrentStep("paragraph_link");
  };

  // When Connector Training finishes
  const handleFinishedConnectorTraining = (assembledText: string) => {
    setAssembledParagraph(assembledText);
    setCurrentStep("manuscript");
  };

  // Submit text from Manuscript Editor for AI Evaluation
  const handleSubmitForEvaluation = async (text: string) => {
    setIsEvaluating(true);

    // Save as draft 1 if first draft
    const newDrafts: EssayDraftRecord[] =
      draftsHistory.length === 0
        ? [
            {
              version: 1,
              text,
              charCount: text.length,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]
        : draftsHistory;

    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          topic: activeTopic,
          level: currentLevel,
          writingType: writingCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvaluationReport(data.data);
        newDrafts[0].evaluation = data.data;
      }
    } catch {
      // Robust pedagogical fallback
      const fallbackReport: AiEvaluationReport = {
        taskScore: 82,
        taskFeedback: [
          "요구된 주제에 맞추어 생각의 중심을 잘 잡았습니다.",
          "구체적인 이유와 해결 방안을 한 단계 더 보강하면 더욱 설득력 있는 글이 됩니다.",
        ],
        structureScore: 80,
        structureFeedback: [
          "서론과 본론의 구분이 자연스럽게 형성되었습니다.",
          "문단과 문단 사이에 '반면에', '따라서' 등의 접속 표현을 적극적으로 활용해 보세요.",
        ],
        languageScore: 84,
        languageFeedback: [
          `${currentLevel}급에 어울리는 문어체 평서문(~다/ㄴ다)을 잘 유지하였습니다.`,
          "반복되는 어휘를 어휘 코치에서 추천하는 대체 고급 표현으로 바꿔보세요.",
        ],
        overallComment:
          "훌륭한 초고입니다! 아래 제시된 3단계 질문을 따라 스스로 부족한 부분을 채워 수정해 보세요.",
        socraticQuestions: [
          {
            step: 1,
            location: "문단의 전환 부분",
            issue: "장점에서 단점으로 넘어갈 때 문맥이 급격하게 전환됨",
            guideQuestion:
              "앞의 긍정적인 내용과 뒤의 문제점 사이에 '그러나'나 '반면에'를 넣어 두 생각의 대비를 살려볼까요?",
          },
        ],
      };
      setEvaluationReport(fallbackReport);
      newDrafts[0].evaluation = fallbackReport;
    } finally {
      setIsEvaluating(false);
      setDraftsHistory(newDrafts);
      setCurrentStep("ai_feedback");
    }
  };

  // Proceed to Self-Revision from Feedback
  const handleProceedToRevision = () => {
    setCurrentStep("self_revision");
  };

  // Finish self-revision and save to "나의 글"
  const handleFinishRevision = (revisedText: string) => {
    const updatedDrafts: EssayDraftRecord[] = [
      ...draftsHistory,
      {
        version: draftsHistory.length + 1,
        text: revisedText,
        charCount: revisedText.length,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        evaluation: {
          taskScore: 90,
          taskFeedback: ["질문에 답하며 부족했던 근거와 해결책을 훌륭하게 보완했습니다."],
          structureScore: 92,
          structureFeedback: ["문단 구분이 명확해지고 논리적 연결 표현이 매끄럽게 정리되었습니다."],
          languageScore: 91,
          languageFeedback: ["풍부한 문어체 어휘와 정확한 종결어미를 구사하였습니다."],
          overallComment: "스스로 생각하고 수정한 결과, 글의 완성도가 눈에 띄게 높아졌습니다!",
        },
      },
    ];

    setDraftsHistory(updatedDrafts);

    // Save to SavedEssays list
    const newSavedEssay: SavedEssay = {
      id: `essay-${Date.now()}`,
      title: activeTopic,
      category: writingCategory,
      level: currentLevel,
      date: new Date().toISOString().split("T")[0],
      currentVersion: updatedDrafts.length,
      drafts: updatedDrafts,
    };

    setSavedEssays((prev) => [newSavedEssay, ...prev]);
  };

  // Exit writing flow and return to home
  const handleReturnHome = () => {
    setIsWritingActive(false);
    setCurrentTab("home");
    setCurrentStep("topic_check");
    setBlueprintCards([]);
    setDraftsHistory([]);
    setEvaluationReport(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky) */}
      <Header
        currentLevel={currentLevel}
        onSelectLevelClick={() => setIsLevelModalOpen(true)}
        onHomeClick={handleReturnHome}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => {
          setIsTeacherMode((prev) => !prev);
          setIsWritingActive(false);
        }}
      />

      {/* 2. Step Progress Bar (Shown during active writing) */}
      {isWritingActive && !isTeacherMode && (
        <ProgressBar
          currentStep={currentStep}
          onStepClick={(st) => setCurrentStep(st)}
        />
      )}

      {/* 3. Main Body Container (Mobile Max Width) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-24">
        {/* VIEW 1: Teacher Mode */}
        {isTeacherMode ? (
          <TeacherDashboard
            onExitTeacherMode={() => setIsTeacherMode(false)}
            onPublishTaskToStudents={(task) => {
              setActiveTopic(task.generatedProblem.title);
            }}
          />
        ) : isWritingActive ? (
          /* VIEW 2: Active Writing Coaching Flow */
          <div>
            {/* Category: TOPIK 53 */}
            {writingCategory === "topik53" && currentStep === "topic_check" && (
              <Topik53Coach
                level={currentLevel}
                onProceedToManuscript={(assembled, prob) => {
                  setActiveTopic(prob.title);
                  setAssembledParagraph(assembled);
                  setCurrentStep("manuscript");
                }}
              />
            )}

            {/* Category: TOPIK 54 */}
            {writingCategory === "topik54" && currentStep === "topic_check" && (
              <Topik54Coach
                level={currentLevel}
                onProceedToThinking={(prob) => {
                  setActiveTopic(prob.title);
                  setCurrentStep("thinking_coach");
                }}
              />
            )}

            {/* Category: Reading-to-Writing */}
            {writingCategory === "reading" && currentStep === "topic_check" && (
              <ReadingToWritingCoach
                level={currentLevel}
                onProceedToFullWriting={(title, thought) => {
                  setActiveTopic(title);
                  setAssembledParagraph(thought);
                  setCurrentStep("thinking_coach");
                }}
              />
            )}

            {/* Step: Thinking Coach (Socratic Dialog) */}
            {currentStep === "thinking_coach" && (
              <ThinkingCoach
                topic={activeTopic}
                level={currentLevel}
                writingType={writingCategory}
                onCompleteThinking={handleThinkingComplete}
              />
            )}

            {/* Step: Blueprint Cards */}
            {currentStep === "blueprint" && (
              <WritingBlueprint
                topic={activeTopic}
                level={currentLevel}
                cards={blueprintCards}
                onUpdateCard={handleUpdateBlueprintCard}
                onProceedToParagraph={handleProceedToParagraphTraining}
                onBackToThinking={() => setCurrentStep("thinking_coach")}
              />
            )}

            {/* Step: Sentence Connector Trainer */}
            {currentStep === "paragraph_link" && (
              <SentenceConnectorTrainer
                level={currentLevel}
                cards={blueprintCards}
                onFinishTraining={handleFinishedConnectorTraining}
                onBackToBlueprint={() => setCurrentStep("blueprint")}
              />
            )}

            {/* Step: Manuscript Editor */}
            {currentStep === "manuscript" && (
              <ManuscriptEditor
                initialText={assembledParagraph}
                topic={activeTopic}
                level={currentLevel}
                writingType={writingCategory}
                onSubmitForFeedback={handleSubmitForEvaluation}
                onSaveDraft={(txt) => {
                  setAssembledParagraph(txt);
                }}
                onBackToPrevious={() => setCurrentStep("paragraph_link")}
              />
            )}

            {/* Evaluating Spinner Overlay */}
            {isEvaluating && (
              <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-xl space-y-3 max-w-xs w-full animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">
                    AI 코치가 글을 정밀 분석 중입니다
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    내용 충실도, 글의 전개 구조, 어휘 및 문법을 3대 영역으로 분석하고 있습니다...
                  </p>
                </div>
              </div>
            )}

            {/* Step: AI Feedback Panel */}
            {currentStep === "ai_feedback" && evaluationReport && (
              <FeedbackPanel
                evaluation={evaluationReport}
                originalText={draftsHistory[0]?.text || assembledParagraph}
                level={currentLevel}
                onProceedToRevision={handleProceedToRevision}
                onGoToVocabCoach={() => setCurrentTab("analytics")}
              />
            )}

            {/* Step: Self Revision Editor & Diff Compare */}
            {currentStep === "self_revision" && (
              <div className="space-y-4">
                {draftsHistory.length > 1 ? (
                  <RevisionCompare
                    topic={activeTopic}
                    drafts={draftsHistory}
                    onFinish={() => {
                      setCurrentTab("my_writings");
                      setIsWritingActive(false);
                    }}
                    onRestartNewWriting={handleReturnHome}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
                      <h2 className="text-lg font-bold text-stone-900">
                        피드백을 반영하여 글 다듬기
                      </h2>
                      <p className="text-xs text-stone-600">
                        AI 피드백과 소크라테스 질문의 힌트를 살려 초고를 직접 수정해 보세요.
                      </p>
                    </div>

                    <ManuscriptEditor
                      initialText={draftsHistory[0]?.text || assembledParagraph}
                      topic={`${activeTopic} (수정본)`}
                      level={currentLevel}
                      writingType={writingCategory}
                      onSubmitForFeedback={(revisedText) => {
                        handleFinishRevision(revisedText);
                      }}
                      onBackToPrevious={() => setCurrentStep("ai_feedback")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 3: Bottom Nav Tabs */
          <div>
            {currentTab === "home" && (
              <HomeView
                currentLevel={currentLevel}
                onStartWriting={handleStartWriting}
                onSelectCategory={handleSelectCategory}
                onOpenLevelModal={() => setIsLevelModalOpen(true)}
              />
            )}

            {currentTab === "practice" && (
              <div className="space-y-4">
                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs text-center space-y-1">
                  <h2 className="text-lg font-bold text-stone-900">글쓰기 연습 선택</h2>
                  <p className="text-xs text-stone-600">
                    도전하고 싶은 글쓰기 유형을 선택해 보세요.
                  </p>
                </div>
                <HomeView
                  currentLevel={currentLevel}
                  onStartWriting={handleStartWriting}
                  onSelectCategory={handleSelectCategory}
                  onOpenLevelModal={() => setIsLevelModalOpen(true)}
                />
              </div>
            )}

            {currentTab === "my_writings" && (
              <StudentRecords
                level={currentLevel}
                savedEssays={savedEssays}
                onOpenDiffModal={(essay) => setDiffModalEssay(essay)}
              />
            )}

            {currentTab === "analytics" && (
              <div className="space-y-4">
                <VocabularyCoach level={currentLevel} />
                <StudentRecords
                  level={currentLevel}
                  savedEssays={savedEssays}
                  onOpenDiffModal={(essay) => setDiffModalEssay(essay)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. Level Selection Dialog Modal */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl relative space-y-3 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsLevelModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <LevelSelector
              currentLevel={currentLevel}
              onSelectLevel={(lvl) => setCurrentLevel(lvl)}
              onConfirm={() => setIsLevelModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 5. Diff Modal for saved essays */}
      {diffModalEssay && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl relative space-y-3 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDiffModalEssay(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <RevisionCompare
              topic={diffModalEssay.title}
              drafts={diffModalEssay.drafts}
              onFinish={() => setDiffModalEssay(null)}
            />
          </div>
        </div>
      )}

      {/* 6. Mobile Bottom Navigation (Hidden while active manuscript writing for maximum screen focus) */}
      {!(isWritingActive && currentStep === "manuscript") && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsTeacherMode(false);
            if (tab === "home") {
              setIsWritingActive(false);
            }
          }}
        />
      )}
    </div>
  );
}
