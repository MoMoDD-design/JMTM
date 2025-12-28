
import React, { useState, useCallback, useEffect } from 'react';
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
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  // 檢查環境變數是否正確注入
  useEffect(() => {
    const key = process.env.API_KEY;
    if (!key || key === 'undefined' || key.length < 10) {
      setIsKeyMissing(true);
    }
  }, []);

  const handleImageSelected = useCallback(async (base64: string, mimeType: string) => {
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);
    try {
      const items = await parseMenuImage(base64, mimeType);
      if (items.length === 0) {
        throw new Error("無法辨識出任何菜單項目，請換張照片試試。");
      }
      setMenuItems(items);
      setAppState(AppState.MENU);
    } catch (e: any) {
      console.error(e);
      // 直接顯示原始錯誤訊息，幫助使用者判斷是網路問題還是 API 問題
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

  // 如果金鑰缺失，顯示引導畫面
  if (isKeyMissing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm border border-red-100">
          <div className="text-5xl mb-4">🔑</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">API Key 尚未生效</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            雖然您可能在 Vercel 設定了變數，但網頁需要 **「重新編譯」** 才能把金鑰嵌入進去。
          </p>
          <div className="text-left bg-gray-50 p-4 rounded-xl text-xs text-gray-500 mb-6 space-y-2">
            <p className="font-bold text-gray-700">修正步驟：</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>前往 Vercel 專案的 <b>Deployments</b> 分頁。</li>
              <li>找到最上方的部署項目。</li>
              <li>點擊右側 <b>...</b> 並選擇 <b>Redeploy</b>。</li>
              <li>完成後重新整理此頁面。</li>
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
          >
            我已重新部署，點此重整
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800">
      {appState !== AppState.SUMMARY && (
        <Header state={appState} onBack={handleBack} />
      )}

      <main className="max-w-3xl mx-auto w-full">
        {errorMsg && (
          <div className="m-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2 animate-pulse">
            <span className="text-lg">⚠️</span>
            <div className="break-all">{errorMsg}</div>
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
