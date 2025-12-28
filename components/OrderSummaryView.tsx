import React from 'react';
import { MenuItem, Cart } from '../types';

interface OrderSummaryViewProps {
  items: MenuItem[];
  cart: Cart;
  onReset: () => void;
  onEdit: () => void;
}

export const OrderSummaryView: React.FC<OrderSummaryViewProps> = ({ items, cart, onReset, onEdit }) => {
  const selectedItems = items.filter(item => (cart[item.id] || 0) > 0);
  
  // Calculate total if all prices are numeric
  let totalPrice = 0;
  let isApproximate = false;
  
  selectedItems.forEach(item => {
    const qty = cart[item.id];
    const priceClean = item.price.replace(/[^0-9]/g, '');
    if (priceClean && !isNaN(parseInt(priceClean))) {
      totalPrice += parseInt(priceClean) * qty;
    } else {
      isApproximate = true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <div className="p-6 bg-white shadow-sm border-b border-gray-200">
        <h2 className="text-center text-gray-500 text-sm mb-1">請向店員出示此畫面</h2>
        <h1 className="text-center text-2xl font-bold text-gray-900">注文リスト (Order List)</h1>
      </div>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {selectedItems.map((item, idx) => (
            <div key={item.id} className={`p-4 flex justify-between items-center ${idx !== selectedItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-900 font-jp mb-1">{item.name_jp}</p>
                <p className="text-sm text-gray-400">{item.name_zh}</p>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span className="text-gray-400 text-sm">x</span>
                <span className="text-3xl font-bold text-red-600 font-mono">{cart[item.id]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-md">
          <div className="flex justify-between items-end">
            <span className="text-gray-400">合計金額 (参考)</span>
            <span className="text-3xl font-bold font-mono">
              ¥{totalPrice.toLocaleString()}
              {isApproximate && <span className="text-sm text-gray-400 ml-1">+?</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex gap-4 max-w-lg mx-auto w-full z-50">
        <button 
          onClick={onEdit}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
        >
          修改訂單
        </button>
        <button 
          onClick={onReset}
          className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
        >
          結束/新訂單
        </button>
      </div>
    </div>
  );
};