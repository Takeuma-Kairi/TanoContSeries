const SECTION_ARR = ["page", "item", "setting"];
const BUTTON_ARR = ["button_page", "button_item", "button_setting"];

//ライトかダークか、カラーモードを保存しておく
let isDarkMode = false; //デフォルトのテーマがダークテーマか否か。初期値はfalse
let color_theme = "light"; //現在のテーマはdarkかlightか。初期値はlight

let page_num = 0;

const STORY_LENGTH=93;

let item_haveArr=[false,];
let flagArr=[];
const TAGARR={"run": 9, 
"apolo": 11, 
"settle": 14, 
"ng": 25, 
"ok": 30, 
"rouin": 42, 
"talk": 43, 
"imizu": 44, 
"port": 45, 
"tower": 48, 
"cylinder": 50, 
"cylinderb1": 52, 
"cylinderblue": 53, 
"cylinderred": 57, 
"out": 62, 
"cylinder2": 69, 
"rectangle": 76, 
"rectangleb1": 78, 
"picture": 79, 
"rectangleb2": 80, 
"rectangle2": 85, 
};

const EVENT_SCRIPT=[
[function(){getitem(0);nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("run")}, function(){tob("apolo")}, ],
[function(){nxp()}, ],
[function(){tob("settle")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("settle")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("ok")}, function(){tob("ng")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("tower")}, function(){tob("talk")}, function(){tob("imizu")}, function(){tob("port")}, ],
[function(){tob("rouin")}, ],
[function(){tob("rouin")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("rouin")}, ],
[function(){nxp()}, ],
[function(){tob("cylinder")}, function(){tob("rectangle")}, ],
[function(){nxp()}, ],
[function(){tob("cylinder2")}, function(){tob("cylinderb1")}, ],
[function(){tob("cylinderblue")}, function(){tob("cylinderred")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("out")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){tob("out")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[],
[function(){nxp()}, ],
[function(){tob("rectangle2")}, function(){tob("rectangleb1")}, ],
[function(){tob("picture")}, function(){tob("rectangleb2")}, ],
[function(){tob("rectangleb1")}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[function(){nxp()}, ],
[],
];

window.addEventListener('DOMContentLoaded', () => {

  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  isDarkMode = darkModeMediaQuery.matches;

  // 初期状態でどちらのテーマなのかを取得、それに合わせてページのテーマを決める
  color_theme = isDarkMode ? "dark": "light";
  
  document.documentElement.setAttribute("theme", color_theme);
  change_color(color_theme);
  
  //スクロール高速化のために必要らしい内容。
  //touchstart？もしくはontouchstartは、スマホでホバーを実現するために入れている。
  document.getElementById("body").addEventListener('touchstart', function(){}, {passive: true});

  make_selection_event();
});



//カラーテーマの変更
function change_color(color){
  color_theme = color;
  
  // ライトかダークか明示されないなら、デフォルトの設定に合わせる
  if(color_theme != "light" && color_theme != "dark"){
    color_theme = isDarkMode ? "dark" : "light";
  }
  
  document.documentElement.setAttribute("theme", color_theme);
  
  // 画像の変更
  document.getElementById("icon_setting").src = "../../source/icon1_" + color_theme + ".png"
  document.getElementById("icon_page").src = "../../source/icon2_" + color_theme + ".png"
  document.getElementById("icon_item").src = "../../source/icon4_" + color_theme + ".png"
  
  let selection_iconArr = document.getElementsByClassName("selection_icon");
  for(i=0; i<selection_iconArr.length; i++){
    selection_iconArr[i].src = "../../source/icon3_" + color_theme + ".png";
  }
}


//設定タブの「最初から始める」ボタン
document.getElementById("restart_button").addEventListener("click", () => {
  var res = confirm("最初から始めますか？進行は保存されません");
  if(res){
    restart();
  }
});



//ページの選択肢ボタンに、clickイベントを配置する。
function make_selection_event(){
  for(let i=0; i<EVENT_SCRIPT.length; i++){
  
  /*よくわからないが、単純にfor文でaddEventListenerを制御しようとすると、ループが終わり切ったカウンタ変数の値しか反映されず、ちっとも動かない様子。
  高階関数でスコープの問題をなんとかするしかない。*/
  
  (function(n){
    //var selectionArr = EVENT_SCRIPT[i];
  
    for(let j=0; j<EVENT_SCRIPT[i].length; j++){
      
      (function(m){document.getElementById("btn_" + i + "_" + j).addEventListener("click",
        function (e) {
          EVENT_SCRIPT[i][j]();
        });
      })(j);
      
    }
    
  })(i);
}
}


// セーブデータをロードするボタン
document.getElementById("save_submit").addEventListener("click", () => {
  var keyword1 = document.getElementById("save_keyword1").value;
  document.getElementById("save_keyword1").defaultValue=keyword1;
  var keyword2 = document.getElementById("save_keyword2").value;
  document.getElementById("save_keyword2").defaultValue=keyword2;
  
  keyword1Int=parseInt(keyword1);
  keyword2Int=parseInt(keyword2);
  
  if(isNaN(keyword1Int) || isNaN(keyword2Int)){
    alert("セーブデータが不適です。")
  }else{
    alert("セーブデータを反映しました。");
    mov(keyword1Int);
    load_itemdata(keyword2Int.toString(2));
    
    change_article("page");
  }
});



/*アイテムデータについて
アイテムのセーブデータは10進数で管理していますが、これは2進数がベースです。
たとえば、6種類のアイテム（０，１，２，３，４，５番まである）のうち、１，３番を持っている場合、
001010
のように表記されることを期待します。1がもっていて、0はもっていないという意味です。
実際は、左の桁の0はカットされて、1010となります。
これを補正するため、load_itemdataでは、桁をひっくり返しておきます。ついでに配列にしておきます。

1010 → 0101 → ['0', '1', '0', '1']

左からfor文で走査しながら、アイテムをもっている／もっているの評価をします。
なお、5番目以降のアイテムを考える時、0も1もかいていない状況になり、undefinedなので、それは、もっていない判定にします。

ちなみにこのデータを10進数で表すと「26」です。

なぜ10進数で表すかと言うと、仮に25種類のアイテムを
11001011000111111101
このように持っていた場合、このままの2進数データを覚えるより、
10進数で「831997」としたほうが、覚えやすさがマシだからです。

ちなみに16進数では「CB1FD」です。アルファベットも登場するとなると覚えづらいと思います。
*/
//2進数のアイテムセーブデータを読んで、もっている／もっていないを更新する
function load_itemdata(binaryStr){
  dataArr = binaryStr.split("").reverse();
  for(var i=0; i<item_haveArr.length; i++){

    if(dataArr[i] == "1"){
      item_haveArr[i] = true;
    }else{ 
      //"0"があった場合 
      //あと、dataArrの要素オーバーフローでundefinedが返された場合も、もっていない判定
      item_haveArr[i] = false;
    }
  }
  
  item_update();
}


// 現在のセーブデータを出力する
function savedata_write(){
  var item_binaryStr = "";
  for(var i=0; i<item_haveArr.length; i++){
    if(item_haveArr[i]){
      item_binaryStr = "1" + item_binaryStr;
    }else{
      item_binaryStr = "0" + item_binaryStr;
    }
  }
  
  document.getElementById("now_save_keyword1").innerText = page_num;
  document.getElementById("now_save_keyword2").innerText = parseInt(item_binaryStr, 2);
}



// ページと設定のアーティクル切り替え
function change_article(name){
  // いったん全部選択されていない状態にリセットしてから
  SECTION_ARR.map((value)=>{document.getElementById(value).style.display="none"});
  BUTTON_ARR.map((value)=>{document.getElementById(value).className="tab_button"});
  
  // 個々を選択状態にする
  document.getElementById(name).style.display="inline-block";
  document.getElementById("button_" + name).className="tab_button selected";
  
  //設定ページに飛んだら、セーブデータも表示しておく
  if(name=="setting"){
    savedata_write();
  }
}



// ページ移動
function mov(i){
  //無効なのは、0未満の数字
  if(i < STORY_LENGTH && i>=0){
  document.getElementById("page_" + page_num).className="hidden_page";
  document.getElementById("page_" + i).className="hidden_page open_page";
  page_num = i;
  
  }else{
    alert("エラー：存在しないページに飛ぼうとしています！");
  }
}

//次のページへ
function nxp(){
  mov(page_num+1);
}

//前のページへ
function bcp(){
  mov(page_num-1);
}

//タグ番号で飛ぶ
function tob(i){
  mov(TAGARR[i]);
}

//アイテムの表示
function item_update(){
  item= document.getElementById("item_div");
  
  
  //アイテムを１つももっていないか否かの判定をする
  ifhave_any_item = false;
  
  for(var i=0; i < item_haveArr.length; i++){
    if(item_haveArr[i]){
      ifhave_any_item = true;
      document.getElementById("item_" + i).className="item_p open_item";
    }else{
      document.getElementById("item_" + i).className="item_p hidden_item";
    }
  }
  
  // 走査しても、何もアイテムを持っていなければ
  if(!ifhave_any_item){
    document.getElementById("noitem").className="item_p open_item";
  }else{
    document.getElementById("noitem").className="item_p hidden_item";
  }
}


//アイテムを持っているか否か
function ifhave(i){
  return(item_haveArr[i]);
}

//アイテムを得る
function getitem(i){
  item_haveArr[i]=true;
  item_update();
}

//アイテムを失う
function loseitem(i){
  item_haveArr[i]=false;
  item_update();
}

//一番初めから再開
function restart(){
  //アイテムを失う
  for(var i=0; i< item_haveArr.length; i++){
    item_haveArr[i] = false;
  }
  item_update();

  mov(0);
}

//フラグが立っているか
function iflag(i){
  return(flagArr[i]);
}

//フラグを立てる
function onflag(i){
  flagArr[i]=true;
}


//フラグをおろす
function offlag(i){
  flagArr[i]=false;
}

