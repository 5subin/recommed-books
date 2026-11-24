import React from 'react';
import { Book, ShelfStatus } from '../types';
import { Star, Bookmark, Quote } from 'lucide-react';

interface BookCardProps {
  book: Book;
  shelfStatus?: ShelfStatus;
  onSelectBook: (book: Book) => void;
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  shelfStatus,
  onSelectBook,
  onToggleBookmark,
}) => {
  return (
    <div
      onClick={() => onSelectBook(book)}
      className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-brand-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Top Cover Image Area */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 shadow-xs">
            {book.category}
          </span>
        </div>

        {/* Bookmark Quick Action Button */}
        <button
          onClick={(e) => onToggleBookmark(book.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-200 ${
            shelfStatus
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={shelfStatus ? '서재에 저장됨' : '내 서재에 담기'}
        >
          <Bookmark className={`w-4 h-4 ${shelfStatus ? 'fill-current' : ''}`} />
        </button>

        {/* Rating on cover bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-semibold drop-shadow">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{book.rating.toFixed(1)}</span>
          <span className="text-stone-300 text-[10px]">({book.reviewCount})</span>
        </div>
      </div>

      {/* Book Information Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-serif-kr text-base sm:text-lg font-bold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            {book.author} · {book.publisher}
          </p>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
            {book.description}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          {/* Quote Preview */}
          <div className="flex items-start gap-1 text-[11px] text-stone-500 italic bg-brand-50/60 p-2 rounded-lg border border-brand-100/60">
            <Quote className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{book.quote}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {book.moodTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
