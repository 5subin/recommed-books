import React, { useState, useEffect } from 'react';
import { Book, ShelfStatus, UserBookEntry } from '../types';
import { X, Star, Bookmark, Quote, Check, Calendar, FileText } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  userEntry?: UserBookEntry;
  onClose: () => void;
  onUpdateShelf: (bookId: string, status: ShelfStatus, rating?: number, review?: string) => void;
  onRemoveFromShelf: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  userEntry,
  onClose,
  onUpdateShelf,
  onRemoveFromShelf,
}) => {
  if (!book) return null;

  const [currentStatus, setCurrentStatus] = useState<ShelfStatus>(userEntry?.status || 'want_to_read');
  const [userRating, setUserRating] = useState<number>(userEntry?.userRating || 5);
  const [userReview, setUserReview] = useState<string>(userEntry?.userReview || '');
  const [isSaved, setIsSaved] = useState<boolean>(!!userEntry);

  useEffect(() => {
    if (userEntry) {
      setCurrentStatus(userEntry.status);
      setUserRating(userEntry.userRating || 5);
      setUserReview(userEntry.userReview || '');
      setIsSaved(true);
    } else {
      setIsSaved(false);
      setUserReview('');
    }
  }, [userEntry, book]);

  const handleSaveToShelf = () => {
    onUpdateShelf(book.id, currentStatus, userRating, userReview);
    setIsSaved(true);
  };

  const handleRemove = () => {
    onRemoveFromShelf(book.id);
    setIsSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#fbf9f6] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header section: Book Cover & Basic Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-4 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-800">
                  {book.category}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {book.publishedYear}년 출간
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {book.pages}쪽
                </span>
              </div>

              <h2 className="font-serif-kr text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {book.title}
              </h2>

              <p className="text-sm text-stone-600 font-medium">
                {book.author} 저 · {book.publisher}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(book.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">
                  ({book.reviewCount}개의 독자 리뷰)
                </span>
              </div>

              {/* Quote Highlight */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 relative">
                <Quote className="w-4 h-4 text-amber-600 absolute top-3 left-3 opacity-60" />
                <p className="font-serif-kr text-sm italic text-stone-800 pl-5 leading-relaxed">
                  "{book.quote}"
                </p>
              </div>
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* Description & Recommend Reason */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                책 소개
              </h4>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
                북큐레이터의 추천 포인트
              </h4>
              <p className="text-sm text-brand-900 leading-relaxed">
                {book.recommendReason}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {book.moodTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-stone-200/70 text-stone-700"
                >
                  #{tag}
                </span>
              ))}
              {book.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-normal px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-500"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* My Bookshelf Form Area */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-600" />
                <span>내 서재 관리</span>
              </h3>
              {isSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  서재에 등록됨
                </span>
              )}
            </div>

            {/* Status radio buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { status: 'want_to_read', label: '읽고 싶어요' },
                { status: 'reading', label: '읽는 중' },
                { status: 'completed', label: '완독했어요' },
              ].map(({ status, label }) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCurrentStatus(status as ShelfStatus)}
                  className={`py-2 px-3 text-xs sm:text-sm rounded-xl font-medium border transition-all ${
                    currentStatus === status
                      ? 'bg-brand-700 text-white border-brand-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Rating selector (especially when reading or completed) */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-stone-500 font-medium">나만의 별점:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-700">{userRating}점</span>
            </div>

            {/* Note/Review textarea */}
            <div>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="책을 읽고 느낀 점이나 마음에 남는 문장을 가볍게 기록해보세요..."
                rows={3}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              {isSaved && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  서재에서 제거
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveToShelf}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                {isSaved ? '서재 기록 수정' : '내 서재에 저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
