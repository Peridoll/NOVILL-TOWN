# NOVILL TOWN EMS | GitHub Pages

静的サイト（HTML / CSS / JavaScript）。Novill Town EMS 公式ポータル v0.1.3 を GitHub Pages 用にまとめたものです。

## 対象リポジトリ

- https://github.com/Peridoll/NOVILL-TOWN
- 想定公開URL: `https://peridoll.github.io/NOVILL-TOWN/` （公開完了後に有効）
- GitHub Pages: デフォルトブランチ `main` の `/(root)` から公開する想定

## 初回公開（リポジトリ管理者が実施）

1. GitHubリポジトリの可視性を確認してください。GitHub FreeのPagesはPublicリポジトリが必要です。GitHub Pro / Team等の対象プランならPrivateでもPagesを利用可能です。ただしPages公開サイト自体は公開されます。
2. このフォルダーの **中身**（`index.html`、`.nojekyll`、`assets/`、`README.md`）をリポジトリ最上位に配置してください。ZIPファイルをそのまま置くだけでは展開されません。
3. Gitのブランチ・コミット・プッシュ・マージ操作はリポジトリ管理者自身が実施します。現在のリポジトリは空なので、最初にブランチを初期化してファイルを登録する必要があります。
4. リポジトリの `Settings` → `Pages` → `Build and deployment` → Source: `Deploy from a branch` → Branch: `main`, Folder: `/(root)` → `Save`。
5. `Settings` → `Pages` に公開URLが表示され、デプロイが完了したことを確認してください。
6. 公開後にDiscordへURLを貼り、Medioraタブレットからの閲覧はFiveM実機で表示方式とフォント・入力操作を確認してください。

## ファイル

```
index.html
.nojekyll
assets/
  app.js
  styles.css
  favicon.svg
  novill-town-mark.svg
  novill-ems-mark.svg
  ptech-mediora-mark.svg
README.md
```

## 特徴

- トップ：隊務規定への導線とスクロール型セクション
- 医療キット式ナビゲーション：クリックで横に展開し、現在位置をハイライト
- 目的セクションへ移動距離に応じて約1.1〜4.4秒のスクロールアニメーション
- ダーク / ライト、本文文字サイズ、localStorage 設定保存、検索
- スマホ / PC / FiveMタブレット幅を考慮したレイアウト
- ロゴ3種は仮SVG。正式素材へ差し替えること

## 注意事項

- 2026-11-13時点でサイトをGitHubへは未アップロード。Pagesの設定・公開も未実施。
- 本ZIPは公開用の**展開素材**です。GitHubへの書き込みは利用者が行ってください。
- このサイトの一部規定には運営シート/相談を元に整理した草案が含まれます。正式な運用ルールとして採用する前に管理者が最終確認してください。
- GitHub PagesのプロジェクトURLは `/NOVILL-TOWN/` のサブパスを含みます。本サイトはCSS/JS/ロゴを相対パスで参照しているためこのURLに対応しています。
- URLのページをFiveMタブレットに埋め込む処理はMediora側で別途実装・検証してください。
