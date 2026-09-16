import React from "react";
import { WritingCategory, KoreanLevel } from "../types";
import {
  Lightbulb,
  BarChart2,
  FileText,
  BookOpen,
  FolderHeart,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface HomeViewProps {
  currentLevel: KoreanLevel;
  onStartWriting: () => void;
  onSelectCategory: (category: WritingCategory) => void;
  onOpenLevelModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLevel,
  onStartWriting,
  onSelectCategory,
  onOpenLevelModal,
}) => {
  const menuItems = [
    {
      id: "thinking" as WritingCategory,
      badge: "①",
      title: "생각하고 쓰기",
      desc: "질문에 답하며 생각 → 문장 → 문단으로 스스로 글 완성",
      icon: Lightbulb,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "topik53" as WritingCategory,
      badge: "②",
      title: "TOPIK 53번",
      desc: "도표·그래프 자료를 7단계 분석하여 원고지 200~300자 작성",
      icon: BarChart2,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "topik54" as WritingCategory,
      badge: "③",
      title: "TOPIK 54번",
      desc: "3가지 하위 질문을 분해하여 서론·본론·결론 600~700자 논술",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "reading" as WritingCategory,
      badge: "④",
      title: "읽고 쓰기",
      desc: "지문 읽기 → 주제·핵심어·문장 찾기 → 두괄식/미괄식 구조 파악",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "my_writings" as WritingCategory,
      badge: "⑤",
      title: "나의 글",
      desc: "작성한 글 보관함, 초고 vs 수정본 비교, 어휘 향상 분석",
      icon: FolderHeart,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      id: "teacher" as WritingCategory,
      badge: "⑥",
      title: "선생님 메뉴",
      desc: "뉴스 기사 URL/텍스트로 글쓰기 문제 자동 생성 및 승인",
      icon: GraduationCap,
      color: "bg-stone-100 text-stone-700 border-stone-300",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-5 pb-8">
      {/* Hero Card */}
      <div className="bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-100 rounded-2xl p-5 text-center shadow-xs relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>외국인 학습자를 위한 AI 글쓰기 코치</span>
        </div>

        <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-snug">
          한국어 글쓰기 코치
        </h1>

        <p className="text-xs text-stone-600 max-w-xs mx-auto mt-2 leading-relaxed">
          생각부터 문장까지,
          <br />
          한 단계씩 한국어 글쓰기를 연습해 보세요.
        </p>

        {/* Level Quick Pill */}
        <div className="mt-3 flex justify-center">
          <button
            id="btn-home-level-pill"
            onClick={onOpenLevelModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs text-stone-700 hover:border-emerald-300 hover:text-emerald-800 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">현재 설정: {currentLevel}급</span>
            <span className="text-stone-700 text-[11px]">(변경)</span>
          </button>
        </div>

        {/* The most prominent Hero Action Button */}
        <div className="mt-4">
          <button
            id="btn-home-start-writing"
            onClick={onStartWriting}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer transform active:scale-[0.98]"
          >
            <span>글쓰기 시작</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-3 text-[11px] text-stone-700">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AI 대신 써주기 NO
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 스스로 생각하는 힘 UP
          </span>
        </div>
      </div>

      {/* 6 Learning Menu Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            학습 메뉴
          </h2>
          <span className="text-[11px] text-stone-700">6개 코칭 모듈</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`btn-menu-${item.id}`}
                onClick={() => onSelectCategory(item.id)}
                className="w-full bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/20 active:bg-stone-50 rounded-xl p-3.5 flex items-center justify-between gap-3 text-left transition-all shadow-2xs group cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-800">
                        {item.badge}
                      </span>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-0.5 leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Principle Guarantee Banner */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 text-[11px] text-stone-700 space-y-1">
        <p className="font-semibold text-stone-700 flex items-center gap-1">
          <span>💡</span> 서비스 핵심 원칙
        </p>
        <p className="leading-relaxed">
          AI가 학생 대신 모범답안을 써주지 않습니다. 학생이 막힐 때는 더 쉬운 보조 질문을 제시하여
          <strong>생각 → 어휘 → 문장 → 문단 → 완성된 글</strong>로 스스로 도달하도록 코칭합니다.
        </p>
      </div>
    </div>
  );
};
