# NOVILL TOWN EMS

HTML / CSS / JavaScriptで構成した、EMSの組織案内・隊務規定・勤務ガイドです。外部ライブラリやビルドは不要です。

- リポジトリ: https://github.com/Peridoll/NOVILL-TOWN
- 公開URL: https://peridoll.github.io/NOVILL-TOWN/
- バージョン: 0.2.0
- 公開元: GitHub Pages、`main` の `/(root)`

## 構成

| 案内 | 内容 |
| --- | --- |
| EMSについて | 組織紹介・基本方針・心構えを集約 |
| 隊務規定 | 公務員としての行動・公平な医療・事件現場の安全 |
| 勤務・研修 | Duty・無線・服装・車両と装備・研修・階級ごとの現場対応 |
| 更新履歴 | 最新の変更と、折りたたんだ過去の更新 |

既存のルールを保ちながら、同じ説明の重複を整理しています。勤務・無線の規定は「勤務・研修」に集約しています。新しい料金・権限・昇格条件は追加していません。

## 閲覧と確認

`index.html` をブラウザで開けます。JavaScriptを無効にしても本文・目次・折りたたみを利用できます。

- 医療キットのメニュー、ページ内移動、ダーク / ライト、本文文字サイズを維持
- 検索は折りたたみ内の説明も対象とし、該当項目を開いて移動
- 旧リンク `#principles`・`#mindset`・`#prohibited`・`#training` を維持
- CSS / JS / SVGは相対パス参照。`/NOVILL-TOWN/` のサブパスで利用可能
- 操作設定はlocalStorageへ保存。保存できない環境でも閲覧可能
- 動きを減らすOS設定では、スクロールアニメーションを省略

変更は `feature/` ブランチで確認し、管理者がマージした後にGitHub Pagesへ反映します。

## ファイル

```text
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

ロゴ3種は既存の仮SVGです。規定の採用状況や運用上の変更は管理者が確認してください。FiveMタブレットへの埋め込みはMediora側で別途実装・実機確認が必要です。

## 今後の操作案内

EMS無線は2番です。タブレットからの無線参加・退出は対応予定のため、現行の操作手順としては掲載していません。利用できるようになった段階で実際の操作を追記します。
