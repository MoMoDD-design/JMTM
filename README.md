
# 🇯🇵 日文菜單翻譯官 (JP Menu Translator)

這是一個專為日本旅遊設計的網頁應用程式，可以拍照辨識日文菜單（支援手寫體）並翻譯成中文，還能協助記錄點餐內容。

## 🚀 快速部署到 Vercel

1. 將此倉庫推送到 GitHub。
2. 在 [Vercel](https://vercel.com) 導入此項目。
3. 在 Environment Variables 設定 `API_KEY` (取得來源：[Google AI Studio](https://aistudio.google.com/))。
4. 點擊 Deploy 即可完成。

## 📱 iPhone 使用建議

1. 使用 Safari 開啟部署後的網址。
2. 點擊「分享」>「加入主畫面」。
3. 即可像原生 App 一樣全螢幕使用。

## 🛠 技術棧
- React 19
- Google Gemini 3 Flash (AI 辨識與翻譯)
- Tailwind CSS (介面美化)
- Vite (建構工具)
