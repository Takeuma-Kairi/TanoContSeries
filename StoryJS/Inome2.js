var Inome2 = `<flag:0>

<item:2>
[0]黒縄町の地図#<img src='Assist/Inome2_assist/kuronawa_albol.png' style='width:330px;height:220px'/>
[1]リードミー#1.重要な注意ーーーーーーーーーー<br>省略。注意事項は後述。<br><br>2.あらすじーーーーーーーーーーー<br>アルボル研究所に就職した猪目は、危険なアルボル、竜軸の処理のため、黒縄町に向かう。現地で竜軸を監視してきた池家に出会う。<br><br>3.登場人物ーーーーーーーーーーー<br>・猪目 遥音<br>医師。アルボルに関する研究をしてきた。<br><br>・池家ひたみ<br>黒縄町で、伝統的に竜軸を監視し、儀式をしてきた。<br><br>4.注意事項ーーーーーーーーーーー<br>このページデータ内のストーリーはフィクションであり、登場する人物名、団体名等は実在のものではありません。<br>また、書かれている説明が、実際と異なる場合があります。<br>書かれている内容は作者の意見を代弁するものではなく、特定の意見を主張するものでもありません。<br><br>Inome2.txt　1版<br>2021.4.　竹馬浬
</item>

<map:10>
[0]
n:揺れ動く猪目
^<r>猪目#いのめ</r> <r>遥音#はるね</r>は、アルボル研究所の衛生部門に、医師として就職が決定した。
^大変ありがたいことだ。福利厚生がよく、研究活動もできると聞いていたから。
^
^大学ではアルボル由来の物質が体内でどのような反応を引き起こすのかについて知識を深めた。
^
^そのまま研究職としてアルボル研究所に入ることも考えたが、直接人命を救うことが自分のやりたいことだと思ったため、今は医師としてここにいる。
^
^番号:21_4.13.M0.L.遥
s:次へ#mov(1)

[1]
n:アルボル研究所
^アルボルと人間とは、お互いに干渉することはあまり無い。あっても、そこまで脅威となるアルボルではないだろう。
^
^それは、主にアルボル研究所が、脅威となるアルボルを駆逐し、人里から遠く離れた場所で奮闘しているからだ。
^
^そこで、戦闘員にしても医師にしても、ある程度アルボルの知識を持っていないといけない。
^
^猪目にとっては、これまで学んできたことを活かせるすばらしい職業だ。
s:次へ#mov(2)

[2]
n:黒縄町へ
^何年か経ち、職場にも慣れてきたころ、ある知らせが舞い込んできた。
^
^レーナス県<r>黒縄#くろなわ</r>町で、"<r>竜軸#りゅうじく</r>"というアルボルが活動を開始したという知らせだ。
^
^もとより黒縄町では魔力の流れが不自然で、それは竜軸によるものだという。
s:次へ#mov(3)

[3]
n:黒縄町へ
^竜軸は猪目もよく知っている。人体に影響を与える鉱物の塊で、危険性が極めて高いアルボルだ。
^
^常に活動しているわけではなく、活動していても、おとなしい時に結界を狭めてやれば一時的な封印はできる。
^
^歩く者たちが儀式を行い、その覚醒と封印の儀式を行っているらしく、今回もそれだ。
^
^活性化時に大量の魔力と、原始結界という危険な領域をひろげることから、アルボル研究所では大昔から対策が議論されてきた。
s:次へ#mov(4)

[4]
n:黒縄へ
^このアルボルは、猪目の研究してきた分野にも通じる。
^
^是非私も現地に行かせてもらいたい、と上申すると、その願いは知識と技能を十分に評価された上で聞き届けられた。
^
^猪目たち、衛生部門の目的は同行する職員の健康保全、そして、竜軸にまつわる関係者の健康調査である。
s:次へ#mov(5);geti(0);

[5]
n:黒縄港
^黒縄町は小さな港町で、猪目たちは船で上陸した。
^先日まで記録的な大雨だったが、今は波も穏やかで晴れ渡っている。
^
^
^黒縄港は小さな港だ。
^木製の桟橋は所々折れた部分があり、すこし頼りない。
^
^打ち上げられた海藻をぐしゃぐしゃ踏みつけて上陸する。
s:町の中心へ#mov(6)

[6]
n:黒縄町の中央広場
^魚屋の立ち並ぶ通りを抜けると、町の中央広場に出た。
^
^あちこちに水たまりができている。
^
^<r>管轄署#かんかつしょ</r>や学校が建てられている。
^
^竜軸の所在場所につながる通りがある。
^
^また、現地で伝統的な監視を行ってきたという二本老松番につながる県道がある。そこが目的地だ。
s:管轄署へ#mov(7)
s:竜軸のもとへ#mov(10)
s:県道へ#mov(14)

[7]
n:管轄署-黒縄支署
^建物は小さいが、市街地保護結界の要や、余剰魔力接空など、魔力災害の減災設備が見られる。
^
^町の保守のため善戦をしたのだろうが、異常な状況に耐えきれず、多くの機器や保護結界は破損してしまったそうだ。
^
^アルボル研究所や管轄署員の方など、多くの人が仕事をしている。
s:職員と話をする#mov(8)
s:建物を出る#mov(6)

[8]
n:管轄署-黒縄支署
^管轄署員の人に話を聞いてみた。
^
^「そこに住んでいる<r>池家#いけいえ</r>さん…歩く者のね。あの人が儀式を行った以外は、町民は煙石市の安全な建物に避難したんです。私は一晩中、管轄署で保守作業をしていました。」
^
^「なるほど。儀式の内容は見たんですか。」
^
s:次へ#mov(9)

[9]
n:管轄署-黒縄支署
^「いや、見てないですね。ただ、突然、窓の外が昼のように明るくなったかと思うと、これらが一気に壊れたんです。」
^
^職員は、機械や魔力装置の数々についた、使用中止とかかれた札を指さした。
^
^どれも機械の動力源には魔力を用いている。
^これらが一気に壊れたとなると、やはり相当の魔力異常が生じたのだろう。
s:戻る#mov(7)

[10]
n:堂前通り
^両側に民家が立ち並ぶ、広い通りに出た。
^
^通りの突き当りには、小さなお堂がある。
^おそらくあそこにいるのが、竜軸だろう。
^
^腰につけた小型の原始結界強度計測装置が、鈴をならした。
s:お堂へ#mov(11)


[11]
n:お堂
^古い小屋だ。
^小屋の中に、真っ黒な像が立っている。
^
^人間の腕らしきものが体の前で手を合わしているので、ぱっと見ると人間の立像のようだが、本来顔があるところはのっぺらぼうで、
^
^その上には大きな蛇の頭が見える。
s:次へ#mov(12)

[12]
n:お堂
^腕をいっぱいに広げても抱えきれないくらいに、太い体の大蛇だ。
^
^鱗で覆われた体。長い尻尾は途中で土に埋まっている。
^
^微動だにしない。覚醒時の体は、輝かしい鉱物結晶に覆われているというようだが、是非見てみたいものだ。
s:次へ#mov(13)

[13]
n:お堂
^おそらく、急激な魔力変化で体の構成成分が変質するのだろう。
^
^この劇的な変身すらも、具体的にどう変化しているのか未知の領域というから、竜軸研究はまだまだ奥が深い。
^
^腰につけた機器が警告の鈴をならしたため、観察を中止してその場から立ち去った。
^
^放っておくと原始結界の中に取り込まれてしまい、通常生活に若干の支障を来すらしい。
^どれほど支障があるのかは実際になってみないと分からないが、用心に越したことはない。
s:戻る#mov(6)

[14]
n:県道-黒縄線
^広い県道の木陰の中を進んでいくと分かれ道があった。
^
^県道を先に進めば煙石町だ。
^
^分かれ道は、歩く者の野営場に繋がっている。
s:分かれ道の先へ#mov(15)

[15]
n:<r>二本老松番#にほんおいまつばん</r>
^進んでいくと、木でできた柵で囲われた場所に
^「二本老松番」
^と書かれた門が開いていた。
^
^猪目は歩く者の文化については詳しくなく、人里離れた山の守り人のような、そんな程度の偏見じみた人物像しか想像できていない。
^
^そんな私が果たして歓迎されるだろうか、と緊張しながら入ると、小さな小屋が建っているのが見える。
s:小屋へ#mov(16)

[16]
n:小屋
^小屋の前には、覇気のなさそうな人物が、物干し竿に衣をかけていた。
^泡だった湯が入った洗濯用の鍋のそばには、濡れて塊になった洗濯物の山がある。
^その人の隣には幼い子供が元気に駆け回っている。
^
^その人は、猪目に気づくと軽く会釈をし、
^「どちらさまですか？」
^と尋ねた。
s:次へ#mov(17)

[17]
n:池家さん
^この人が、歩く者であり、竜軸に関する儀式をしたという、<r>池家#いけのや</r>さんだ。
^「アルボル研究所、衛生部門の猪目ともうします。現在の健康状態を診させていただきたいのです。それと、もしよろしければ、儀式についてのお話を伺いたいのですが…。」
^
^池家さんは黙ってうなずき、子供にちょっとそこら辺であそんでおいでと言い、足下のかごを伏せて、腰掛けた。
^
^年齢の割には、だいぶ体が弱っているな、と猪目は思った。
^聞けば、竜軸の儀式の後は心身ともに疲労し、食欲もないという。
s:次へ#mov(18)

[18]
n:竜軸の儀式
^竜軸の体は一つだけではなく、いくつかの塊に分かれ、この町の周辺に散らばっている。
^これらの塊は一見、体がつながっていないが、それらの間には外とは異なったエネルギー系が存在しており、それが地中で枝分かれしている。
^
^…要は、見えないだけで、一つの体としてつながっているわけだが、この独立した系を結界と呼んでいる。
^
^竜軸の場合、この結界が地下深くから延びている。
s:次へ#mov(19)

[19]
n:竜軸の儀式
^この軸を一気に地上に延ばし、その強度を上げれば、地上にもこの結界が広がる。
^同時に、地下の豊富な魔力が地上にも多く流出することになる。
^
^儀式では、
^
^分断された竜軸の塊を中央の本体に、改めて結合させ、一カ所の結界強度を上昇させること。
^
^十分に結界がひろがり、魔力が行き渡ったとき、再び塊を分断、事態を収束させること。
^
^この２つが行われるようだ。
s:次へ#mov(20)

[20]
n:竜軸の儀式
^猪目は、心音や、血圧の測定を滞り無く終わらせ、採血に移った。
^赤黒い液体が採血管に流れ込む。
^
^「そういえば、儀式の始まりって、どうやって決めるんですか。」
^
^さり気なく疑問を投げかけたが、
^
^池家さんは、「そのときが来たら、わかる」と、半ばぞんざいに答えた。
s:次へ#mov(21)

[21]
n:竜軸の儀式
^竜軸の前で、儀式を始める旨を伝え、生贄を用意する。
^
^生贄は竜軸に体を差しだし、竜軸に噛まれる。
^
^そして、各地の塊を訪れ、掘り起こし、生贄の血や肉を削いで埋める。
^
^そんなことをしているうちに生贄は弱って生き絶えてしまうが、遺体も、覚醒がはじまった本体に食べさせる。
^
^これで、竜軸は、肉体としての結合を得る。
s:次へ#mov(22)

[22]
n:竜軸の儀式
^とはいえ人間の体は時間がたてば腐敗するため、魔力放出はそれにつれて弱まる。
^
^ある程度放出が弱まり、結界の強度が落ちてきたのを見計らい、
^竜軸に感謝する旨の言葉を読み上げ、
^
^肉体を完全に消すために毒薬を捧げ、儀式は終わる。
s:次へ#mov(23)

[23]
n:池家さん
^生贄は池家さんの妻だったそうだ。
^ご家族を失った悲しみは計り知れない。
^
^すこし自暴自棄になってしまっているような、すべてに興味を失っているような、そのような雰囲気だった。
^
^残された子はひとり、広場の端の方でしゃがみ、蟻ん子の行列を眺めている。
^
^干していた服は儀式用のものだろうか。
^三角形の幾何学模様が編まれたえんじ色の衣で、赤茶色の染みがところどころにこびりついている。
s:次へ#mov(24)

[24]
n:池家さん
^どのような言葉をかけるべきか、猪目が言葉に詰まっていると池家は突然話を切り出した。
^
^「一つ頼みがあるのだが、聞いてくれまいか。」
^
^「何でございましょうか。」
^
^「今採った、自分の血に、竜軸の血が混じっているか知りたいんだ。」
^
^「はい。結構ですよ。竜軸からの攻撃を受けたのですか。」
s:次へ#mov(25)

[25]
n:池家さん
^「いや、受けていない。だが、存在はしていると思うんだよ。」
^
^奇妙なことを言う人だと思った。
^竜軸からの攻撃を受けていないならば、竜軸の血は体内に侵入しないというのが通説だから。
^
^「そうなのですか。ご要望とあらばもちろん、検査いたします。」
^
^「ああ。そして、採れた竜軸の血をここに持ってきてくれ。」
s:次へ#mov(26)

[26]
n:竜軸の血
^後日、黒縄町周辺の人々からとった検体の分析が終了した。
^
^なるほど。池家さんの言うとおり、池家さんには竜軸の血が確認された。
^組成は誘導型。対象を、自分の元に惹きよせるものだ。
^
^再び猪目は黒縄町に入った。
^災害の被害がほとんど考えられないくらいに、町並みは整えられていた。
s:次へ#mov(27)

[27]
n:池家さん
^池家さんは未だにやつれている様子だったが、はじめにあったときより心身ともに回復して見えた。
^
^保管液に漬けられた、砂粒ほどの赤い結晶を見せながら、猪目は説明した。
^
^「竜軸の血が確認できました。組成から、竜軸が池家さんを呼び寄せる内容のようです。」
^
^「そうか、はは。ははは。」
s:次へ#mov(28)

[28]
n:池家さん
^「どうかなさいましたか。」
^
^「はは。これではっきりした。池家は、黒縄さまから離れていようとも、食われる…いや、生まれる前から、すでにその毒牙に…。」
^
^「大丈夫ですか、池家さん。」
^
^「これまで、逃げようとした人とがいないのが、不思議だったが、ははは。逃げられなかっただけか。」
s:次へ#mov(29)

[29]
n:池家さん
^「あの。どうなさいましたか、池家さん。」
^
^「ははは。いやいや、はは。気にしてもしょうもないことなので、気にしないで下さい。」
^
^そういう池家さんは、笑いながらも寂しげだった。
^
^黒縄町の監視体制は強化され、有事の際により迅速な行動ができるよう、黒縄町専門の対策部門が設立された。
^
^猪目は、ここに、衛生部門としてではなく、研究部門の仕事を求めて手を挙げた。
s:次へ#mov(30)

[30]
n:終わり
^研究部門も、とどのつまり現場の人命を救うことが目的であるし、何より、再び湧きあがってきた知的好奇心がそうさせた。
^
^それに、池家さんの悲しそうな笑顔が、いつまでも心の片隅から離れなかった。
^
^方法は変わったが、いつか、どこかの誰かを救うための、わずかな一助になれたら…。
^その人が私のよき隣人であったなら、なお嬉しいものだ。
^
^
^おわり

</map>
<end>`;
