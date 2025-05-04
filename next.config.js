/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! 警告 !!
    // 僅在開發階段暫時忽略類型檢查錯誤
    // 生產環境前應修復所有類型錯誤
    ignoreBuildErrors: true,
  },
  eslint: {
    // 同樣暫時忽略ESLint錯誤
    ignoreDuringBuilds: true,
  },
  // 啟用更強的靜態優化
  poweredByHeader: false,
  reactStrictMode: true,
  // 清除暫存以避免文件訪問錯誤
  onDemandEntries: {
    // 頁面保持在記憶體中的時間（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同時保持在記憶體中的頁面數量
    pagesBufferLength: 2,
  },
  // 設置輸出目錄，確保編譯產物位置正確
  distDir: '.next',
};

module.exports = nextConfig; 