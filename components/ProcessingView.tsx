import React from 'react';

export const ProcessingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 px-6 text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">
          🍣
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">正在解讀菜單...</h3>
        <p className="text-gray-500 text-sm">Gemini 正在努力辨識日文與翻譯中<br/>請稍候約 5-10 秒</p>
      </div>
    </div>
  );
};