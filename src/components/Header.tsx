import React from "react";
import { KoreanLevel } from "../types";
import { BookOpen, GraduationCap, Sparkles, UserCheck } from "lucide-react";

interface HeaderProps {
  currentLevel: KoreanLevel;
  onSelectLevelClick: () => void;
  onHomeClick: () => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onSelectLevelClick,
  onHomeClick,
  isTeacherMode,
  onToggleTeacherMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <button
          id="btn-nav-home"
          onClick={onHomeClick}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-emerald-700 transition-colors">
            한
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 text-base leading-tight tracking-tight">
                한국어 글쓰기 코치
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                단계별 코칭
              </span>
            </div>
            <p className="text-[11px] text-stone-700 leading-none mt-0.5">
              생각에서 완성까지 스스로 쓰는 힘
            </p>
          </div>
        </button>

        {/* Level badge & Teacher Switch */}
        <div className="flex items-center gap-2">
          {/* Level selector button */}
          <button
            id="btn-header-level"
            onClick={onSelectLevelClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold cursor-pointer transition-all active:scale-95"
            title="나의 한국어 수준 변경"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentLevel}급 학습 중</span>
          </button>

          {/* Teacher Mode toggle */}
          <button
            id="btn-header-teacher"
            onClick={onToggleTeacherMode}
            className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              isTeacherMode
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
            title={isTeacherMode ? "학생 모드로 전환" : "선생님 메뉴"}
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
