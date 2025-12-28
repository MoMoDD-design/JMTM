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
        throw new Error("無法辨識出任何菜單項目，請更換照片角度或亮度後重試。");
      }
      setMenuItems(items);
      setAppState(AppState.MENU);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "發生錯誤，請稍後再試");
      setAppState(AppState.UPLOAD); // Go back to upload but show error
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
      if (window.confirm("確定要放棄目前的菜單嗎？")) {
        setAppState(AppState.UPLOAD);
        setCart({});
        setMenuItems([]);
      }
    }
  };

  const resetApp = () => {
    if (window.confirm("確定要結束並開始新訂單嗎？")) {
      setAppState(AppState.UPLOAD);
      setCart({});
      setMenuItems([]);
      setErrorMsg(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800">
      {appState !== AppState.SUMMARY && (
        <Header state={appState} onBack={handleBack} />
      )}

      <main className="max-w-3xl mx-auto w-full">
        {errorMsg && appState === AppState.UPLOAD && (
          <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
            <span className="font-bold">錯誤：</span> {errorMsg}
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
            onReset={resetApp}
            onEdit={() => setAppState(AppState.MENU)}
          />
        )}
      </main>
    </div>
  );
};

export default App;