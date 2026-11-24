import React from 'react';
import { BookOpen, Sparkles, Bookmark, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'shelf';
  setActiveTab: (tab: 'explore' | 'shelf') => void;
  onOpenQuiz: () => void;
  shelfCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuiz,
  shelfCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-brand-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-kr text-xl font-bold tracking-tight text-stone-900 group-hover:text-brand-700 transition-colors">
              북큐레이터
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-stone-500 bg-brand-100 px-2 py-0.5 rounded-full">
              BookCurator
            </span>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === 'explore'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>도서 탐색</span>
          </button>

          <button
            onClick={() => setActiveTab('shelf')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 relative ${
              activeTab === 'shelf'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>내 서재</span>
            {shelfCount > 0 && (
              <span className={`ml-1 text-xs px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'shelf'
                  ? 'bg-white text-brand-800'
                  : 'bg-brand-500 text-white'
              }`}>
                {shelfCount}
              </span>
            )}
          </button>

          {/* AI / Mood Quiz Trigger */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-brand-900 bg-gradient-to-r from-amber-200 via-brand-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 border border-brand-300/80 shadow-xs hover:shadow transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-brand-700 animate-pulse" />
            <span className="hidden md:inline">취향 맞춤 테스트</span>
            <span className="md:hidden">추천 테스트</span>
          </button>
        </div>
      </div>
    </header>
  );
};
