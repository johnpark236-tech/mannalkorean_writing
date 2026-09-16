import React, { useState } from "react";
import { TeacherArticleTask, SavedEssay } from "../types";
import { INITIAL_TEACHER_PROMPTS, INITIAL_SAVED_ESSAYS } from "../data/sampleData";
import {
  GraduationCap,
  Link,
  FileText,
  Sparkles,
  CheckCircle2,
  Send,
  Eye,
  MessageSquare,
  RefreshCw,
  Layers,
  Users,
} from "lucide-react";

interface TeacherDashboardProps {
  onPublishTaskToStudents?: (newTask: TeacherArticleTask) => void;
  onExitTeacherMode: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onPublishTaskToStudents,
  onExitTeacherMode,
}) => {
  const [activeTab, setActiveTab] = useState<"create_problem" | "student_submissions">(
    "create_problem"
  );

  // Article Input state
  const [sourceType, setSourceType] = useState<"text" | "url">("text");
  const [inputText, setInputText] = useState<string>(
    "환경부는 카페 내 일회용 플라스틱 컵 사용을 제한하고 보증금제를 확대하고 있다. 초기에는 소비자와 매장 업주들의 반발도 있었으나, 다회용 컵 회수율이 70%를 넘어서며 플라스틱 배출량이 전년 대비 30% 감소하는 등 가시적인 성과를 거두고 있다. 전문가들은 편리함보다 지구 환경을 우선시하는 시민 의식이 정착되어야 한다고 강조한다."
  );
  const [taskType, setTaskType] = useState<"reading" | "topik53" | "topik54" | "expository" | "argumentative">(
    "topik54"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Generated Prompt
  const [currentPrompt, setCurrentPrompt] = useState<TeacherArticleTask | null>(
    INITIAL_TEACHER_PROMPTS[0]
  );
  const [publishedSuccess, setPublishedSuccess] = useState<boolean>(false);

  // Student drafts inspection state
  const [studentEssays, setStudentEssays] = useState<SavedEssay[]>(INITIAL_SAVED_ESSAYS);
  const [selectedStudentEssay, setSelectedStudentEssay] = useState<SavedEssay | null>(
    INITIAL_SAVED_ESSAYS[0]
  );
  const [teacherComment, setTeacherComment] = useState<string>("");
  const [commentSavedToast, setCommentSavedToast] = useState<boolean>(false);

  // Handle AI prompt generation from backend
  const handleGeneratePrompt = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setPublishedSuccess(false);

    try {
      const res = await fetch("/api/ai/generate-article-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          input: inputText,
          taskType,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentPrompt(data.data);
      }
    } catch {
      // Fallback
      alert("문제를 생성하지 못했습니다. 입력 내용을 확인해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndPublish = () => {
    if (!currentPrompt) return;
    setPublishedSuccess(true);
    if (onPublishTaskToStudents) {
      onPublishTaskToStudents({ ...currentPrompt, approved: true });
    }
    setTimeout(() => setPublishedSuccess(false), 3000);
  };

  const handleSaveTeacherComment = () => {
    if (!teacherComment.trim()) return;
    setCommentSavedToast(true);
    setTimeout(() => setCommentSavedToast(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950">선생님 전용 관리실</h2>
            <p className="text-[11px] text-amber-800">
              뉴스 기사로 문제 생성 및 학생 첨삭 관리
            </p>
          </div>
        </div>

        <button
          onClick={onExitTeacherMode}
          className="text-xs bg-white border border-amber-300 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg text-amber-900 font-semibold cursor-pointer"
        >
          학생 모드로
        </button>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab("create_problem")}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "create_problem"
              ? "bg-white text-stone-900 shadow-xs font-bold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>기사 기반 문제 생성</span>
        </button>
        <button
          onClick={() => setActiveTab("student_submissions")}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "student_submissions"
              ? "bg-white text-stone-900 shadow-xs font-bold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>학생 제출물 및 첨삭</span>
        </button>
      </div>

      {/* TAB 1: Create Problem from Article */}
      {activeTab === "create_problem" && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-bold text-stone-800">
                기사 또는 텍스트 입력
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSourceType("text")}
                  className={`px-2 py-0.5 rounded-md ${
                    sourceType === "text"
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-500"
                  }`}
                >
                  본문 붙여넣기
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType("url")}
                  className={`px-2 py-0.5 rounded-md ${
                    sourceType === "url"
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-500"
                  }`}
                >
                  기사 URL 링크
                </button>
              </div>
            </div>

            {sourceType === "text" ? (
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="뉴스 기사나 읽기 지문 텍스트를 여기에 붙여넣으세요..."
                className="w-full text-xs border border-stone-300 rounded-xl p-2.5 focus:outline-hidden focus:border-amber-500 leading-relaxed"
              />
            ) : (
              <div className="relative">
                <Link className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="https://news.example.com/article/..."
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>
            )}

            {/* Problem Type Options */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-700 block">
                생성할 글쓰기 유형:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: "topik54", label: "TOPIK 54번" },
                  { id: "topik53", label: "TOPIK 53번" },
                  { id: "reading", label: "읽고 쓰기" },
                  { id: "expository", label: "설명하는 글" },
                  { id: "argumentative", label: "주장하는 글" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTaskType(t.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                      taskType === t.id
                        ? "bg-amber-500 text-white font-bold border-amber-600 shadow-2xs"
                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={isGenerating || !inputText.trim()}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI가 기사를 심층 분석 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>기사 분석 및 글쓰기 문제 생성하기</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis & Generated Problem Review */}
          {currentPrompt && (
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-amber-900">
                  AI 분석 결과 및 출제안 검토
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold">
                  {currentPrompt.taskType.toUpperCase()}
                </span>
              </div>

              {/* 3-sentence summary & facts */}
              <div className="bg-stone-50 rounded-xl p-3 space-y-2 text-xs">
                <span className="font-bold text-stone-800 block">
                  기사 핵심 요약:
                </span>
                <ul className="space-y-1 text-stone-700">
                  {currentPrompt.analysis.summary.map((sum, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{sum}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Generated Problem Specification */}
              <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 space-y-2">
                <h4 className="text-xs font-bold text-stone-900">
                  [배포용 문제 제목] {currentPrompt.generatedProblem.title}
                </h4>
                <p className="text-xs text-stone-700">
                  {currentPrompt.generatedProblem.instructions}
                </p>

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-stone-800 block">
                    하위 사고 질문:
                  </span>
                  {currentPrompt.generatedProblem.subQuestions.map((sq, i) => (
                    <div key={i} className="text-xs text-stone-700 flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">{i + 1}.</span>
                      <span>{sq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Approve and publish */}
              <div className="pt-2">
                <button
                  onClick={handleApproveAndPublish}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>선생님 검토 완료 및 학생들에게 배포</span>
                </button>

                {publishedSuccess && (
                  <p className="text-center text-xs font-bold text-emerald-700 mt-2">
                    ✓ 성공적으로 학생 글쓰기 메뉴에 배포되었습니다!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Student Submissions Inspection */}
      {activeTab === "student_submissions" && (
        <div className="space-y-3">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-900 block">
              제출된 학생 글 목록
            </span>

            {studentEssays.map((essay) => (
              <div
                key={essay.id}
                className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    {essay.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-sm">
                    {essay.level}급
                  </span>
                </div>

                <div className="text-[11px] text-stone-700 flex items-center gap-3">
                  <span>작성일: {essay.date}</span>
                  <span>초고: {essay.drafts[0]?.charCount}자</span>
                  <span>수정본: {essay.drafts[1]?.charCount}자</span>
                </div>

                {/* Draft progression toggle view */}
                <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 block">
                    최종 수정본 ({essay.drafts[1]?.charCount || 0}자):
                  </span>
                  <p className="text-stone-800 leading-relaxed text-[11px] line-clamp-3">
                    {essay.drafts[1]?.text || essay.drafts[0]?.text}
                  </p>
                </div>

                {/* Teacher Comment Box */}
                <div className="pt-2 border-t border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-amber-600" />
                      <span>선생님 맞춤 피드백 작성</span>
                    </span>
                    {commentSavedToast && (
                      <span className="text-[10px] text-emerald-700 font-bold">
                        ✓ 피드백 저장 완료
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={teacherComment}
                    onChange={(e) => setTeacherComment(e.target.value)}
                    placeholder="학생에게 전달할 따뜻한 격려와 보완점을 입력하세요..."
                    className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:outline-hidden focus:border-amber-500 bg-white"
                  />
                  <button
                    onClick={handleSaveTeacherComment}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    피드백 전송
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
