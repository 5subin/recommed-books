import React from 'react';
import { MOOD_TAGS } from '../data/books';
import { MoodTag } from '../types';

interface MoodSelectorProps {
  selectedMood: MoodTag | null;
  onSelectMood: (mood: MoodTag | null) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          오늘의 기분 & 상황별 큐레이션
        </h2>
        {selectedMood && (
          <button
            onClick={() => onSelectMood(null)}
            className="text-xs text-brand-600 hover:text-brand-800 underline font-medium"
          >
            필터 초기화
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {MOOD_TAGS.map(({ tag, emoji, desc }) => {
          const isSelected = selectedMood === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectMood(isSelected ? null : (tag as MoodTag))}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-700 text-white border-brand-800 shadow-md scale-105'
                  : 'bg-white hover:bg-brand-50 text-stone-700 border-stone-200 hover:border-brand-300 shadow-xs'
              }`}
              title={desc}
            >
              <span className="text-base">{emoji}</span>
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
