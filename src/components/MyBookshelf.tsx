import React, { useState } from 'react';
import { Book, ShelfStatus, UserBookEntry } from '../types';
import { Star, Bookmark, BookOpen, CheckCircle, Clock, Trash2, Edit3 } from 'lucide-react';

interface MyBookshelfProps {
  books: Book[];
  userEntries: Record<string, UserBookEntry>;
  onSelectBook: (book: Book) => void;
  onRemoveFromShelf: (bookId: string) => void;
  onGoToExplore: () => void;
}

export const MyBookshelf: React.FC<MyBookshelfProps> = ({
  books,
  userEntries,
  onSelectBook,
  onRemoveFromShelf,
  onGoToExplore,
}) => {
  const [filterStatus, setFilterStatus] = useState<ShelfStatus | 'all'>('all');

  const entriesList = Object.values(userEntries);
  const totalCount = entriesList.length;
  const completedCount = entriesList.filter((e) => e.status === 'completed').length;
  const readingCount = entriesList.filter((e) => e.status === 'reading').length;
  const wantCount = entriesList.filter((e) => e.status === 'want_to_read').length;

  const filteredEntries = entriesList.filter((entry) => {
    if (filterStatus === 'all') return true;
    return entry.status === filterStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Shelf Header & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-kr text-2xl sm:text-3xl font-bold text-stone-900">
              나만의 서재
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              마음에 담아둔 책들과 독서의 여정을 한곳에서 기록합니다.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="px-4 py-2.5 rounded-2xl bg-brand-50 border border-brand-100 text-center">
              <span className="block text-xs text-brand-700 font-semibold">전체 보관</span>
              <span className="font-bold text-base text-brand-900">{totalCount}권</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="block text-xs text-amber-700 font-semibold">읽는 중</span>
              <span className="font-bold text-base text-amber-900">{readingCount}권</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="block text-xs text-emerald-700 font-semibold">완독</span>
              <span className="font-bold text-base text-emerald-900">{completedCount}권</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-stone-100 pt-4 overflow-x-auto">
          {[
            { id: 'all', label: `전체 (${totalCount})`, icon: Bookmark },
            { id: 'want_to_read', label: `읽고 싶어요 (${wantCount})`, icon: Clock },
            { id: 'reading', label: `읽는 중 (${readingCount})`, icon: BookOpen },
            { id: 'completed', label: `완독 (${completedCount})`, icon: CheckCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilterStatus(id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filterStatus === id
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Book List / Cards */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-serif-kr text-lg font-bold text-stone-800">
            아직 서재에 담긴 책이 없습니다
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            취향에 맞는 책을 찾아 북마크하거나, 직접 읽고 있는 책의 독서 메모를 남겨보세요.
          </p>
          <button
            onClick={onGoToExplore}
            className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            책 둘러보러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => {
            const book = books.find((b) => b.id === entry.bookId);
            if (!book) return null;

            return (
              <div
                key={entry.bookId}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-brand-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex gap-4 group"
              >
                {/* Book Cover */}
                <div 
                  onClick={() => onSelectBook(book)}
                  className="w-20 sm:w-24 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow cursor-pointer relative"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info & Notes */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        entry.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'reading'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {entry.status === 'completed' ? '완독' : entry.status === 'reading' ? '읽는 중' : '읽고 싶음'}
                      </span>

                      {/* Delete Action */}
                      <button
                        onClick={() => onRemoveFromShelf(book.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                        title="서재에서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 
                      onClick={() => onSelectBook(book)}
                      className="font-serif-kr text-sm sm:text-base font-bold text-stone-900 hover:text-brand-700 truncate cursor-pointer"
                    >
                      {book.title}
                    </h4>
                    <p className="text-xs text-stone-500 truncate">
                      {book.author}
                    </p>

                    {/* User Rating */}
                    {entry.userRating && (
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{entry.userRating}점</span>
                      </div>
                    )}

                    {/* User Review Memo */}
                    {entry.userReview && (
                      <div className="mt-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-700 line-clamp-2">
                        <span className="font-semibold text-stone-900 mr-1">내 메모:</span>
                        {entry.userReview}
                      </div>
                    )}
                  </div>

                  {/* Bottom Edit Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onSelectBook(book)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-800 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>메모 및 상태 수정</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
