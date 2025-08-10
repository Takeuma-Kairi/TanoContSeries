//====================
//# ページ処理関係 ###########

let flagArr = [];  //フラグ
let itemArr = [];  //アイテム[nam:名前, exp:説明, hav:true/falseで所有]
let pageArr = [];  //フィールド[nam:名前, exp:説明, sel:[選択肢名, 実行文章]]
let page_number = 0;      //フィールド番号
let numArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  //番号配列（フラグの補助的）

//====================
//# ミニマップ関係 ###########

let map_src = ""; //ミニマップのsrc。Assist/XXX/map/の中にマップ画像群が入っている。この変数には、文字列XXXが入る。
let local_mapArr =[]; //ミニマップの現在位置を表す画像群を配列にする

//====================

let if_under_writable = false;  //下に積み上げて表示の可否。デフォルトではfalse、つまりページを分けて表示していく

let cleartext_filename = false; //平文版表示するかどうか

let tob_nameArr = {}; //tob関数用の配列。構造→[タブ名: ページ番号]

let ifAuthor = false; //開発者モードか否か。

let save_data_breadcrumbArr = []; //「戻る」用。セーブデータ文字列を入れる配列。パンくず(breadcrumb)リスト。


//====================
//# 通常モード、前ページ閲覧モードの文章 ###
const ToTSUJO= "→通常モード(<u>A</u>)";
const ToZENPAGE= "→全ページ閲覧モード(<u>A</u>)";



//========================
//# それぞれのタブ #############
const TABDIV_PAGE = document.getElementById("tabDiv_page");
const TABDIV_SETTING = document.getElementById("tabDiv_setting");
const TABDIV_SELECT = document.getElementById("tabDiv_select");
const TABDIV_SUMMARY = document.getElementById("tabDiv_summary");

//走査用に配列にする
const TABDIV_ARR = [TABDIV_SETTING, TABDIV_SELECT, TABDIV_PAGE, TABDIV_SUMMARY];


//まずページ選択テーブルのソートをする
window.addEventListener('DOMContentLoaded', function() {
  sort_story_select_table();
});

//ストーリー選択テーブルのソート======================================================
function sort_story_select_table(){
  const STORY_SELECT_TABLE = document.getElementById("story_select_table"); //表
  
  let way = document.getElementById("way_sel").value; //降順？昇順？
  let category = document.getElementById("category_sel").value; //どのカテゴリーでソート？

  //カテゴリー番号================
  //const SUB_NAME_COLUMN = 0;
  //const FILE_NAME_COLUMN = 1;
  const SERIES_COLUMN = 2;
  const MADE_COLUMN = 3;
  const HISTORY_COLUMN = 4;
  //==========================
  
  if(way == "ascend"){  //昇順ならば
    way = 1;
  }else{
    way = -1; //この-1は、あとで掛け算することで方向の符号反転させるためのもの。
  }

  switch (category){
    case "made":  //作成順
      category = MADE_COLUMN;break;
    case "series":  //シリーズ順
      category = SERIES_COLUMN;break;
    case "history": //時系列順
      category = HISTORY_COLUMN;break;
    default:
      break;
  }
  
  //=====================================
  //# 表の順番を記録する配列 ##############
  
  let junArr=[]; 
  
  //構造は３重配列→ [ [ rowのクリック時処理, [セルのinnerHTML、セルのinnerText] ], ...]
  // innerHTMLは単純にそのままコピペ用。
  // innerTextはソート用(後述junArr.sort内部)
  
  //現在の表の情報をjunArrに転記する
  for (i = 1; i < STORY_SELECT_TABLE.rows.length; i++) {
    temp_junArr = [STORY_SELECT_TABLE.rows[i].onclick];
    for(j = 0; j<STORY_SELECT_TABLE.rows[i].cells.length; j++){
      temp_junArr.push(
      [STORY_SELECT_TABLE.rows[i].cells[j].innerHTML,
      STORY_SELECT_TABLE.rows[i].cells[j].innerText]);
    }
    junArr.push(temp_junArr);
  }
  //=====================================

  //↓なぜ動いているのかよくわからない====================
  junArr.sort(function(a, b) {
    if (parseInt(a[category+1][1]) > parseInt(b[category+1][1])) {
      return 1*way;
    } else {
      return -1*way;
    }
  });
  //↑ソートをしてくれていると言うことは分かる====================


  //新しい表の情報をjunArrから転記する====================
  for (i = 1; i < STORY_SELECT_TABLE.rows.length; i++) {
    STORY_SELECT_TABLE.rows[i].onclick = junArr[i-1][0];
    for(j = 0; j < STORY_SELECT_TABLE.rows[i].cells.length; j++){
      STORY_SELECT_TABLE.rows[i].cells[j].innerHTML = junArr[i-1][j+1][0];
    }
  }
}
  
  
//=上のタブ選択リボン(header)を開閉する=========================================
function tab_close(){
  const HEADER = document.getElementById("header");
  const TAB_CLOSE = document.getElementById("tab_close_button");
  
  if(header.style.display == "none"){ //もしリボンが非表示なら、表示させる
    HEADER.style.display = "block";
    TAB_CLOSE.innerText = "↑非表示"; //表示されているので、ボタンは「非表示にさせるならここを押す」旨を表示する     
    TABDIV_PAGE.className = "tabDiv"; //リボン表示に合わせて配置する
    
  }else{  //もしリボンが表示なら、非表示にさせる
    HEADER.style.display = "none";
    TAB_CLOSE.innerText = "↑ 表示";
    TABDIV_PAGE.className = "tabDiv tabDiv_without_header";//リボン非表示に合わせて配置する
  }

}
  
 
//タブの変更=========================================================
function change_tab(selected_tab){  
  //引数のselected_tabは整数。 0:設定、1:選ぶ、2:みる、3:まとめ
  //数字の振り方は開発してきた順。（左側から表示されている順ではない！）
  
  //========================
  //# タブ選択リボンの各ボタン #####
  const LI_SETTING = document.getElementById("li_setting");
  const LI_SELECT = document.getElementById("li_select");
  const LI_PAGE = document.getElementById("li_page");
  const LI_SUMMARY = document.getElementById("li_summary");
  

  //========================
  //# ボタン、タブを配列にする #############
  //# この順番は変更してはいけない。新しくタブを作る場合、第5項目以降に追加していく。
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

//ページを左揃えにする--================================================================
  function change_align_center(){
    const CHB_ALIGN_CENTER = document.getElementById("chb_align_center");
    const DESC_AND_ITEM = document.getElementById("desc_and_item");

    if(CHB_ALIGN_CENTER.checked){
      DESC_AND_ITEM.style.textAlign = "center";
    }else{
      DESC_AND_ITEM.style.textAlign = "left";
    }
  }


//フォントサイズの変更===============================================
//最大30、最小12、デフォルト18にしている。深い意味はない。================
function change_fontsize(p = "18"){
	const MAX = "30";
	const VALUE = "18";
	const MIN = "12";

	let parseInt_result = parseInt(p);
	if (isNaN(parseInt_result)){  //数字じゃないものが入力された場合、デフォルト値に上書きする
		p = VALUE;
	}else{
		if(parseInt_result < 12){
			p = MIN;
		}else if (parseInt_result > 30){
			p = MAX;
		}
	}
  
  //===========================================
	//# スクロールバーなどに反映する ###################
	const REIBUN = document.getElementById("reibun");
	const FONTSIZE_RANGE = document.getElementById("fontsize_range");
	const FONTSIZE_NUMBER = document.getElementById("fontsize_number");

	TABDIV_PAGE.style.fontSize = p + "px";  //本文のフォントサイズ
	REIBUN.style.fontSize = p + "px";  //「フォントサイズ確認サンプル文章」のフォントサイズ

	FONTSIZE_RANGE.value = p; //スクロールバーフォーム
	FONTSIZE_NUMBER.value = p;//数値入力フォーム

}

//画面(tabDiv)横幅の変更=================================
//デフォルト60%にしている。深い意味はない。=====================
function change_tabDivwidth(p="60"){

	let parseInt_result = parseInt(p);

	if (isNaN(parseInt_result)){  //数字じゃないものが入力された場合、デフォルト値に上書きする
		p = "60";
	}else{
		if(parseInt_result < 0){
			p = "0";
		}else if (parseInt_result > 100){
			p = "100";
		}
	}

  //===========================================
	//# スクロールバーなどに反映する ###################
	const TABDIV_WIDTH_RANGE = document.getElementById("tabDiv_width_range");
	const TABDIV_WIDTH_NUMBER = document.getElementById("tabDiv_width_number");

	TABDIV_WIDTH_RANGE.value = p;
	TABDIV_WIDTH_NUMBER.value = p;

	//各tabDivクラスのものに横幅を設定していく
	for(let i=0; i<TABDIV_ARR.length; i++){
		TABDIV_ARR[i].style.width = p + "%";
	}
}

//設定のリセット(横幅、左揃え、フォントサイズ)==========================================================
function reset_setting(){
 	//let chb_yokohaba = document.getElementById("chb_yokohaba");
	const chb_align_center = document.getElementById("chb_align_center");
  const DEFAULT_COLORSCHEME ="default"; //デフォルトのカラースキーム
  
	chb_align_center.checked = false;

	change_align_center();
	change_fontsize();
	change_tabDivwidth();
  
  //カラースキームの変更
  change_colorscheme(DEFAULT_COLORSCHEME);
  document.getElementById("colorscheme_select").value=DEFAULT_COLORSCHEME;
}

//==============================================================
//# アイテム欄の表示・非表示(3関数で1セット)  ###################

//アイテム欄を表示
function unvail_item(){
	let d_item = document.getElementById("d_item");
  let button_openitem = document.getElementById("button_openitem");

	d_item.style.display = "inline-block";
  button_openitem.innerHTML = "↑アイテムを非表示";
}

//アイテム欄を非表示
function hide_item(){
	let d_item = document.getElementById("d_item");
  let button_openitem = document.getElementById("button_openitem");

	d_item.style.display = "none";
  button_openitem.innerHTML = "↓アイテムを表示";
}

//button_openitemのボタン（上で「アイテムを（非）表示」と書いてあるやつ）を押したときの動作
function show_item(){
  let d_item = document.getElementById("d_item");
  let button_openitem = document.getElementById("button_openitem");

  get_item_alert(false);  //新規のアイテムがあるというアラートを消す

  if(d_item.style.display == "none"){ //アイテム欄が表示されていない場合、表示させる。その逆もしかり。
    unvail_item();
  }else{
    hide_item();
  }
}

//=============================================
//カラースキームの変更==============================
function change_colorscheme(colorscheme_name) {
	let colorscheme = document.getElementById("colorscheme");
	colorscheme.href = "Colors/" + colorscheme_name + ".css";
}


//開発者モード==================================================================
function password_insert(){
	let password = prompt("パスワード？");
	if(password == "mmm"){  //そうですパスワードは「mmm」。ソースコードの中に書くなんて、脆弱だねえ！
		ifAuthor= true; //開発者モードであることを示すフラグ

		//全ページ閲覧モード
		document.getElementById("all_page_mode").innerHTML= ToZENPAGE;
		alert("おかえりなさい");
		all_page_mode_change();

	}else{
		alert("パスワードが違います");
	}
}


//==========================================================
//# 全ページ閲覧モード #####################################



//←、→ボタンで選んだ時 ==============
function all_page_step(step){ //stepは1か-1。つまり、前に1つ進むか、後ろに1つ進むか。
  let all_page_sel = document.getElementById("all_page_sel");
  tow_temp=page_number+step;

  //選択ページ番号がオーバーフローしない限り移動できる
  if(tow_temp >=0 && tow_temp<pageArr.length){
    mov(tow_temp);
  }
}

//セレクトリストで選んだ時 ==============
function all_page_mov(tow){
  tow = parseInt(tow);
  mov(tow);
}

//セレクト リストのリセットと書き直し=====================================================
function all_page_sel_clean(){
  let all_page_sel = document.getElementById("all_page_sel");

  all_page_sel.length = 0;

  for(let i=0; i<pageArr.length;i++){ //ページ番号をひとつひとつリストに追加していく
    let op = document.createElement('option');
    op.text=i;
    op.value=i;
    all_page_sel.appendChild(op);
  }

  mov(0);
  all_page_sel.selectedIndex=0;
}


//通常モード、全ページ閲覧モードの入れ替え=================================================
function all_page_mode_change(){


  const all_page_mode = document.getElementById("all_page_mode");
  const all_page_sel = document.getElementById("all_page_sel");
  const all_page_view = document.getElementById("all_page_view");

  //~~~~~ 全ページ閲覧モードへの移行 ~~~~~~~
  if (all_page_mode.innerHTML== ToZENPAGE){
    all_page_mode.innerHTML= ToTSUJO;
    all_page_view.style.display ="inline-block";

    //ページがロードされているならば、いったんリセットしてセレクト リストを書き直す。さもなくば何もしない
    if(pageArr.length != 0){
      all_page_sel_clean();
    }

  //~~~~~ 通常モードへの移行 ~~~~~~
  }else{
    all_page_mode.innerHTML= ToZENPAGE;
    all_page_view.style.display ="none";
  }
}
  