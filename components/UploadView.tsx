
import React, { useRef, useState } from 'react';

export interface ImageData {
  id: string;
  base64: string;
  mimeType: string;
  previewUrl: string;
}

interface UploadViewProps {
  onImagesSelected: (images: { base64: string, mimeType: string }[]) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onImagesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsProcessing(true);
      const newImages: ImageData[] = [];

      // 處理所有選取的檔案
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const base64 = await readFileAsBase64(file);
          newImages.push({
            id: `img-${Date.now()}-${i}`,
            base64,
            mimeType: file.type,
            previewUrl: URL.createObjectURL(file)
          });
        } catch (e) {
          console.error("Error reading file", e);
        }
      }

      setSelectedImages(prev => [...prev, ...newImages]);
      setIsProcessing(false);
      
      // 重置 input 以便重複選取相同檔案
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // result 格式為 "data:image/jpeg;base64,....." -> 取逗號後面
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleStartAnalysis = () => {
    if (selectedImages.length === 0) return;
    onImagesSelected(selectedImages.map(({ base64, mimeType }) => ({ base64, mimeType })));
  };

  // 觸發隱藏的 file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-[85vh] px-4 pt-4 animate-fade-in relative">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">開始點餐</h2>
        <p className="text-gray-500 text-sm">
          拍攝或從相簿選擇菜單照片<br/>
          支援多頁拍攝，拍完後點擊下方按鈕開始
        </p>
      </div>

      {/* 圖片預覽區域 (Grid) */}
      <div className="flex-1 overflow-y-auto pb-32">
        {selectedImages.length === 0 ? (
          <div 
            onClick={triggerFileInput}
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-red-300 rounded-2xl bg-red-50 cursor-pointer hover:bg-red-100 transition-colors mx-4 mt-8"
          >
            <div className="p-4 bg-white rounded-full shadow-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <p className="font-bold text-gray-700">點擊新增照片</p>
            <p className="text-xs text-gray-500 mt-1">相機 / 相簿</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-2">
            {selectedImages.map((img) => (
              <div key={img.id} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            {/* 繼續新增按鈕 (Grid Item) */}
            <button 
              onClick={triggerFileInput}
              className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-sm font-bold">加拍一張</span>
            </button>
          </div>
        )}
      </div>

      {/* 底部操作區 */}
      {selectedImages.length > 0 && (
        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-20">
          <button 
            onClick={handleStartAnalysis}
            disabled={isProcessing}
            className="w-full max-w-md bg-red-600 text-white shadow-xl rounded-2xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isProcessing ? (
              <span>處理中...</span>
            ) : (
              <>
                <span className="font-bold text-lg">開始翻譯 ({selectedImages.length} 張)</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* 隱藏的 Input: 移除 capture 屬性以支援相簿 */}
      <input 
        id="camera-input" 
        type="file" 
        accept="image/*" 
        multiple
        className="hidden" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      <div className="absolute bottom-2 w-full text-center text-xs text-gray-400 pointer-events-none">
        Powered by Gemini 3 Flash
      </div>
    </div>
  );
};
