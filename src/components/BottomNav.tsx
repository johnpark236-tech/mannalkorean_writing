import React from "react";
import { Home, Edit3, FolderCheck, BarChart3 } from "lucide-react";

export type NavTab = "home" | "practice" | "my_writings" | "analytics";

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: "home" as NavTab, label: "홈", icon: Home },
    { id: "practice" as NavTab, label: "연습", icon: Edit3 },
    { id: "my_writings" as NavTab, label: "나의 글", icon: FolderCheck },
    { id: "analytics" as NavTab, label: "학습 기록", icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-md safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`btn-bottom-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[64px] min-h-[48px] rounded-lg transition-all cursor-pointer ${
                isActive
                  ? "text-emerald-700 font-semibold"
                  : "text-stone-500 hover:text-stone-700 font-normal"
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? "bg-emerald-50 scale-110" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-stone-700"}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
