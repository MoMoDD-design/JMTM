import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  state: AppState;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onBack }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 pt-10 pb-3 flex items-center justify-between shadow-sm safe-top">
      <div className="flex items-center gap-2">
        {state !== AppState.UPLOAD && state !== AppState.PROCESSING && (
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}
        <h1 className="font-bold text-lg text-red-600 tracking-tight flex items-center gap-2">
          <span className="text-xl">🇯🇵</span> 日文菜單翻譯
        </h1>
      </div>
    </header>
  );
};