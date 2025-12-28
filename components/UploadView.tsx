
import React, { useRef } from 'react';

interface UploadViewProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // result 格式為 "data:image/jpeg;base64,....."
      const base64 = result.split(',')[1];
      // 傳遞 base64 與真實的 mimeType
      onImageSelected(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">開始點餐</h2>
        <p className="text-gray-500">拍攝或上傳日文菜單，即使是手寫也可以辨識。</p>
      </div>

      <div className="w-full max-w-sm">
        <label 
          htmlFor="camera-input" 
          className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-red-300 rounded-2xl bg-red-50 cursor-pointer hover:bg-red-100 hover:border-red-400 transition-all duration-300 shadow-sm"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <p className="mb-2 text-sm font-semibold text-gray-700">點擊拍攝或上傳照片</p>
            <p className="text-xs text-gray-500">支援相機拍照或相簿選擇</p>
          </div>
          <input 
            id="camera-input" 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
      </div>

      {/* iOS 安裝教學提示 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-sm w-full text-left">
        <h4 className="text-blue-800 font-bold text-sm flex items-center gap-1 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          iPhone 使用小技巧
        </h4>
        <p className="text-blue-700 text-xs leading-relaxed">
          點擊 Safari 下方的「分享」按鈕 <span className="inline-block px-1 border border-blue-300 rounded">󰈙</span>，選擇「<strong>加入主畫面</strong>」，即可像 App 一樣全螢幕使用且更方便開啟！
        </p>
      </div>

      <div className="text-xs text-gray-400 max-w-xs">
        Powered by Gemini 3 Flash
      </div>
    </div>
  );
};
