import React from 'react';
import { MenuItem, Cart } from '../types';

interface MenuViewProps {
  items: MenuItem[];
  cart: Cart;
  onUpdateQuantity: (id: string, delta: number) => void;
  onReviewOrder: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ items, cart, onUpdateQuantity, onReviewOrder }) => {
  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="pb-24">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 pl-2 border-l-4 border-red-500">
          翻譯菜單 ({items.length})
        </h2>
        
        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">沒有找到菜單項目。請重試。</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all ${qty > 0 ? 'ring-2 ring-red-500 border-transparent' : ''}`}>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name_zh}</h3>
                      <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700 whitespace-nowrap ml-2">
                        {item.price === '-' ? '時價' : `¥${item.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 font-jp">{item.name_jp}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 bg-gray-50 p-2 rounded">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end items-center gap-3">
                    {qty > 0 && (
                      <>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
                        >
                          -
                        </button>
                        <span className="font-bold text-lg w-6 text-center">{qty}</span>
                      </>
                    )}
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className={`h-8 px-4 flex items-center justify-center rounded-full active:scale-95 transition-all ${qty > 0 ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {qty > 0 ? '+' : '加入'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40">
          <button 
            onClick={onReviewOrder}
            className="w-full max-w-md bg-gray-900 text-white shadow-xl rounded-2xl py-4 px-6 flex items-center justify-between hover:bg-gray-800 transition-colors active:scale-95"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-400">已選項目</span>
              <span className="font-bold text-lg">{totalItems} 道餐點</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-white bg-gray-800 px-4 py-2 rounded-xl">
              去結算 <span className="text-xl">→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};