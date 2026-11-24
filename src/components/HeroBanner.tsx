import React from 'react';
import { Book } from '../types';
import { Sparkles, Quote, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  featuredBook: Book;
  onSelectBook: (book: Book) => void;
  onOpenQuiz: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredBook,
  onSelectBook,
  onOpenQuiz,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d241e] via-[#43352b] to-[#1f1915] text-white p-6 sm:p-10 lg:p-12 shadow-xl my-6">
      {/* Background subtle decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline and Call-to-action */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-400/20 text-brand-200 text-xs sm:text-sm font-medium border border-brand-400/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>오늘 당신의 마음에 머물 한 줄</span>
          </div>

          <h1 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-amber-50">
            어떤 문장이 지금의 당신을 <br className="hidden sm:inline" />
            <span className="text-amber-300 underline decoration-amber-400/40 underline-offset-8">
              위로할 수 있을까요?
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
            수많은 책 속에서 방황하지 마세요. 오늘의 기분, 지친 정도, 당신이 찾는 이야기의 호흡을 고려해 가장 적절한 책을 선물하듯 건네드립니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuiz}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-400 to-amber-500 hover:from-brand-300 hover:to-amber-400 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-900/30 flex items-center gap-2 transition-all duration-200 hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>30초 취향 추천 테스트</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-stone-400 pl-1">
              * 가벼운 3가지 질문으로 나만의 책 찾기
            </span>
          </div>
        </div>

        {/* Right Column: Featured Book Card */}
        <div className="lg:col-span-5">
          <div 
            onClick={() => onSelectBook(featuredBook)}
            className="group cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex gap-4 sm:gap-5 items-start">
              <div className="w-24 sm:w-28 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-white/20 relative">
                <img
                  src={featuredBook.coverImage}
                  alt={featuredBook.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-1 left-1 bg-amber-500 text-stone-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                  오늘의 책
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    {featuredBook.category}
                  </span>
                  <span className="text-xs text-stone-400">
                    ★ {featuredBook.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="font-serif-kr text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {featuredBook.title}
                </h3>
                <p className="text-xs text-stone-300">
                  {featuredBook.author} · {featuredBook.publisher}
                </p>

                <div className="pt-2">
                  <div className="flex items-start gap-1.5 text-xs text-amber-100/90 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <Quote className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">"{featuredBook.quote}"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
