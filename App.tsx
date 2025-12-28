
import React, { useState, useCallback } from 'react';
import { AppState, MenuItem, Cart } from './types';
import { Header } from './components/Header';
import { UploadView } from './components/UploadView';
import { ProcessingView } from './components/ProcessingView';
import { MenuView } from './components/MenuView';
import { OrderSummaryView } from './components/OrderSummaryView';
import { parseMenuImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (base64: string) => {
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);
    try {
      const items = await parseMenuImage(base64);
      if (items.length === 0) {
        throw new Error("無法辨識出任何菜單項目，請換張照片試試。");
      }
      setMenuItems(items);
      setAppState(AppState.MENU);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "辨識失敗，請檢查網路或 API 設定");
      setAppState(AppState.UPLOAD);
    }
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const newCart = { ...prev, [id]: newQty };
      if (newQty === 0) delete newCart[id];
      return newCart;
    });
  };

  const handleBack = () => {
    if (appState === AppState.SUMMARY) {
      setAppState(AppState.MENU);
    } else if (appState === AppState.MENU) {
      if (window.confirm("要回上一步重新掃描嗎？目前的選擇會清除。")) {
        setAppState(AppState.UPLOAD);
        setCart({});
        setMenuItems([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800">
      {appState !== AppState.SUMMARY && (
        <Header state={appState} onBack={handleBack} />
      )}

      <main className="max-w-3xl mx-auto w-full">
        {errorMsg && (
          <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2">
            <span className="text-lg">❌</span>
            <div>{errorMsg}</div>
          </div>
        )}

        {appState === AppState.UPLOAD && (
          <UploadView onImageSelected={handleImageSelected} />
        )}

        {appState === AppState.PROCESSING && (
          <ProcessingView />
        )}

        {appState === AppState.MENU && (
          <MenuView 
            items={menuItems} 
            cart={cart} 
            onUpdateQuantity={handleUpdateQuantity}
            onReviewOrder={() => setAppState(AppState.SUMMARY)}
          />
        )}

        {appState === AppState.SUMMARY && (
          <OrderSummaryView 
            items={menuItems} 
            cart={cart} 
            onReset={() => {
              if (window.confirm("確定要開始新訂單嗎？")) {
                setAppState(AppState.UPLOAD);
                setCart({});
                setMenuItems([]);
              }
            }}
            onEdit={() => setAppState(AppState.MENU)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
