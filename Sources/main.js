//定数
//= 通常モード、全ページ閲覧モードの文章 =============

// "all_page_mode"ボタンのinnerTextは、以下の2つのいずれか
const ToTSUJO= "→通常モード(<u>A</u>)";
const ToZENPAGE= "→全ページ閲覧モード(<u>A</u>)";


//= それぞれのタブ ===============================
const TABDIV_PAGE = document.getElementById("tabDiv_page");
const TABDIV_SETTING = document.getElementById("tabDiv_setting");
const TABDIV_SELECT = document.getElementById("tabDiv_select");
const TABDIV_SUMMARY = document.getElementById("tabDiv_summary");

//↑を配列にしたもの。for文で走査するとき使用
const TABDIV_ARR = [TABDIV_SETTING, TABDIV_SELECT, TABDIV_PAGE, TABDIV_SUMMARY];


//=画面上部のボタン・フォーム集 ======================

//全ページ閲覧モード・通常モード切り替えのボタン
const ALL_PAGE_MODE = document.getElementById("all_page_mode");
//全ページモード閲覧時のページ変更フォーム
const ALL_PAGE_FORMSDIV = document.getElementById("all_page_formsDiv");
//通常モードでの、戻る、とばす、マップなどのフォーム
const PLAY_TOOLBUTTONSDIV = document.getElementById("play_toolbuttonsDiv");


//アイテムを（非）表示のボタン ========================
const BUTTON_OPENITEM = document.getElementById("button_openitem");

//ストーリー本文(タイトル、描写文、選択肢)を入れるdiv ===
const D_DESC=document.getElementById("d_desc");

//モーダルウィンドウ描写部 ==========================
const ABST_DESC=document.getElementById("abst_desc");

//##############################################################################

// ページ情報を入れたり、プレイ時に変更される変数

let flagArr = [];  //フラグ
let itemArr = [];  //アイテム[nam:名前, exp:説明, hav:true/falseで所有]
let pageArr = [];  //フィールド[nam:名前, exp:説明, sel:[選択肢名, 実行文章]]
let page_number = 0;      //ページ番号
let numArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  //番号配列（フラグの補助的）
let tob_nameArr = {}; //tob関数用の連想配列。[タブ名: ページ番号]

//=============================================
//開発者モードならばtrue。
let is_author = false; 

//セーブデータ文字列を入れる配列。パンくずリスト。「戻る(remov)」で利用する
let savedata_footprintArr = []; 

//= ミニマップ関係 ==========================
let minimap_folder_name = ""; //→ミニマップ画像の入っているフォルダ名。（Assist/XXX/map/の中にマップ画像群が入っている。この変数には、文字列XXXが入る。）

let minimapArr =[];
//→ミニマップの現在位置を表す画像群を配列にする。
//[ [目次番号, 背景ファイル名, 現在地ファイル名] ...]


//##############################################################################
//##############################################################################

// サイト読み込み時、まずストーリー選択テーブルのソートをする。
// また、~index.html?target=ストーリー名 の形のリンクから来た場合、そのストーリーを開始
window.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  
  //sort_story_select_table();
  
  if(params.has('target')){
    load_data(params.get('target'));
  }
});

// ↓
// ↓ストーリー選択テーブルのソート
// ↓
function sort_story_select_table(){
  //表と配列の転記を行う。
  // 表データ → 配列 → (ソート) → ソートした表 → 表データ
  const STORY_SELECT_TABLE = document.getElementById("story_select_table"); //表

  let sort_order = document.getElementById("sort_order_sel").value; //昇順か降順か
  let sort_category = document.getElementById("sort_category_sel").value; //どのカテゴリーでソート？

  // カテゴリー番号 ##############
  //const SUB_NAME_COLUMN = 0; ←
  //const FILE_NAME_COLUMN = 1;←ファイル名や補助タイトルでの並び替えはしないと思うので
  const SERIES_COLUMN = 2;
  const MADE_COLUMN = 3;
  const HISTORY_COLUMN = 4;
  //###########################


  //フォームから読み取った並び替えの情報を、数値(1 or -1)に直す
  //あとで掛け算することで方向の符号反転させるためのもの。
  if(sort_order == "ascend"){  //昇順→1
    sort_order = 1;
  }else{  //降順→-1
    sort_order = -1; 
  }

  switch (sort_category){
    case "made":  //作成順
      sort_category = MADE_COLUMN;break;
    case "series":  //シリーズ順
      sort_category = SERIES_COLUMN;break;
    case "history": //時系列順
      sort_category = HISTORY_COLUMN;break;
    default:
      break;
  }

  //###########################
  //ソート前の表を記録する配列

  let table_dataArr=[];

  //構造は３重配列
  //[ [ rowのonclickイベント処理,
  //      [セルのinnerHTML, セルのinnerText],[その隣のセルのinnerHTML,セルのinnerText],...
  //  ],...]
  //
  // innerHTMLは単純にそのままコピペ用。
  // ただし、innerHTMLでは不要な情報が入っているためソートできないため、ソート用にinnerTextも入れておく

  //現在の表の情報をtable_dataArrに転記する
  for (ri = 1; ri < STORY_SELECT_TABLE.rows.length; ri++) {
    temp_table_dataArr = [STORY_SELECT_TABLE.rows[ri].onclick];
    for(cj = 0; cj<STORY_SELECT_TABLE.rows[ri].cells.length; cj++){
      temp_table_dataArr.push(
      [STORY_SELECT_TABLE.rows[ri].cells[cj].innerHTML,
      STORY_SELECT_TABLE.rows[ri].cells[cj].innerText]);
      //以上で、[onclick処理, [innerHTML, innerText], [innerHTML, innerText]...]
    }
    table_dataArr.push(temp_table_dataArr);
  }

  // ↓ソートだが、なぜ動いているのかよくわからない
  table_dataArr.sort(function(a, b) {
    //うしろの[1]は、innerTextが入っている要素ということ
    if (parseInt(a[sort_category+1][1]) > parseInt(b[sort_category+1][1])) {
      return 1*sort_order;
    } else {
      return -1*sort_order;
    }
  });
  // ↑ソートここまで


  //新しい表の情報をtable_dataArrから転記する
  for (i = 1; i < STORY_SELECT_TABLE.rows.length; i++) {
    STORY_SELECT_TABLE.rows[i].onclick = table_dataArr[i-1][0];
    for(j = 0; j < STORY_SELECT_TABLE.rows[i].cells.length; j++){
      STORY_SELECT_TABLE.rows[i].cells[j].innerHTML = table_dataArr[i-1][j+1][0];
    }
  }
}


//##############################################################################
// 上のタブ選択リボン(header)を開閉する
function tab_close(){
  const HEADER = document.getElementById("header");
  const TAB_CLOSE = document.getElementById("tab_close_button");

  if(header.style.display == "none"){ //もしリボンが「非表示」なら、「表示」させる
    HEADER.style.display = "block";
    TAB_CLOSE.innerText = "↑非表示"; //表示されているので、ボタンは「非表示にさせるならここを押す」旨を表示する
    TABDIV_PAGE.className = "tabDiv"; //リボン表示させるCSSクラス

  }else{  //もしリボンが「表示」なら、「非表示」にさせる
    HEADER.style.display = "none";
    TAB_CLOSE.innerText = "↑ 表示";
    TABDIV_PAGE.className = "tabDiv tabDiv_without_header";//リボン非表示させるCSSクラス
  }

}


//##############################################################################
// タブの変更
function change_tab(selected_tab){
  //引数のselected_tabは整数。 0:設定、1:選ぶ、2:みる、3:まとめ
  //この数字の振り方は開発してきた順であり、左側から表示されている順ではない！

  //========================
  //# タブ選択リボンの各ボタン #############
  const LI_SETTING = document.getElementById("li_setting");
  const LI_SELECT = document.getElementById("li_select");
  const LI_PAGE = document.getElementById("li_page");
  const LI_SUMMARY = document.getElementById("li_summary");


  //========================
  //# ボタン、タブを配列にする #############
  //# この順番は変更してはいけない！新しくタブを作る場合、第5項目以降に追加していくこと。
  const LI_ARR = [LI_SETTING, LI_SELECT, LI_PAGE, LI_SUMMARY];

  //選ばれたタブにあたるli要素と、それ以外の要素の見た目を変更する
  //また、選ばれたタブを表示し、それ以外は非表示にする
  for(let i = 0; i < LI_ARR.length; i++){
    if(i==selected_tab){
      LI_ARR[i].className = "active-li";
      TABDIV_ARR[i].style.display="block";
    }else{
      LI_ARR[i].className = "non-active_li";
      TABDIV_ARR[i].style.display="none";
    }
  }
}

//##############################################################################
// ページを左揃え／中央揃えにする。
  function change_text_align(){
    const CHB_TEXT_ALIGN = document.getElementById("chb_text_align");
    const DESC_AND_ITEM = document.getElementById("desc_and_item");

    //中央揃えにするチェックボックスフォームから判断
    if(CHB_ALIGN_CENTER.checked){
      DESC_AND_ITEM.style.textAlign = "center";
    }else{
      DESC_AND_ITEM.style.textAlign = "left";
    }
  }


//##############################################################################
//フォントサイズの変更
//最大30、最小12、デフォルト18にしている。深い意味はない。
function change_fontsize(p = "18"){
	const MAX = 30;
	const DEF = 18;
	const MIN = 12;

	let parseInt_result = parseInt(p);
	if (isNaN(parseInt_result)){  //数字じゃないものが入力された場合、デフォルト値に上書きする
		p = DEF + "";
	}else{
		if(parseInt_result < MIN){  //最低値、最高値で制限をかける
			p = MIN + "";
		}else if (parseInt_result > MAX){
			p = MAX + "";
		}
	}

  //===========================================
	// 実際の文章と、設定フォームに反映する
	const REIBUN = document.getElementById("reibun");
	const FONTSIZE_RANGE = document.getElementById("fontsize_range");
	const FONTSIZE_NUMBER = document.getElementById("fontsize_number");

	TABDIV_PAGE.style.fontSize = p + "px";  //本文のフォントサイズ
	REIBUN.style.fontSize = p + "px";  //「フォントサイズ確認サンプル文章」のフォントサイズ

	FONTSIZE_RANGE.value = p;
	FONTSIZE_NUMBER.value = p;

}

//##############################################################################
//画面(tabDiv)横幅の変更
//デフォルト60%にしている。深い意味はない。
function change_tabDivwidth(p="60"){
  const MAX = 100;
	const DEFAULT_VALUE = 60;
  //最低値は0%としておく。ただ、実際には0%にはならない。
  //ｃｓｓで最低360pxの幅は確保されるため、狭くなりすぎてしまうことはない。
	const MIN = 0;

	let parseInt_result = parseInt(p);

	if (isNaN(parseInt_result)){  //数字じゃないものが入力された場合、デフォルト値に上書きする
		p = DEF + "";
	}else{
		if(parseInt_result < MIN){  //最低値、最高値で制限をかける
			p = MIN + "";
		}else if (parseInt_result > MAX){
			p = MAX + "";
		}
	}

  //===========================================
	// 実際のスタイルと、設定フォームに反映する
	const TABDIV_WIDTH_RANGE = document.getElementById("tabDiv_width_range");
	const TABDIV_WIDTH_NUMBER = document.getElementById("tabDiv_width_number");

	TABDIV_WIDTH_RANGE.value = p;
	TABDIV_WIDTH_NUMBER.value = p;

	//各tabDivクラスのものに横幅を設定していく
	for(let i=0; i<TABDIV_ARR.length; i++){
		TABDIV_ARR[i].style.width = p + "%";
	}
}

//##############################################################################
// カラースキームの変更
function change_colorscheme(colorscheme_name) {
	let colorscheme = document.getElementById("colorscheme");
	colorscheme.href = "Colors/" + colorscheme_name + ".css";
}

//############################################################################## //設定のリセット(横幅、左揃え、フォントサイズ)
function reset_setting(){
	const chb_align_center = document.getElementById("chb_align_center");
  const DEFAULT_COLORSCHEME ="default"; //デフォルトのカラースキーム

	chb_align_center.checked = false; //中央ぞろえにしない
	change_text_align();

	change_fontsize();  //フォントサイズ

	change_tabDivwidth(); //横幅

  //カラースキームの変更
  change_colorscheme(DEFAULT_COLORSCHEME);
  document.getElementById("colorscheme_select").value=DEFAULT_COLORSCHEME;
}

//##############################################################################

//！！これより下、アイテム表示や獲得などの流れについてはさらなる検討が必要！！
//無意味な処理などが含まれていないか心配

//以下の３つは、アイテム欄の表示、非表示の制御
//アイテム欄を表示
function unvail_item(){
	let d_item = document.getElementById("d_item");

	d_item.style.display = "inline-block";
  BUTTON_OPENITEM.innerHTML = "↑アイテムを非表示";
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//アイテム欄を非表示
function hide_item(){
	let d_item = document.getElementById("d_item");

	d_item.style.display = "none";
  BUTTON_OPENITEM.innerHTML = "↓アイテムを表示";
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//button_openitemのボタン（上で「アイテムを（非）表示」と書いてあるやつ）を押したときの動作
function show_item(){
  let d_item = document.getElementById("d_item");

  get_item_alert(false);  //新規のアイテムがあるというアラートを消す

  if(d_item.style.display == "none"){ //まだアイテム欄が表示されていない場合、アイテム欄を表示
    unvail_item();
  }else{
    hide_item();  //逆に、すでに表示されているなら非表示にする
  }
}


//##############################################################################
//アイテムを欄に列挙する。
//持っているアイテムについては、オプションボタンを表示する
function listing_item(){
  let item_sel = document.getElementById("d_item_sel");
  let item_exp = document.getElementById("d_item_exp");

  item_exp.innerHTML="";  //初期化。これがないと、別のストーリーで得たアイテムの表示が残る。
  item_sel.innerHTML="";

  for(let i=0;i<itemArr.length;i++){
    if(itemArr[i]["hav"]){
      //「もちもの」タブにラジオボタンを追加する。
      item_sel.innerHTML +=
        '<label><input type="radio" name="item" onclick="item_exp_write(' + i + ')"/>'
        + itemArr[i]["nam"]
        + "</label><br>";
    }
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//アイテムの説明文を書く
function item_exp_write(item_num){
  document.getElementById("d_item_exp").innerHTML=itemArr[item_num]["exp"];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//「アイテムを表示」ボタンの色を変えて強調する（新アイテム獲得時）&強調表示しない
//isalert引数 true→強調、false→強調しない
function get_item_alert(isalert){
  //アイテムを表示ボタンを表示
  BUTTON_OPENITEM.style.display="inline-block";

  if(isalert){
    BUTTON_OPENITEM.className="tool_button openitem get_item_alert";
  }else{
    BUTTON_OPENITEM.className="tool_button openitem";
  }
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//アイテム欄をリフレッシュする。
//セーブデータをロードしたとき（たとえば「戻す」場合）、アイテムを失ったときに実行する
function item_reflesh(){
  let have_any_item = false;
  //アイテムを何も所有していないか判定。存在していないなら、「アイテムを表示」ボタンは表示させない

  for(let i=0; i< itemArr.length;i++){
    if(itemArr[i]["hav"]){
      geti(i);
      have_any_item = true;
    }
  }

  hide_item();

  
  //アイテムが存在していないなら、「アイテムを表示」ボタンは表示させない
  if(have_any_item){
    BUTTON_OPENITEM.style.display="inline-block";
  }else{
    BUTTON_OPENITEM.style.display="none";
  }
}


//##############################################################################
//開発者モード
function change_to_dev_mode(){
	let password = prompt("パスワード？");
	if(password == "mmm"){  //↑パスワードは「mmm」。ソースコードの中に書くなんて、脆弱だねえ！
		is_author= true; //開発者モードであることを示すフラグ

		//全ページ閲覧モード
		document.getElementById("all_page_mode").innerHTML= ToZENPAGE;
		alert("おかえりなさい");
		all_page_mode_change();

	}else{
		alert("パスワードが違います");
	}
}


//##############################################################################
// 全ページ閲覧モードにおける、ページ移動、ページ選択リストフォームの処理

//「←」、「→」ボタンで選んだ時 ==============
function all_page_shift(step){
  //stepは1か-1のどちらかが入る。
  //<1: 前に1つ進む> <-1: 後ろに1つ進む>

  let tow_temp = page_number+step;

  //選択ページ番号がオーバーフローしない限り移動できる
  if(tow_temp >=0 && tow_temp<pageArr.length){
    mov(tow_temp);

    const ALL_PAGE_SEL = document.getElementById("all_page_sel");
    ALL_PAGE_SEL.value = tow_temp;  // ページ番号選択リストに反映
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//ページ番号選択リストで選んだ時
function all_page_mov(tow){
  tow = parseInt(tow);
  mov(tow);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//ページ番号選択リストのリセットと書き直し
function all_page_sel_clean(){
  const ALL_PAGE_SEL = document.getElementById("all_page_sel");

  ALL_PAGE_SEL.length = 0;

  for(let i=0; i<pageArr.length;i++){ //ページ番号をひとつひとつリストに追加していく
    let op = document.createElement('option');
    op.text=i;
    op.value=i;
    ALL_PAGE_SEL.appendChild(op);
  }

  mov(0);  //いちばんさいしょのページへ
  ALL_PAGE_SEL.selectedIndex=0;
}


//##############################################################################
//通常モード、全ページ閲覧モードの入れ替え
function all_page_mode_change(){

  //~~ 全ページ閲覧モードへの移行 ~~
  if (ALL_PAGE_MODE.innerHTML== ToZENPAGE){
    ALL_PAGE_MODE.innerHTML= ToTSUJO;

  //~~ 通常モードへの移行 ~~
  }else{
    ALL_PAGE_MODE.innerHTML= ToZENPAGE;
  }


  //すでにページがロードされているならば、画面上部のフォームの表示を更新＆セレクト リストをリセット
  if(pageArr.length != 0){
    all_page_form_display();
  }
}


//##############################################################################
//全ページ閲覧／通常モードで、画面上部のフォーム表示をととのえて＆セレクト リストをリセット
function all_page_form_display(){
  all_page_sel_clean();

  if (ALL_PAGE_MODE.innerHTML== ToZENPAGE){
    ALL_PAGE_FORMSDIV.style.display ="none";
    PLAY_TOOLBUTTONSDIV.style.display = "inline-block";
  }else{
    ALL_PAGE_FORMSDIV.style.display ="inline-block";
    PLAY_TOOLBUTTONSDIV.style.display = "none";
  }
}

//##############################################################################

//1. ストーリー名（文字列）をうけとり、StoryOptionDicにアクセスしてストーリーデータを得る
//2. ストーリーデータを整形し、閲覧可能な形式にする
//の2つを行う。
//1.はload_data、2.はload_story_scriptで行う
//もともとload_dataで一貫して行っていたが、文字列のストーリー名から始めるもの（こちらがメイン）と、ストーリーデータから直で始めるもの（テキスト形式のストーリーファイル読み込み）の2つの方法を用意するにあたり、機能を細分化した。

  //ストーリーデータ＆表示オプションをまとめた連想配列がStoryOptionDicであり、これを参照する。
    //（StoryOptionDic/StoryOptionDic.js内にある）

function load_data(story_name){

  let story_option = STORY_OPTIONS.find( ({ name }) => name == story_name );
  let story_script = story_option.script; //当該ストーリーデータ
  load_story_script(story_script);

  //モーダルウインドウでイントロダクション表示
  show_introduction(story_name);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function load_story_script(story_script){
  //# 初期化 #############
	flagArr = [];
	itemArr = [];
	pageArr = [];
	numArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	minimap_folder_name="";
	minimapArr= [];

	savedata_footprintArr = [];

	tob_nameArr = {};

	page_number = 0;

  //####################


  //改行コードの統一
	story_script = story_script.replace(/\r\n/g,'\n');
	story_script = story_script.replace(/\r/g, '\n');

  //「マップ」ボタンは基本的に出さない
	document.getElementById("map_button").style.display="none";

	let file_lineArr = story_script.split("\n");  //テキストを改行で切り、1行1行配列にする



	//アイテム欄の非表示
	hide_item();
	BUTTON_OPENITEM.style.display="none";

	if(!file_lineArr[0].match(/flag:(.+)>/)){
	  alert("ページデータとして不適なものが選択されました。");
	}else{

		//テキスト（file_lineArr）を一行一行、走査する。
		//イテレータはiで、これが今見ている行を指す
		//ページなどのブロック構造があるため、for文内for文でネストさせて見ている。このイテレータもi。
		//そのため、↓にあるこの「外側」にあたるforのループ１回分で、iが増加する量は1かそれ以上になっている。
		for(i=0;i<file_lineArr.length;i++){

			//# 「フラグ」タグ #############
			if(file_lineArr[i].match(/flag:(.+)>/)){
        //例：<flag:2>なら、flagArr=[false,false]になる
			  flagArr = new Array(parseInt(RegExp.$1));
			  for(let j=0;j<flagArr.length;j++){
          flagArr[j]=false;   //flagArrの初期化
			  }
			  i++;
			}
			//# 「アイテム」タグ #############
			if(file_lineArr[i].match(/item:(.+)>/)){
        //アイテムの個数で配列初期化
			  itemArr = new Array(parseInt(RegExp.$1));

			  for(;i<file_lineArr.length;i++){     //タグの終わりまでforを続行する
          if(file_lineArr[i].match(/<\/item>/)){  //タグの終わり
            break;
          }else{
				  //アイテムタグを、名前と説明に分ける
            if(file_lineArr[i].match(/\[(.+?)\](.+?)#(.+)/)){
            itemArr[parseInt(RegExp.$1)] =
                      {nam: open_inline_tag(RegExp.$2),
                      exp: open_inline_tag(RegExp.$3),
                      hav:false};
                      //名前、説明文、所持しているか(初期値はfalse)
            }
          }
			  }
			  i++;
			}

			//マップがあるならば、「マップ」ボタンを出し、表示させる
			if(file_lineArr[i].match(/mapimg:(.+)>/)){
			  document.getElementById("map_button").style.display="inline-block";
			  minimap_folder_name = "Assist/" + RegExp.$1 + "/map/";

			}


			//# 「ページ」タグ #############
      //さいしょはマップタグと呼んでおり、今も<page>ではなく、<map>というタグになっている
      //BF形式なら、まずBTAPの形式に直す
			if(file_lineArr[i].match(/BFmap:([0-9]+)>/)){
				file_lineArr = BF_to_BTAP(file_lineArr, i);
			}

			if(file_lineArr[i].match(/map:([0-9]+)>/)){
				pageArr = new Array(parseInt(RegExp.$1)); //ページがいくつあるかで初期化
				let temp_p=0; //いまどこのページ情報をみているか追っていく。最初のページは「0」ページ目から

				for(;i<file_lineArr.length;i++){    //タグの終わりまでforを続行する
					if(file_lineArr[i] == "</map>"){  //タグの終わり
						break;
					}else{

						if(file_lineArr[i].match(/\[(.+?)\]/)){  //ページ番号
							temp_p=parseInt(RegExp.$1);
							pageArr[temp_p]={nam: "", exp:"", sel:[]};

						//= Gotoタブ実装 =================
              //注意：第0ページの上(<map>タグ直下)には、タブをおかない！
              //なぜかtob()しても第「1」ページに飛んでしまうため！
						}else if(file_lineArr[i].match(/===(.+)===/)){
							tob_nameArr[RegExp.$1] = temp_p + 1;

						//= ページ名 =================
						}else if(file_lineArr[i].match(/n:(.+)/)) {
							pageArr[temp_p]["nam"] = open_inline_tag(RegExp.$1);

            //= ページ文章 =================
						}else if(file_lineArr[i].match(/e:(.+)/)) {
							pageArr[temp_p]["exp"] = open_inline_tag(RegExp.$1);

            //= ページ文章（簡潔にしたバージョン）（改行しないもの） =================
						}else if(file_lineArr[i].match(/\^\^(.*)$/)){
							pageArr[temp_p]["exp"] += open_inline_tag(RegExp.$1);

            //= ページ文章（簡潔にしたバージョン）（改行するもの） =================
						}else if(file_lineArr[i].match(/\^(.*)$/)){  //改行を簡潔にした説明文
							pageArr[temp_p]["exp"] += open_inline_tag(RegExp.$1) + "<br>";

            //= v要素（道具の内容を描写タブ部にかく） =================
						}else if(file_lineArr[i].match(/v:(.*)$/)){
							pageArr[temp_p]["exp"] += itemArr[parseInt(RegExp.$1)]["exp"] + "<br>";

            //= 選択肢 =================
						}else if(file_lineArr[i].match(/s:(.+)#(.+)/)) {
							pageArr[temp_p]["sel"].push(new Array(RegExp.$1, RegExp.$2));

            //= ミニマップのレイヤー =================
            //背景画像指定
						}else if(file_lineArr[i].match(/m:(.+)m(.+)/)) {
							minimapArr.push(new Array(temp_p, RegExp.$1, parseInt(RegExp.$2)));
            //背景画像指定の省略(既定のものを自動で選択)
						}else if(file_lineArr[i].match(/m:(.+)/)) {
							minimapArr.push(new Array(temp_p, RegExp.$1, 1));
						}
					}
				}
			}
		}


		//pageArrとitemArrの内容を、＊JSON形式で＊、d_descに表示するには…
		/*let jstr = JSON.stringify({"fie": pageArr,"ite":itemArr});
		  document.getElementById("d_desc").innerText = jstr;
		  break; */

		document.getElementById("play_toolbuttonsDiv").style.display="inline-block";

		const ALL_PAGE_MODE = document.getElementById("all_page_mode");
		if(ALL_PAGE_MODE.innerHTML!=ToZENPAGE){
      //現在、全ページ閲覧モードの場合、まずページ選択フォームをリセットする
			all_page_sel_clean();
		}

	}
}



//##############################################################################
//BF形式のストーリーをBTAPの形式に直す
	function BF_to_BTAP(BF_lineArr,n){
  //BF_lineArrは、load_dataで読み込んだファイルの一行一行を配列にしたもの。
  //nは、いま見ている行。BF_lineArrの何要素から走査を始めればよいかを指す

	let ispage = false; //いま検討しているのは、ページの内部なのか否か？
	//空白の改行は、「ページの内部の改行」なのか、あるいは「ページとページの間にある区切りの部分」なのかで意味が異なる。
	//走査しながら、今、ページの内外のどちらを見ているのかを示すものがispage変数
	//ispage=trueなら、ページの内部であることを指す


	let temp_p = -1;//現在みているページ番号を追う。あとで+1して初期値0にするので、いまは-1で。
	let back_num = temp_p-1;//「戻る」先のページ番号。(temp_p-1)の数字が入る
	let front_num = temp_p+1;//「進む」先のページ番号。(temp_p+1)の数字が入る

	for(let i = n; i< BF_lineArr.length;i++){
		if(BF_lineArr[n].match(/BFmap:([0-9]+)/)){  //改行を簡潔にした説明文
		  BF_lineArr[n].replace(/BFmap:([0-9]+)/g, "map:($1)");
		}

		//= map部おわり→走査終了 =================
		if(BF_lineArr[i] == "</map>"){
		  break;
		}

		//= ページ開始 =================
		if(BF_lineArr[i].match(/\[(.+)/)){
		  ispage = true;  //ここからページ内部に入る

      //やろうとしていることは以下の変換
      //
      //  [タイトル
      //  描写…
      //
      //  ↓↓↓
      //
      //  [ページ番号]
      //  n:タイトル
      //  描写…
		  temp_p++;
		  back_num = temp_p - 1;
		  front_num = temp_p + 1;

		  BF_lineArr[i] = "[" + temp_p + "]" ;

      //[ページ番号]と描写の間にn要素を割り込ませる
		  BF_lineArr.splice(i+1, 0, "n:" + RegExp.$1);
		  i++;

    //= ページ終了（行末が ] ) =================
		}else if(BF_lineArr[i].match(/\]/)){
		  ispage = false;//ページ終了

      //ページ終了には、]、bf]、b]、f] の4パターンがある。
      //BF形式では基本的に「進む」「戻る」選択肢が自動的に付与されるが、付与は制御可能。
      //bはback、fはfrontを表し、"後ろ／前に壁があるので戻れない"イメージ。
      //たとえばb]なら「進む」しか表示されないし、bf]なら両方表示されない。

		  if(BF_lineArr[i].match(/bf/)){//前後に壁
			BF_lineArr[i] = "";
		  }else if(BF_lineArr[i].match(/b\]/)){//後ろに壁
			BF_lineArr[i] = "s:次へ#mov(" + front_num + ")";
		  }else if(BF_lineArr[i].match(/f\]/)){//前に壁
			BF_lineArr[i] = "s:戻る#mov(" + back_num + ")";
		  }else{//前後に壁無し
			BF_lineArr.splice(i,1,"s:次へ#mov(" + front_num +")", "s:戻る#mov(" + back_num +")");
		  }

		}else if((ispage) &&
            !(BF_lineArr[i].match(/s:/)) &&
            !(BF_lineArr[i].match(/v:/)) &&
            !(BF_lineArr[i].match(/m:/))){

      //行頭に「^」を追加し、ページ描写として読み込めるようにする
		  BF_lineArr[i] = "^" + BF_lineArr[i];
		}
	}

	return(BF_lineArr);//修正を施し、BTAPで読み込めるようにしたBF_lineArrを返す
}


//##############################################################################
//テキスト形式のストーリーファイル読み込み
function load_txt_data(){
	//エラーがあったら、とりあえず中断し「エラーがある」と言っておく
	try{
	  let myFile = document.getElementById("myfile").files[0];

	  let reader = new FileReader();

	  reader.onload = function (evt){
		let txt = evt.target.result;
		load_story_script(txt);   //load_dataへとテキストを送る

    change_tab(2);  //「②みる」タブに移る
    all_page_form_display();  //全ページ閲覧／通常モードで、画面上部のフォーム表示切り替え
    mov(0);
	  }

	  reader.readAsText(myFile, "utf-8");
	  document.getElementById("form_page").reset();

	}catch{
	  alert("ファイル選択にエラーがあります。");
	}
}



//##############################################################################
//ルビやハイパーリンクなどのBTAPタブをHTMLになおす。

function open_inline_tag(story_script){

	//ルビの設定<r> → <ruby>
	story_script = story_script.replace(/<r>(.+?)#(.+?)<\/r>/g, "<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>");

	//ハイパーリンクの設定 <hl> → <span>
	story_script = story_script.replace(/<hl>(.+?)#(.+?)<\/hl>/g,
    "<span  class=\"hl-border\"><a href='#' onclick=\"$2\" class=\"hl-border\" tabindex=\"0\">$1</a></span>");

	return(story_script);
}


//##############################################################################
//「みる」タブの表示
function show_page(){
	let html_code = "";
    //= 開発者モードではないなら、描写文やタイトルをふつうに表示する =================
		if(!is_author){
			html_code =
            '<p class="page-title">'
          +   '<span class="page_nam">'
					+       pageArr[page_number]["nam"]
					+   '</span>'
          + '</p>'
          + '<div>'
					+   pageArr[page_number]["exp"]
					+ '</div>'
          + '<div class="li_div">'
          +   '<ul>';

		//= 開発者モードなら、一部のマークアップタグを外したり別のものに変換してから表示する =================
		}else{
			exp_for_textarea = pageArr[page_number]["exp"];
			exp_for_textarea = exp_for_textarea.replace(/<br>/g,'\n');
			exp_for_textarea = exp_for_textarea.replace(/<\/?ruby>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?rt>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?rp>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?b>/g,'**');

			html_code =
          '<button class="Author_command_button" onclick="copy_textarea_memo()">コピー</button>'
        + '<button class="Author_command_button" onclick="delete_textarea_memo()">クリア</button>'
        + '<textarea id="title_textarea" class="Author_title_textarea" rows="1">'
        + pageArr[page_number]["nam"]
        + '</textarea><textarea id="desc_textarea" class="Author_desc_textarea" rows="20">'
        + exp_for_textarea
        + '</textarea>';

		}

	//# ページの選択肢をつくる #############
	for(let i=0;i<pageArr[page_number]["sel"].length;i++){
	  html_code += '<li class="li_sel">'
          + '<a href="#" onclick="'
            + pageArr[page_number]["sel"][i][1]
          + '" tabindex="0">'
            + pageArr[page_number]["sel"][i][0]
          + '</a></li>';
	}

	html_code += "</ul></div>";

	D_DESC.innerHTML = html_code;

}

//##############################################################################
//モーダルメニューのイントロダクションから、ストーリーを始める
function mov_from_introduction(){
  close_modal();  //まずモーダルメニュー閉じる
  change_tab(2);  //「②みる」タブに移る
  all_page_form_display();  //全ページ閲覧／通常モードで、画面上部のフォーム表示切り替え
  mov(0);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//下に積み上げて表示バージョン
function straight_mov_from_introduction(){
  close_modal();
  change_tab(2);
  straight_mov(); //上とは違い、mov()ではないことに注意
}


//##############################################################################
//開発者モード用  クリップボードにコピー
function copy_textarea_memo() {

  let titl = document.getElementById("title_textarea");
  let desc = document.getElementById("desc_textarea");

  let ans = "["
    + titl.value
    + "\n"
    + desc.value
    + "\nb]\n";

  navigator.clipboard.writeText(ans)
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//開発者モード用  テキストエリアの文字消去
function delete_textarea_memo() {

  let desc = document.getElementById("desc_textarea");

  desc.innerHTML = "";
}

//##############################################################################
//積み上げ表示用のタイトル表示
function stright_title_write(n){
  let temp =
        '<p class="page-title"><span class="page_nam">'
          + pageArr[n]["nam"]
          + "</span></p>";
  return(temp);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//積み上げ表示用の本文表示
function stright_exp_write(page_number){
  let temp = "<div>"
        + pageArr[page_number]["exp"]
        + '</div>';
  return(temp);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//下に積み上げ式のページ表示
//ページを表示するという処理が似ているのでmovの名前をつけた
//やりたいことは、「前のページとタイトルが同じなら、そのページのタイトルは省略して描写文をそのまま書き連ねる」こと。
function straight_mov(){

  //戻る、とばす、最初からなどの、ページ移動機能は表示しない
  document.getElementById("play_toolbuttonsDiv").style.display="none";

  let html_code ="";  //最終表示内容


  //====[ 表示する内容 ]=====
  //0ページ目、および、前のページとタイトルが違うページ→ タイトル(nam) & 内容(exp)
  //                               それ以外： 内容(exp)のみ
  //
  //全ページをforで走査して、html_codeに表示事項を積み上げる。

  for(let each_page_number=0; each_page_number< pageArr.length; each_page_number++){
    if(each_page_number != 0){
      if(pageArr[each_page_number-1]["nam"] == pageArr[each_page_number]["nam"]){
		//0ページ目ではなく、かつ、名前は前ページのそれと同じな場合
        html_code += "<br>" + stright_exp_write(each_page_number)+ "<br><hr>";

      }else{
		//0ページ目ではなく、かつ、名前は前ページのそれと違う場合
        html_code += stright_title_write(each_page_number) +  stright_exp_write(each_page_number) + "<br><hr>";
      }
    }else{
		//0ページめの場合
      html_code += stright_title_write(each_page_number) +  stright_exp_write(each_page_number) + "<br><hr>";
    }
  }

  D_DESC.innerHTML = html_code; //表示

}

//##############################################################################
//モーダルメニューを閉じる
function close_modal() {
  document.getElementById("modalDiv").style.display = "none";
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//モーダルメニューを開く
function open_map(){
  document.getElementById("modalDiv").style.display = "block";
}


//##############################################################################

//ミニマップ
function mapping(mokuji){ //引数mokujiは整数。ページ固有画像名の番号。

  let map = "";
  let ismapappoint = false; //m:タグでページ固有画像が指定されているか否か。されていない（falseのまま）なら、背景画像だけ表示させる。

  if(minimap_folder_name==""){
    map = "このページではマップが用意されておりません。";
  }else{
    for(let i=0;i<minimapArr.length; i++){
      if(minimapArr[i][0]==mokuji){//指定されたページ固有画像の番号
        map += '<img src="' + minimap_folder_name + minimapArr[i][1]
				+ '.png" class="map_img layer_img" alt="エラー：ページ固有画像"/>';
        map += '<img src="' +  minimap_folder_name  + 'map' + minimapArr[i][2]
				+ '.png" class="map_img back_img" alt="エラー：マップ背景画像"/>';
        ismapappoint = true;
        break;
      }
    }

    if(!ismapappoint){//ページ固有画像が指定されていない場合、背景画像だけ表示させる。
      map+= '<img src="' +  minimap_folder_name  + 'map1.png" class="map_img back_img" alt="エラー：マップ背景画像"/>';
    }
  }
    ABST_DESC.innerHTML = map;
}

//##############################################################################
//モーダルウインドウにイントロダクションを表示
function show_introduction(story_name){
  document.getElementById("modalDiv").style.display="inline-block";

  //ストーリーのオプションの確認
  let story_option = STORY_OPTIONS.find( ({ name }) => name == story_name );
  //下に積み上げて表示が可能か
  let if_under_writable = story_option.under_writable;
  //平文版のファイル名
  let cleartext_filename = story_option.cleartext_filename;

  let abst = '<p><span class="page_nam">' + pageArr[page_number]["nam"] + "</span></p>";

  abst += '<div><ul>'
          +'<li class="li_sel">'
          + '<a href="#" onclick="mov_from_introduction();" tabindex="0" accesskey="s">始める(<u>S</u>)</a>'
          + '</li>';

  //= 下に積み上げて表示が可能なら、そのオプションも追加で表示する =================
  if(if_under_writable){
    abst += '<li class="li_sel">'
          + '<a href="#" onclick="straight_mov_from_introduction();" tabindex="0" accesskey="u">下に積み上げて表示(<u>U</u>)</a>'
          + '</li>';
  }

  //= 平文版が有るなら、そのオプションも追加で表示する =================
  if(cleartext_filename != ""){
    abst += '<li class="li_sel">'
          + '<a href="StoryCleartext\\' + cleartext_filename + '.html" target="_blank" tabindex="0" accesskey="c">平文版（新しいタブで開く）(<u>C</u>)</a>'
          + '</li>';
  }

  //===========================
  abst  +=  '</ul></div>'
        +   "<p>[ ページ数 : " + pageArr.length + " ]</p>"
        +   "<p>[ リードミー ]<br>" + itemArr[itemArr.length-1]["exp"] + "</p>";

  //スマホでの見切れ対策。下部に空白入れる。
  abst += "<br><br><br>";

  ABST_DESC.innerHTML = abst;
}



//##############################################################################
// セーブデータ

//セーブデータの文字列を作る
function make_save(){
  let ans = "flg:";    //フラグ
  for(let i=0;i<flagArr.length;i++){
    if(flagArr[i]){
      ans += "t";
    }else{
      ans += "f";
    }
  }

  ans += "\nite:";     //アイテム
  for(let i=0;i<itemArr.length;i++){
    if(itemArr[i]["hav"]){
      ans += "t";
    }else{
      ans += "f";
    }
  }

  ans += "\nfie:" + page_number + "";  //ページ番号

  ans += "\nnum:" + numArr[0];     //番号
  for(let i = 1;i < numArr.length; i++){
    ans += "," + numArr[i];
  }

  return(ans);
}

//セーブデータのフォームへの書き出し ===============
function write_savefile(){
    try{
      let savedata = make_save();
      let t_savedata = document.getElementById("t_savedata")

      t_savedata.innerHTML = "";
      t_savedata.innerHTML = savedata;
      alert("セーブデータを下に書き出しました。\nセーブファイルにペーストして上書きしてください。");
      t_savedata.select();
      document.execCommand("copy");

    }catch{
      alert("エラーあり。")
    }
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//セーブデータのロード
function load_savefile(txt){
  document.getElementById("t_savedata").textContent = txt;

  txt = txt.replace(/\r\n/g,'\n'); //改行コードの統一
  txt = txt.replace(/\r/g, '\n');	 //改行コードの統一

  let Arr = txt.split("\n");
  for(let i = 0;i < Arr.length;i++){
    if(Arr[i].match(/flg:(.*)/)){  //フラグ
      for(let j = 0;j < RegExp.$1.length;j++){
        if(RegExp.$1.charAt(j) == "f"){
          flagArr[j] = false;
        }else{
          flagArr[j] = true;
        }
      }

    }else if(Arr[i].match(/ite:(.*)/)){       //道具
      for(let j = 0; j < RegExp.$1.length; j++){
        if(RegExp.$1.charAt(j) == "f"){
          //itemArr[j]["hav"] = false;
          losi(j);
        }else{
          itemArr[j]["hav"] = true;
          geti(j);
        }
      }
    }else if(Arr[i].match(/fie:(.*)/)){       //ページ名
      page_number = parseInt(RegExp.$1);
    }else if(Arr[i].match(/num:(.*)/)){       //ページ名
      numArr = RegExp.$1.split(",");
    }
  }
  item_reflesh();
  mov(page_number);
  alert("ロードされました。");
}


//##############################################################################
//もとに戻す
function remov(){
  if (savedata_footprintArr.length <= 1){ //セーブ記録がない場合（初期値）
    alert("戻せません");
  }else{
    savedata_footprintArr.shift();
    load_savefile(savedata_footprintArr.shift());//セーブ記録の最初の要素が１つ前のセーブデータ

  /* やっていることは何か?
  savedata_footprintArr(これまで進んできたページの記録リスト)には、セーブデータの文字列が入っている。
  仮にＡページ→Ｂページ→Cページの順に移動する場合を考える。
  それぞれのページにいるときのセーブデータ文字列をa, b, cとすると以下のように処理が行われる。

  1. Aページにいるとき			savedata_footprintArr=[a]
  2. Bページに移動したあと		savedata_footprintArr=[b,a]
  3. Cページに移動したあと		savedata_footprintArr=[c,b,a]
  ↑
  3.でremov()実行時、
    ① まずsavedata_footprintArr.shift()→ [b,a]だけ残る
    ② つぎにload_savefile(savedata_footprintArr.shift()) ←load_savefile(b)と同じことをしている
      shiftによりsavedata_footprintArrは一時的に[a]のみ残る。
    ③ load_savefile(b)によりBページに移動
    ④ movによりsavedata_footprintArrの先頭にbがunshiftされる
    ⑤ 結果としてBページに移動したうえでsavedata_footprintArr=[b,a]。上のリストでいうところの2.に移動する
  */
  }
}

//##############################################################################
//選択肢スキップ
//複数選択肢があるページ、もしくはページの終わり(選択肢0)までスキップする
function page_skip(){

  //= まだページが選択されていないような場合 ==============
  if(pageArr.length == 0){
    alert("スキップできません");

  //= 選択肢の数が0、つまり選択肢がない場合 ==============
  }else if(pageArr[page_number]["sel"].length == 0){
    alert("現在のページでおわりです。");

  //= 選択肢が複数ある場合 ==============
  }else if(pageArr[page_number]["sel"].length != 1){
    alert("現在のページには選択肢が複数あるため、スキップできません。");

  //= 上記の例外以外なら、スキップ可能 ==============
  }else{
    let isskip = window.confirm("次に来る、選択肢が複数あるページまでスキップしますか？（この先にそのようなページがない場合は、最後のページまでスキップされます）");

    if(isskip){
      while(1){
        if (pageArr[page_number]["sel"].length == 1){  //選択肢数が1の時、その先へ
          eval(pageArr[page_number]["sel"][0][1]);
        }else{
          break;
        }
      }
    }
  }
}

//##############################################################################
//「最初から」 進捗リセット
//進捗を初期化するセーブデータを作り、それをロードする
function from_scratch(){
  let ifscratch = window.confirm("進捗を最初に戻しますか？この操作は取り消せません。");
  savedata_footprintArr = [];
  if(ifscratch){
    let temp_save= "flg:";

    for(let i = 0; i<flagArr.length;i++){
      temp_save +="f";
    }

    temp_save +="\nite:";

    for(let j = 0; j<itemArr.length;j++){
      temp_save +="f";
    }

    temp_save += "\nfie:0\nnum:0"
    for(let k = 0; k<numArr.length-1;k++){
      temp_save +=",0";
    }

    load_savefile(temp_save);
  }
}
