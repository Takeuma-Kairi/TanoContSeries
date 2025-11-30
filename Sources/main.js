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

//let if_under_writable = false;  //下に積み上げて表示の可否。デフォルトではfalse、つまりページを分けて表示していく

//let cleartext_filename = false; //平文版表示するかどうか

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
  

//=======================================
//ストーリーデータを整形して得る
function load_data(StoryName){
//scr: ストーリーデータのスクリプト
//temp_if_under_writable: 下に積み上げて表示するか否か。初期値はfalse、積み上げて表示しない。

//初期化==============================
	flagArr = [];
	itemArr = [];
	pageArr = [];
	numArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	map_src="";
	local_mapArr= [];

	save_data_breadcrumbArr = [];

	tob_nameArr = {};

	page_number = 0;
  
  let StoryOption = STORY_OPTIONS.find( ({ name }) => name == StoryName );
  
  let scr = StoryOption.script;
//===================================

	//「最初から」ボタンを表示
	//この前後で、straight_mov()によって非表示になっている可能性があるので、改めて表示しておく
	document.getElementById("fromScratch").style.display="inline-block";


	scr = scr.replace(/\r\n/g,'\n'); //改行コードの統一
	scr = scr.replace(/\r/g, '\n');	 //改行コードの統一

	document.getElementById("map_button").style.display="none"; //「マップ」ボタンは基本的に出さない
	let file_lineArr = scr.split("\n");  //テキストを改行で切り、1行1行配列にする
	let myRE = new RegExp("flag:(.+)>");


	//アイテム欄の非表示
	hide_item();
	document.getElementById("button_openitem").style.display="none";

	if(!file_lineArr[0].match(/flag:(.+)>/)){
	  alert("ページデータとして不適なものが選択されました。");
	}else{

		//テキスト（file_lineArr）を一行一行、走査する。
		//イテレータはiで、これが今見ている行を指す
		//ページなどのブロック構造があるため、ネストしたfor文でみている。このイテレータもi。
		//そのため、真下にあるこのforのループ１回分で、iが増加する量は1かそれ以上になっている。
		for(i=0;i<file_lineArr.length;i++){
			//「フラグ」タグ
			if(file_lineArr[i].match(/flag:(.+)>/)){
			  flagfile_lineArr = new Array(parseInt(RegExp.$1));
			  for(let j=0;j<flagArr.length;j++){
				flagArr[j]=false;   //flagArrの初期化
			  }
			  i++;
			}
			//「アイテム」タグ
			if(file_lineArr[i].match(/item:(.+)>/)){
			  itemArr = new Array(parseInt(RegExp.$1));

			  for(;i<file_lineArr.length;i++){     //タグの終わりまでforを続行する
				if(file_lineArr[i].match(/<\/item>/)){  //タグの終わり
				  break;
				}else{
				  //アイテムタグを、名前と説明に分ける
				  if(file_lineArr[i].match(/\[(.+?)\](.+?)#(.+)/)){
					itemArr[parseInt(RegExp.$1)] =
										{nam: OpenInlineTag(RegExp.$2),
										exp: OpenInlineTag(RegExp.$3),
										hav:false};
										//名前、説明文、所持しているか(初期値はfalse)
				  }
				}
			  }
			  i++;
			}
			
			if(file_lineArr[i].match(/mapimg:(.+)>/)){//マップがあるとき、「マップ」ボタンを出し、表示させる
			  document.getElementById("map_button").style.display="inline-block";
			  map_src = "Assist/" + RegExp.$1 + "/map/";
			  
			}
			
			if(file_lineArr[i].match(/BFmap:([0-9]+)>/)){ //BF形式なら、まずBTAPの形式に直す
				file_lineArr = BFtoBTAP(file_lineArr, i);
			}

			//「マップ(フィールド)」タグ
			if(file_lineArr[i].match(/map:([0-9]+)>/)){
				pageArr = new Array(parseInt(RegExp.$1));
				let temp_map=0;

				for(;i<file_lineArr.length;i++){    //タグの終わりまでforを続行する
					if(file_lineArr[i] == "</map>"){  //タグの終わり
						break;
					}else{

						if(file_lineArr[i].match(/\[(.+?)\]/)){  //フィールド番号
							temp_map=parseInt(RegExp.$1);
							pageArr[temp_map]={nam: "", exp:"", sel:[]};

						 //Gotoタブ実装
						 //注意：第0ページの上(<map>タグ直下)には、タブをおかない！tob()しても第「1」ページに飛んでしまう！
						}else if(file_lineArr[i].match(/===(.+)===/)){
							tob_nameArr[RegExp.$1] = temp_map + 1;

							//======================================================
						}else if(file_lineArr[i].match(/n:(.+)/)) {  //名前
							pageArr[temp_map]["nam"] = OpenInlineTag(RegExp.$1);

						}else if(file_lineArr[i].match(/e:(.+)/)) {  //説明文
							pageArr[temp_map]["exp"] = OpenInlineTag(RegExp.$1);

						}else if(file_lineArr[i].match(/\^\^(.*)$/)){  //改行を簡潔にした説明文
							pageArr[temp_map]["exp"] += OpenInlineTag(RegExp.$1);

						}else if(file_lineArr[i].match(/\^(.*)$/)){  //改行を簡潔にした説明文
							pageArr[temp_map]["exp"] += OpenInlineTag(RegExp.$1) + "<br>";

						}else if(file_lineArr[i].match(/v:(.*)$/)){  //v要素（道具の内容を描写タブ部にかく）
							pageArr[temp_map]["exp"] += itemArr[parseInt(RegExp.$1)]["exp"] + "<br>";

						}else if(file_lineArr[i].match(/s:(.+)#(.+)/)) { //選択肢
							pageArr[temp_map]["sel"].push(new Array(RegExp.$1, RegExp.$2));
			
						}else if(file_lineArr[i].match(/m:(.+)m(.+)/)) { //マップのレイヤー
							local_mapArr.push(new Array(temp_map, RegExp.$1, parseInt(RegExp.$2)));
						}else if(file_lineArr[i].match(/m:(.+)/)) { //マップのレイヤー
							local_mapArr.push(new Array(temp_map, RegExp.$1, 1));
						}
					}
				}
			}
		}


		//pageArrとitemArrの内容を、＊JSON形式で＊、d_descに表示するには…
		/*let jstr = JSON.stringify({"fie": pageArr,"ite":itemArr});
		  document.getElementById("d_desc").innerText = jstr;
		  break; */
		
		document.getElementById("button_redo_and_skip").style.display="inline-block";

		let all_page_mode = document.getElementById("all_page_mode");
		if(all_page_mode.innerHTML!=ToZENPAGE){
			all_page_sel_clean();
		}
    
		show_introduction(StoryName);
	}
}

  

//BF形式のストーリーをBTAPの形式に直す================================================
	function BFtoBTAP(BF_lineArr,n){
		//BF_lineArrは、load_dataで読み込んだファイルの一行一行を配列にしたもの。（file_lineArr変数が送られる）
		//nは、いま見ている行。BF_lineArrの何要素から走査を始めればよいかを指す
		
		
	let ifpage = false; //いま検討しているのは、ページの内部なのか否か？
	//空白の改行は、「ページの内部の改行」なのか、あるいは「ページとページの間にある区切りの部分」なのかで意味が異なる。
	//走査しながら、今、ページの内外のどちらを見ているのかを示すものがifpage変数
	//ifpage=trueなら、ページの内部であることを指す
	
	
	let temp_num = -1;//いまのページ番号
	let back_num = temp_num-1;//「戻る」先のページ番号
	let front_num = temp_num+1;//「進む」先のページ番号

	for(let i = n; i< BF_lineArr.length;i++){
		if(BF_lineArr[n].match(/BFmap:([0-9]+)/)){  //改行を簡潔にした説明文
		  BF_lineArr[n].replace(/BFmap:([0-9]+)/g, "map:($1)");
		}

		//map部おわり→走査終了
		if(BF_lineArr[i] == "</map>"){
		  break;
		}

		//ページ開始
		if(BF_lineArr[i].match(/\[(.+)/)){
		  temp_num++;
		  back_num = temp_num - 1;
		  front_num = temp_num + 1;
		  BF_lineArr[i] = "[" + temp_num + "]" ;
		  BF_lineArr.splice(i+1, 0, "n:" + RegExp.$1); //"n:" + RegExp.$1);//n要素の追加
		  i++;
		  ifpage = true;

		}else if(BF_lineArr[i].match(/\]/)){
		  if(BF_lineArr[i].match(/bf/)){//前後に壁
			BF_lineArr[i] = "";
		  }else if(BF_lineArr[i].match(/b\]/)){//後ろに壁
			BF_lineArr[i] = "s:次へ#mov(" + front_num + ")";
		  }else if(BF_lineArr[i].match(/f\]/)){//後ろに壁
			BF_lineArr[i] = "s:戻る#mov(" + back_num + ")";
		  }else{//前後に壁無し
			BF_lineArr.splice(i,1,"s:次へ#mov(" + front_num +")", "s:戻る#mov(" + back_num +")");
		  }
		  ifpage = false;//ページ終了を示す
		  
		}else if((ifpage) &&
				!(BF_lineArr[i].match(/s:/)) &&
				!(BF_lineArr[i].match(/v:/)) &&
				!(BF_lineArr[i].match(/m:/))){ //e要素に「^」を追加
		  BF_lineArr[i] = "^" + BF_lineArr[i];
		}
	}

	return(BF_lineArr);//修正を施し、BTAPで読み込めるようにしたBF_lineArrを返す
}


//===============================================================
//テキスト形式のストーリーファイル読み込み
function load_txt_data(){
	//エラーがあったら、とりあえず中断し「エラーがある」と言っておく
	try{	
	  let myFile = document.getElementById("myfile").files[0];
	  
	  let reader = new FileReader();
	  
	  reader.onload = function (evt){
		let txt = evt.target.result;
		load_data(txt);   //load_dataへとテキストを送る
	  }
	  
	  reader.readAsText(myFile, "utf-8");
	  document.getElementById("form_page").reset();
	  
	}catch{
	  alert("ファイル選択にエラーがあります。");
	}
}




//ルビやハイパーリンクなどのBTAPタブをHTMLになおす。==============================

function OpenInlineTag(scr){
	let ans = scr;

	//ルビの設定<r> → <ruby>
	ans = ans.replace(/<r>(.+?)#(.+?)<\/r>/g, "<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>");

	//ハイパーリンクの設定 <hl> → <span>
	ans = ans.replace(/<hl>(.+?)#(.+?)<\/hl>/g, 
    "<span  class=\"hl-border\"><a href='#' onclick=\"$2\" class=\"hl-border\" tabindex=\"0\">$1</a></span>");

	return(ans);
}


//==============================================================================
//「みる」タブの表示
function show_page(){
	let page=document.getElementById("d_desc");
	//ストーリー名＆ストーリー説明div

	let ans = "";
		if(!ifAuthor){  //開発者モードではないなら、ふつうに表示する。
			ans = '<p class="page-title"><span class="page_nam">'
					+ pageArr[page_number]["nam"]
					+ "</span></p><div>"
					+ pageArr[page_number]["exp"]
					+ '</div><div class="li_div"><ul>';
		  
		}else{ //開発者モードなら、一部のマークアップタグを外したり別のものに変換してから表示する
			exp_for_textarea = pageArr[page_number]["exp"];
			exp_for_textarea = exp_for_textarea.replace(/<br>/g,'\n');  
			exp_for_textarea = exp_for_textarea.replace(/<\/?ruby>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?rt>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?rp>/g,'');
			exp_for_textarea = exp_for_textarea.replace(/<\/?b>/g,'**');
	  
			ans = '<button class="Author_command_button" onclick="copy_textarea_memo()">コピー</button>'
		       +'<button class="Author_command_button" onclick="delete_textarea_memo()">クリア</button>'
		       +'<textarea id="title_textarea" class="Author_title_textarea" rows="1">'
					+ pageArr[page_number]["nam"]
					+ '</textarea><textarea id="desc_textarea" class="Author_desc_textarea" rows="20">'
					+ exp_for_textarea
					+ '</textarea>';


		}

	//ページの選択肢をつくっていく
	for(let i=0;i<pageArr[page_number]["sel"].length;i++){
	  ans += '<li class="li_sel">'
          + '<a href="#" onclick="' 
            + pageArr[page_number]["sel"][i][1] 
          + '" tabindex="0">'
            + pageArr[page_number]["sel"][i][0]
          + '</a></li>';
	}
	
	ans += "</ul></div>";

	page.innerHTML = ans;


}

//================================================
//モーダルメニューのイントロダクションから、ストーリーを始める
function mov_from_introduction(){
  close_modal();  //まずモーダルメニュー閉じる
  change_tab(2);  //「②みる」タブに移る
  //scrollTo(0,0);
  mov(0);
}

//下に積み上げて表示バージョン
function straight_mov_from_introduction(){
  close_modal();  //まずモーダルメニュー閉じる
  change_tab(2);  //「②みる」タブに移る
  //scrollTo(0,0);
  straight_mov();
}
//開発者モード用  クリップボードにコピー================================================
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
//開発者モード用  テキストエリアの文字消去===================================================
function delete_textarea_memo() {

  let desc = document.getElementById("desc_textarea");

  desc.innerHTML = "";
}

//積み上げ表示用のタイトル表示==================================================
function fie_title_write(page_number){
  let temp = 
        '<p class="page-title"><span class="page_nam">'
          + pageArr[page_number]["nam"]
          + "</span></p>";
  return(temp);
}

//積み上げ表示用の本文表示====================================================
function fie_exp_write(page_number){
  let temp = "<div>" 
        + pageArr[page_number]["exp"]
        + '</div>';
  return(temp);
}

//===========================================================================
function straight_mov(){  //movという名前だが、下に積み上げ式のfie表示
//やりたいことは、「前のページとタイトルが同じなら、そのページのタイトルは省略して描写文をそのまま書き連ねる」こと。

  page_number = 0;
  
  //下に積み上げて表示するなら、「最初から」ボタンは表示しないで良い
  document.getElementById("fromScratch").style.display="none";
  
  let page=document.getElementById("d_desc"); 
  let ans ="";  //最終表示内容
  
  
  //====[ 表示する内容 ]=====
  //0ページ目、および、前のページとタイトルが違うページ→ タイトル(nam) & 内容(exp)
  //                               それ以外： 内容(exp)のみ
  //
  //全ページをforで走査して、ansに表示事項を積み上げる。
  
  for(let each_page_number=0; each_page_number< pageArr.length; each_page_number++){
    if(each_page_number != 0){ 
      if(pageArr[each_page_number-1]["nam"] == pageArr[each_page_number]["nam"]){ 
		//0ページ目ではなく、名前は前と同じな場合
        ans += "<br>" + fie_exp_write(each_page_number)+ "<br><hr>"; 
		
      }else{
		//0ページ目ではなく、名前は前と違う場合
        ans += fie_title_write(each_page_number) +  fie_exp_write(each_page_number) + "<br><hr>"; 
      }
    }else{
		//0ページめの場合
      ans += fie_title_write(each_page_number) +  fie_exp_write(each_page_number) + "<br><hr>"; 
    }
  }
  
  page.innerHTML = ans; //表示
  
}

//========================================================================
//モーダルメニューを閉じる
function close_modal() {
  document.getElementById("modalDiv").style.display = "none";
}
//おなじく閉じる
function open_map(){
  document.getElementById("modalDiv").style.display = "block";
}

//====================================
//# ミニマップ ######################
function mapping(mokuji){ //引数mokujiは整数。ページ固有画像名の番号。
  let page=document.getElementById("abst_desc");
  
  let map = "";
  let ifmapappoint = false; //m:タグでページ固有画像が指定されているか否か。されていない（falseのまま）なら、背景画像だけ表示させる。
  
  if(map_src==""){
    map = "このページではマップが用意されておりません。";
  }else{
    for(let i=0;i<local_mapArr.length; i++){
      if(local_mapArr[i][0]==mokuji){//指定されたページ固有画像の番号
        map += '<img src="' + map_src + local_mapArr[i][1] 
				+ '.png" class="map_img layer_img" alt="エラー：ページ固有画像"/>';
        map += '<img src="' +  map_src  + 'map' + local_mapArr[i][2] 
				+ '.png" class="map_img back_img" alt="エラー：マップ背景画像"/>';
        ifmapappoint = true;
        break;
      }
    }
   
    if(!ifmapappoint){//ページ固有画像が指定されていない場合、背景画像だけ表示させる。
      map+= '<img src="' +  map_src  + 'map1.png" class="map_img back_img" alt="エラー：マップ背景画像"/>';
    }
  }
    page.innerHTML = map;
}

	//========================================================================

	//イントロダクションを表示
	function show_introduction(StoryName){
    let page=document.getElementById("abst_desc");
    document.getElementById("modalDiv").style.display="inline-block";

    //ストーリーのオプションの確認
    let StoryOption = STORY_OPTIONS.find( ({ name }) => name == StoryName );
    //下に積み上げて表示が可能か
    let if_under_writable = StoryOption.under_writable;
    //平文版のファイル名
    let cleartext_filename = StoryOption.cleartext_filename;
    
		let abst = '<p><span class="page_nam">' + pageArr[page_number]["nam"] + "</span></p>";

		abst += '<div><ul>'
            +'<li class="li_sel">'
            + '<a href="#" onclick="mov_from_introduction();" tabindex="0" accesskey="s">始める(<u>S</u>)</a>'
            + '</li>';
    
    if(if_under_writable){  //下に積み上げて表示が可能なら、そのオプションも追加で表示する
      abst += '<li class="li_sel">'
            + '<a href="#" onclick="straight_mov_from_introduction();" tabindex="0" accesskey="u">下に積み上げて表示(<u>U</u>)</a>'
            + '</li>';
    }
    
    
    if(cleartext_filename != ""){ //平文版の有無の判定
      abst += '<li class="li_sel">'
            + '<a href="StoryCleartext\\' + cleartext_filename + '.html" target="_blank" tabindex="0" accesskey="c">平文版（新しいタブで開く）(<u>C</u>)</a>'
            + '</li>';
    }
    //===========================
    abst += '</ul></div>';                          

		//ページ数
		abst += "<p>[ ページ数 : " + pageArr.length + " ]</p>";

		//リードミー
		abst += "<p>[ リードミー ]<br>" + itemArr[itemArr.length-1]["exp"] + "</p>";

    //スマホでの見切れ対策。空白入れる。
    abst += "<br><br><br>";
    
		page.innerHTML = abst;
	}



  //アイテムの有無でオプションボタンを変える===========================================
  function display_ite(){
    let item_sel = document.getElementById("d_item_sel");
    let item_exp = document.getElementById("d_item_exp");
    item_exp.innerHTML="";
    item_sel.innerHTML="";

    for(let i=0;i<itemArr.length;i++){
      if(itemArr[i]["hav"]){
        //「もちもの」タブにラジオボタンを追加する。
        item_sel.innerHTML += '<label><input type="radio" name="item" onclick="' +
                                'document.getElementById(&quot;d_item_exp&quot;).innerHTML=&quot;' +
                                itemArr[i]["exp"] + '&quot;"/>' +
                                itemArr[i]["nam"] + "</label><br>";
      }
    }
  }
  //新アイテム獲得！アラートを発する==============================
  function get_item_alert(ifalert){
		let button_openitem = document.getElementById("button_openitem");

		button_openitem.style.display="inline-block";

		if(ifalert){
			button_openitem.className="tool_button openitem get_item_alert";
		}else{
			button_openitem.className="tool_button openitem";
		}
	}


  //アイテム欄をリフレッシュする。戻るなど==============================
  function ite_reflesh(){
    let if_hav_any_item = false;  
    //アイテムが存在していないなら、「アイテムを表示」ボタンは表示させないための判定
    for(let i=0; i< itemArr.length;i++){
      if(itemArr[i]["hav"]){
        geti(i);
        if_hav_any_item = true;
      }
    } 

    hide_item();
    
    let button_openitem = document.getElementById("button_openitem");
		button_openitem.className="tool_button openitem";
    
    //アイテムが存在していないなら、「アイテムを表示」ボタンは表示させない
    if(!if_hav_any_item){
      button_openitem.style.display="none";    
    }
  } 
  
//========================================
//# セーブデータ #########################

//セーブデータの文字列を作る==============
function makesave(){
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
      let savedata = makesave();
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

//セーブデータのロード================
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
    ite_reflesh();
    mov(page_number);
    alert("ロードされました。");
  }



  //もとに戻す==================================
  function remov(){
    if (save_data_breadcrumbArr.length <= 1){ //セーブパンくずがない場合（初期値）
      alert("戻せません");
    }else{
      save_data_breadcrumbArr.shift();
      load_savefile(save_data_breadcrumbArr.shift());//セーブパンくずの最初の要素が１つ前のセーブデータ
	  
	  /* やっていることは何か?
	  save_data_breadcrumbArr(これまで進んできたページのパンくずリスト)には、セーブデータの文字列が入っている。
	  仮にＡページ→Ｂページ→Cページの順に移動する場合を考える。
	  それぞれのページにいるときのセーブデータ文字列をa, b, cとすると以下のように処理が行われる。
		
    1. Aページにいるとき			save_data_breadcrumbArr=[a]
    2. Bページに移動したあと		save_data_breadcrumbArr=[b,a]
    3. Cページに移動したあと		save_data_breadcrumbArr=[c,b,a]
		↑
		3.でremov()実行時、
      ① まずsave_data_breadcrumbArr.shift()→ [b,a]だけ残る
			② つぎにload_savefile(save_data_breadcrumbArr.shift()) ←load_savefile(b)と同じことをしている
        shiftによりsave_data_breadcrumbArrは一時的に[a]のみ残る。
      ③ load_savefile(b)によりBページに移動
			④ movによりsave_data_breadcrumbArrの先頭にbがunshiftされる
			⑤ 結果としてBページに移動したうえでsave_data_breadcrumbArr=[b,a]。上のリストでいうところの2.に移動する
	  */
    }
  }

  //選択肢スキップ==============================
  function pageskip(){

		if(pageArr.length == 0){ //まだページが選択されていない
			alert("スキップできません");
		}else if(pageArr[page_number]["sel"].length == 0){
			alert("現在のページでおわりです。");
		}else if(pageArr[page_number]["sel"].length != 1){
			alert("現在のページには選択肢が複数あるため、スキップできません。");
		}else{
			let ifskip = window.confirm("次に来る、選択肢が複数あるページまでスキップしますか？（この先にそのようなページがない場合は、最後のページまでスキップされます）");

			if(ifskip){
				while(1){
					if (pageArr[page_number]["sel"].length == 1){  //選択肢数が1の時、その先へ
						eval(pageArr[page_number]["sel"][0][1]);
					}else{
						//alert("スキップしました");  //複数選択肢があるページ、もしくはページの終わり(選択肢0)までスキップ
						break;
					}
				}
			}
		}
  }

  //「最初から」==============================
  function fromScratch(){
    let ifscratch = window.confirm("進捗を最初に戻しますか？この操作は取り消せません。");
    save_data_breadcrumbArr = [];
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
