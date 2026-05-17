# 北千住 下り時刻表アプリ 設計書 v1.0.0

## 1. 概要

| 項目 | 内容 |
|------|------|
| アプリ名 | 北千住 下り時刻表 |
| 対象路線 | 東京メトロ千代田線 |
| 対象駅 | 北千住駅（H22 / C18） |
| 方向 | 下り（綾瀬・北綾瀬・松戸・柏・取手・我孫子方面） |
| リポジトリURL | https://github.com/nui1971/kitasenju-timetable |

---

## 2. 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | React 19 |
| 言語 | TypeScript |
| ビルドツール | Vite 8 |
| CSSフレームワーク | Tailwind CSS v3 |
| テスト | Vitest + React Testing Library |
| デプロイ | Vercel |

---

## 3. ファイル構成

```
kitasenju-timetable/
├── index.html                  # アプリエントリ（PWA metaタグ含む）
├── package.json
├── vite.config.ts              # Vitest設定含む
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── docs/
│   └── design.md              # 本設計書
├── public/
│   ├── manifest.json          # PWAマニフェスト
│   └── icons/
│       ├── icon-192.svg       # PWAアイコン 192x192
│       └── icon-512.svg       # PWAアイコン 512x512（maskable）
└── src/
    ├── main.tsx               # Reactルート
    ├── App.tsx                # メインコンポーネント
    ├── index.css              # Tailwindディレクティブ + body スタイル
    ├── timetable.ts           # 時刻表データ（WEEKDAY/HOLIDAY）
    ├── utils/
    │   └── timeUtils.ts       # 時刻変換ユーティリティ
    └── test/
        ├── setup.ts           # テストセットアップ（jest-dom）
        ├── timetable.test.ts  # 時刻表データのテスト
        ├── timeUtils.test.ts  # ユーティリティのテスト
        └── App.test.tsx       # コンポーネントのテスト
```

---

## 4. 機能仕様

### 4.1 時刻表表示
- 現在時刻以降の列車を全件表示する
- 過去の列車は直近3本のみ薄く（opacity-35）表示する
- 次の電車をヘッダーのバナー（緑背景）でハイライト表示する
- 「あとN分」で次の電車までの待ち時間を表示する

### 4.2 ダイヤ自動切替（平日/土休日）
- `getDay()` の返り値で判定する
  - 0（日曜）または 6（土曜）→ 土休日ダイヤ（HOLIDAY）
  - 1〜5（月〜金）→ 平日ダイヤ（WEEKDAY）
- 10秒ごとに時刻を自動更新する

### 4.3 フィルター機能
- 「北綾瀬行きのみ」ボタンで北綾瀬行きのみ表示するフィルターをトグルする
- フィルター状態は `localStorage`（キー: `kitasenju_filter_kitaayase`）に永続化する

### 4.4 0〜3時台の翌日扱いロジック
- 0:00〜3:59 は「当日の深夜帯」として扱い、時刻をずらして比較する
- 例：00:06 → `(0+24)*60+6 = 1446分` として計算する

---

## 5. データ仕様

| 種別 | 件数 | 北綾瀬行き | 始発 |
|------|------|-----------|------|
| 平日（WEEKDAY） | 265本 | 62本 | 2本（04:54・00:48） |
| 土休日（HOLIDAY） | 201本 | 54本 | 2本（04:54・00:48） |

### データ型定義

```typescript
export interface Train {
    time: string    // "HH:MM" 形式
    dest: string    // 行き先（例: "我孫子（千葉県）"）
    origin: boolean // 当駅始発かどうか
}
```

---

## 6. 時刻計算ロジック

### timeToMin(time: string): number
時刻文字列（"HH:MM"）を分単位の整数に変換する。
0〜3時台は24時間分加算して深夜扱いにする。

| 入力 | 計算 | 出力 |
|------|------|------|
| "07:30" | 7×60+30 | 450 |
| "04:54" | 4×60+54 | 294 |
| "00:06" | (0+24)×60+6 | 1446 |
| "03:59" | (3+24)×60+59 | 1679 |

### nowToMin(h: number, m: number): number
現在時刻（時・分）を同様に分単位に変換する。

---

## 7. テスト仕様

| ファイル | テスト数 | 対象 |
|----------|---------|------|
| `timetable.test.ts` | 10件 | データ件数・形式・件数カウント・始発件数 |
| `timeUtils.test.ts` | 11件 | 時刻変換・表示名変換・行き先判定 |
| `App.test.tsx` | 7件 | 表示テキスト・フィルター動作 |
| **合計** | **28件** | |

---

## 8. PWA仕様

### manifest.json

| 項目 | 値 |
|------|----|
| name | 北千住 下り時刻表 |
| short_name | 北千住↓ |
| display | standalone |
| background_color | #0d1526 |
| theme_color | #00843d |
| orientation | portrait |

### アイコンデザイン
- **背景**: 紺色（#0d1526）、角丸
- **駅名標**: 緑帯（#00843d）の中に黒帯、白文字「北千住」
- **上部**: 「千代田線」緑テキスト
- **左上**: H22・C18 の路線バッジ
- **下部**: 下向き緑矢印

---

## 9. UIカラー・レイアウト仕様

| 用途 | カラーコード |
|------|-------------|
| 背景 | #0d1526 |
| 千代田線グリーン | #00843d |
| 次の電車ハイライト背景 | #0a3020 |
| 行区切り線 | #1a2640 |

### ヘッダー（sticky）
1. 路線バッジ「千代田線」＋ 駅名「北千住 Kita-Senju」＋ 下向き矢印 ＋「下り」
2. 現在時刻（緑・monospace）＋ 平日/土休日バッジ ＋ フィルタートグルボタン
3. 次の電車バナー（緑背景）

### 列車1行レイアウト
```
[時刻 monospace 太字]  [行き先バッジ]  [始発ラベル]  ................  [各駅停車 右寄せ]
```

---

## 10. デプロイ手順

```bash
# 1. テスト
npm run test:run

# 2. ビルド
npm run build

# 3. GitHubへプッシュ
git add .
git commit -m "feat: ..."
git push origin main

# 4. Vercel 自動デプロイ（mainブランチ push で自動起動）
```

---

## 11. ダイヤ改正時の対応手順

1. `src/timetable.ts` の `WEEKDAY` および `HOLIDAY` 配列を新ダイヤデータで更新する
2. `src/test/timetable.test.ts` の件数アサーション（265件・201件等）を新件数に合わせて修正する
3. `npm run test:run` でテストがPASSすることを確認する
4. `npm run build` でビルドエラーがないことを確認する
5. GitHubへpushしてVercel自動デプロイを確認する

---

## 12. 既知の問題・将来課題

| 項目 | 内容 |
|------|------|
| 祝日判定未対応 | 現在は土・日のみ土休日判定。祝日は平日ダイヤが適用される |
| 終電後翌日切替 | 00:48以降の動作（翌日4:54まで表示なし）の検証が必要 |
| 分ゼロ跨ぎ | 23:59→00:00の境界での挙動検証 |
| オフライン対応 | Service Worker未導入。PWAとして完全オフライン化するには追加実装が必要 |
