import React, { useState, useEffect, useMemo } from 'react';
import { Book, BookCategory, MoodTag, ShelfStatus, UserBookEntry } from './types';
import { BOOKS_DATA, CATEGORIES } from './data/books';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MoodSelector } from './components/MoodSelector';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { TasteQuizModal } from './components/TasteQuizModal';
import { MyBookshelf } from './components/MyBookshelf';
import { Search, SlidersHorizontal, BookOpen, Heart, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'book_curator_shelf_v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'shelf'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory>('전체');
  const [selectedMood, setSelectedMood] = useState<MoodTag | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommend' | 'rating' | 'latest'>('recommend');

  // Modals
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // User Shelf entries stored in LocalStorage
  const [userEntries, setUserEntries] = useState<Record<string, UserBookEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load shelf from storage', e);
    }
    // 기본 샘플 1개 제공
    return {
      'b1': {
        bookId: 'b1',
        status: 'reading',
        userRating: 5,
        userReview: '문장이 너무 아름답고 마음에 깊이 남는다. 천천히 아껴 읽는 중.',
        updatedAt: new Date().toISOString(),
      }
    };
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userEntries));
    } catch (e) {
      console.error('Failed to save shelf', e);
    }
  }, [userEntries]);

  // Featured book for Hero Banner
  const featuredBook = useMemo(() => {
    return BOOKS_DATA[0]; // 한강 '작별하지 않는다'
  }, []);

  // Filtered and Sorted books
  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter((book) => {
      // Category filter
      if (selectedCategory !== '전체' && book.category !== selectedCategory) {
        return false;
      }
      // Mood filter
      if (selectedMood && !book.moodTags.includes(selectedMood)) {
        return false;
      }
      // Search query (title, author, publisher, keywords)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesPublisher = book.publisher.toLowerCase().includes(query);
        const matchesKeyword = book.keywords.some((kw) => kw.toLowerCase().includes(query));
        if (!matchesTitle && !matchesAuthor && !matchesPublisher && !matchesKeyword) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') return b.publishedYear - a.publishedYear;
      // Default: recommend ranking (review count + rating)
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });
  }, [selectedCategory, selectedMood, searchQuery, sortBy]);

  // Handlers for Shelf
  const handleUpdateShelf = (bookId: string, status: ShelfStatus, rating?: number, review?: string) => {
    setUserEntries((prev) => ({
      ...prev,
      [bookId]: {
        bookId,
        status,
        userRating: rating,
        userReview: review,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleRemoveFromShelf = (bookId: string) => {
    setUserEntries((prev) => {
      const copy = { ...prev };
      delete copy[bookId];
      return copy;
    });
  };

  const handleToggleBookmark = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userEntries[bookId]) {
      handleRemoveFromShelf(bookId);
    } else {
      handleUpdateShelf(bookId, 'want_to_read');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuiz={() => setIsQuizOpen(true)}
        shelfCount={Object.keys(userEntries).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {activeTab === 'explore' ? (
          <>
            {/* Hero / Daily Recommendation Banner */}
            <HeroBanner
              featuredBook={featuredBook}
              onSelectBook={setSelectedBook}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />

            {/* Mood & Situation Selector */}
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />

            {/* Search and Category Filter Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4 my-6">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="도서명, 저자, 출판사, 키워드 검색..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 placeholder:text-stone-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      지우기
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="도서 정렬 기준"
                    className="bg-stone-50 border border-stone-200 text-xs sm:text-sm rounded-xl px-3 py-2 font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    <option value="recommend">북큐레이터 추천순</option>
                    <option value="rating">평점 높은순</option>
                    <option value="latest">최신 출간순</option>
                  </select>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Cards Grid */}
            <div className="my-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-kr text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>추천 도서 목록</span>
                  <span className="text-xs font-sans font-medium text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                    {filteredBooks.length}권
                  </span>
                </h3>
                {selectedMood && (
                  <span className="text-xs text-brand-700 font-semibold bg-brand-100 px-2.5 py-1 rounded-lg">
                    #{selectedMood} 필터 적용 중
                  </span>
                )}
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
                  <p className="text-base font-semibold text-stone-700">
                    조건에 일치하는 도서를 찾을 수 없습니다.
                  </p>
                  <p className="text-xs text-stone-500">
                    검색어나 기분/카테고리 필터를 변경해 보세요.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('전체');
                      setSelectedMood(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold shadow-xs"
                  >
                    전체 도서 보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      shelfStatus={userEntries[book.id]?.status}
                      onSelectBook={setSelectedBook}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* My Bookshelf Tab */
          <div className="my-8">
            <MyBookshelf
              books={BOOKS_DATA}
              userEntries={userEntries}
              onSelectBook={setSelectedBook}
              onRemoveFromShelf={handleRemoveFromShelf}
              onGoToExplore={() => setActiveTab('explore')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-200/60 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-700 flex items-center justify-center text-white">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif-kr font-bold text-stone-800 text-sm">
              북큐레이터 (BookCurator)
            </span>
            <span className="hidden sm:inline">| 감성과 취향을 담은 스마트 도서 추천</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600 font-medium">
            <button onClick={() => setIsQuizOpen(true)} className="hover:text-brand-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              취향 테스트
            </button>
            <button onClick={() => setActiveTab('shelf')} className="hover:text-brand-700">
              내 서재
            </button>
            <span className="flex items-center gap-1 text-stone-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for book lovers
            </span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        userEntry={selectedBook ? userEntries[selectedBook.id] : undefined}
        onClose={() => setSelectedBook(null)}
        onUpdateShelf={handleUpdateShelf}
        onRemoveFromShelf={handleRemoveFromShelf}
      />

      {/* Taste Quiz Modal */}
      <TasteQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectBook={setSelectedBook}
      />
    </div>
  );
};

export default App;
