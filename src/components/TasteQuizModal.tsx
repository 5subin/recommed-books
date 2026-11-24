import React, { useState } from 'react';
import { Book, MoodTag, BookCategory } from '../types';
import { BOOKS_DATA, MOOD_TAGS } from '../data/books';
import { X, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface TasteQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const TasteQuizModal: React.FC<TasteQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectBook,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<MoodTag | null>(null);
  const [selectedPace, setSelectedPace] = useState<'fast' | 'slow' | 'practical' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(null);
  const [resultBooks, setResultBooks] = useState<Book[]>([]);

  const handleNext = () => {
    if (step === 1 && selectedMood) {
      setStep(2);
    } else if (step === 2 && selectedPace) {
      setStep(3);
    } else if (step === 3 && selectedCategory) {
      // Calculate matching books
      calculateResults();
      setStep(4);
    }
  };

  const calculateResults = () => {
    // Scoring system based on user answers
    const scored = BOOKS_DATA.map((book) => {
      let score = 0;
      if (selectedMood && book.moodTags.includes(selectedMood)) {
        score += 5;
      }
      if (selectedCategory && (selectedCategory === '전체' || book.category === selectedCategory)) {
        score += 4;
      }
      if (selectedPace === 'fast' && book.moodTags.includes('몰입감 최고')) {
        score += 3;
      }
      if (selectedPace === 'slow' && (book.moodTags.includes('마음의 평온') || book.moodTags.includes('위로와 힐링'))) {
        score += 3;
      }
      if (selectedPace === 'practical' && (book.category === '자기계발/동기부여' || book.category === '경제/경영')) {
        score += 3;
      }
      return { book, score };
    });

    scored.sort((a, b) => b.score - a.score || b.book.rating - a.book.rating);
    setResultBooks(scored.slice(0, 3).map((item) => item.book));
  };

  const handleReset = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedPace(null);
    setSelectedCategory(null);
    setResultBooks([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#fbf9f6] rounded-3xl shadow-2xl border border-brand-200 overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-bold text-stone-900">
                AI 취향 맞춤 도서 진단
              </h3>
              <p className="text-xs text-stone-500">
                {step <= 3 ? `${step} / 3 단계` : '분석 완료!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-6">
          {/* Step 1: Mood */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-serif-kr text-base sm:text-lg font-semibold text-stone-800">
                Q1. 오늘 하루, 당신의 마음 상태나 원하는 분위기는?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOOD_TAGS.map(({ tag, emoji, desc }) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedMood(tag as MoodTag)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      selectedMood === tag
                        ? 'bg-brand-700 text-white border-brand-800 shadow-md'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <div className="font-bold text-sm">{tag}</div>
                      <div className={`text-xs mt-0.5 ${selectedMood === tag ? 'text-amber-100' : 'text-stone-500'}`}>
                        {desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pace */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-serif-kr text-base sm:text-lg font-semibold text-stone-800">
                Q2. 책을 읽을 때 어떤 호흡이나 방식을 선호하시나요?
              </h4>
              <div className="space-y-3">
                {[
                  { id: 'fast', title: '숨 가쁘고 빠른 전개', desc: '한번 읽기 시작하면 끝까지 멈출 수 없는 강한 몰입감' },
                  { id: 'slow', title: '잔잔하고 깊은 사유', desc: '문장 하나하나를 곱씹으며 마음을 차분히 정리하는 시간' },
                  { id: 'practical', title: '실질적인 인사이트와 배움', desc: '내 일과 삶에 즉시 적용할 수 있는 유용한 지식과 조언' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPace(item.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedPace === item.id
                        ? 'bg-brand-700 text-white border-brand-800 shadow-md'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="font-bold text-sm sm:text-base">{item.title}</div>
                    <div className={`text-xs mt-1 ${selectedPace === item.id ? 'text-amber-100' : 'text-stone-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Category */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-serif-kr text-base sm:text-lg font-semibold text-stone-800">
                Q3. 가장 손이 먼저 가는 관심 분야는 무엇인가요?
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  '전체 (장르 무관)',
                  '소설/문학',
                  '인문/철학',
                  '자기계발/동기부여',
                  '과학/IT',
                  '경제/경영',
                ].map((cat) => {
                  const val = cat.startsWith('전체') ? '전체' : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(val as BookCategory)}
                      className={`p-3.5 rounded-xl border text-center font-medium text-sm transition-all ${
                        selectedCategory === val
                          ? 'bg-brand-700 text-white border-brand-800 shadow-md'
                          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 text-brand-800">
                  매칭 결과
                </span>
                <h4 className="font-serif-kr text-xl font-bold text-stone-900 mt-2">
                  당신을 위해 선별된 맞춤 도서
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  선택하신 취향에 가장 높은 연관성을 지닌 추천 도서 목록입니다.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {resultBooks.map((book, idx) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      onClose();
                      onSelectBook(book);
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-brand-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-xs">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          추천 #{idx + 1}
                        </span>
                        <span className="text-xs text-stone-500">{book.category}</span>
                      </div>
                      <h5 className="font-serif-kr font-bold text-sm text-stone-900 group-hover:text-brand-700 truncate">
                        {book.title}
                      </h5>
                      <p className="text-xs text-stone-500 truncate">{book.author}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-medium text-stone-500 hover:text-stone-800"
            >
              이전 질문
            </button>
          ) : step === 4 ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 진단하기
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedMood) ||
                (step === 2 && !selectedPace) ||
                (step === 3 && !selectedCategory)
              }
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>다음</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              확인 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
