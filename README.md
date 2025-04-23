# TanoContSeries
## 概要
自作ストーリー「大陸物語」を選択式テキストアドベンチャーゲーム風にしたものです。

独自のスクリプト(StoryJS/内)を読み込み、閲覧できるようにしています。

HTML, CSS, JavaScriptで構成されています。

## 使い方
1. [GitHubサイト](https://github.com/Takeuma-Kairi/TanoContSeries)で、「Code」→「Download ZIP」をクリックし、ZIPファイルをダウンロードしてください。
2. ブラウザで`index.html`を開きます。
3. 「画面説明」をクリックし、操作方法を確認してください。

## プロジェクト構成
```
TanoContSeries-TanoContBTAP/
├── index.html    # メインHTMLファイル
├── BTAicon.png    # アイコン画像
├── 大陸シリーズ目次順番    # 保守用
├── StoryJS/    # ストーリーファイル
├── Assist/    # ストーリー補助ファイル(添付画像など)
├── Colors/    # カラースキームファイル
└── Sources/
        ├── main.js # HTMLの制御とグローバス変数・定数
        ├── BTAP_interactive_control.js #ユーザー、BTAP間のインタラクティブな処理
        ├── BTAP_import_and_format.js #ストーリー読み込みやデータ整形などの処理
        ├── BTAP_script.js #ストーリーファイル内で使う制御用スクリプト
        └── style.css    # スタイルシート
```
## ライセンス
このプロジェクトは [MITライセンス](https://licenses.opensource.jp/MIT/MIT.html) のもとで公開されています。

## 連絡先
作成者: [竹馬 浬](https://github.com/Takeuma-Kairi) (たけうま かいり)
Email: support@takeuma-kairi.sakura.ne.jp



