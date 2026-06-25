# 噬魂天堂官網 — 專案品牌規範

## 品牌資訊
- 名稱：噬魂天堂 SOUL DEVOURER · LINEAGE
- 版本：3.81
- 風格：暗黑帝王哥德風、石碑浮雕質感
- 標語：黑暗吞噬 ✦ 靈魂永恆

## 色系（嚴格遵守 style.css :root 變數）
- 背景：#04030a ~ #0e0a1e（極深紫黑）
- 帝王金：#d4a820（主色）/ #ffe060（亮金）/ #7a6018（暗金）
- 血紅：#cc0000（強調）/ #ff2424（亮紅）
- 噬魂紫：#7a00cc（第三色）/ #b040ff（亮紫）
- 文字亮色：#fff4b8（標題）/ #e8d090（正文）
- 文字暗色：#a07840（次要）/ #5a4020（最暗，僅用於極次要提示）

## 字體
- 中文標題：Noto Serif TC（900 weight）
- 英文裝飾：Cinzel（serif）
- NEVER 使用 Inter、Roboto、sans-serif 等現代無襯線字體

## 設計禁令
- NEVER 使用白色或淺色背景
- NEVER 使用圓角卡片（border-radius 最大 4px）
- NEVER 使用可愛、卡通、扁平風格
- NEVER 在深色背景上用 --text-muted(#5a4020) 當主要文字
- 背景區塊必須實色，禁止低 opacity 透明背景（最低 0.8）
- 新增 CSS 類別名稱必須加前綴，避免與 style.css 衝突

## 視覺元素
- 邊框：金紅漸層線條
- 光效：金色/紅色/紫色 glow、text-shadow
- 裝飾：◆ 菱形符號、✦ 分隔符、盧恩文字風
- 卡片：#120e24 → #0c0818 漸層背景 + #1e1630 邊框
- 按鈕：斜切 clip-path 造型

## 素材位置
- Logo：assets/images/logo-circle.jpg
- 英雄橫幅：assets/images/hero-banner.jpg
- 品牌設計稿：噬魂天堂/ 資料夾（11 張角色立繪+Logo+橫幅）
- 道具圖檔：桌面/道具圖檔2/{編碼}.png（共 10,502 張，檔名=圖片編碼）
- 引用方式：複製到 assets/images/item-{編碼}.png，HTML 用 `<img src="../assets/images/item-{編碼}.png">`
- 編碼來源：桌面/天堂更新檔/ 修改歷程 txt

## 頁面結構
- 首頁：index.html
- 子頁面：pages/ 資料夾
- 共用 CSS：assets/css/style.css
- 共用 JS：assets/js/main.js
- 子頁面引用路徑用 ../assets/

## 參考競品風格
- 神說天堂 godhash.vip — 設計感最好，金黑配色+影片背景+沉浸式
- 曜舞天堂 — 影片背景 Hero、職業輪播、效能優化意識好
- 普遍私服官網 — 深色+金色主調、卡片式排版、固定導航

## 未來官網方向（參考 maplestory113.com 活動頁風格）
- **內容呈現**：用大張設計圖+遊戲截圖說明，不要純文字表格
- **活動/公告頁排版**：全幅設計圖 Banner → 簡短文字說明 → 圖片展示獎勵內容
- **圖片優先**：道具、NPC、地圖截圖直接嵌入，搭配簡短文字，讓玩家一眼看懂
- **icon 全用遊戲素材圖**：從 桌面/道具圖檔2/ 抓對應編碼圖片，不用 emoji 或符號字元
- **風格關鍵字**：圖文並茂、視覺導向、玩家友善、像遊戲內公告的延伸

## 寵物系統 icon
- 項圈：item-1617.png（已備好，等寵物頁面更新時使用）
