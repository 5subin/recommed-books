export type BookCategory = 
  | '전체'
  | '소설/문학'
  | '인문/철학'
  | '자기계발/동기부여'
  | '과학/IT'
  | '에세이/시'
  | '경제/경영';

export type MoodTag = 
  | '위로와 힐링'
  | '몰입감 최고'
  | '새로운 영감'
  | '마음의 평온'
  | '지적 자극'
  | '동기부여 뿜뿜'
  | '퇴근길 가벼운 한편';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: BookCategory;
  coverImage: string;
  rating: number; // 1.0 ~ 5.0
  reviewCount: number;
  publishedYear: number;
  pages: number;
  quote: string; // 책 속의 한 줄
  description: string;
  recommendReason: string;
  moodTags: MoodTag[];
  keywords: string[];
}

export type ShelfStatus = 'want_to_read' | 'reading' | 'completed';

export interface UserBookEntry {
  bookId: string;
  status: ShelfStatus;
  userRating?: number;
  userReview?: string;
  updatedAt: string;
}

export interface QuizAnswer {
  mood?: MoodTag;
  pace?: '빠른 전개' | '잔잔하고 깊은 사유' | '실용적인 팁';
  genre?: BookCategory;
}
