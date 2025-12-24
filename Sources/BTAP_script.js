//ストーリーの選択肢で書くスクリプトコマンド

//マップ移動
function mov(tow) {
  page_number = tow;
  let temp  =make_save();
  savedata_footprintArr.unshift(temp);  //セーブデータを追加する（「戻る」用 ）

  mapping(tow);

  //全ページ閲覧モードなら、セレクト リストに反映する
  let all_page_mode = document.getElementById("all_page_mode");
  if(all_page_mode.textContent == ToTSUJO){
    all_page_sel.selectedIndex=tow;
  }
  
  show_page();
}

// ====================================================
//タブによるGoto
function tob(tow){
  mov(tob_nameArr[tow]);
}

// ====================================================
// フラグ処理

//フラグtrueに
function onflg(n){
  flagArr[n]=true;
}

//フラグfalseに
function offlg(n){
  flagArr[n]=false;
}

//フラグがtrueか
function iflg(n){
  return(flagArr[n]);
}

// ====================================================
// アイテム処理

// アイテム獲得
function geti(n){
	if(!itemArr[n]["hav"]){
		get_item_alert(true);
	}

  itemArr[n]["hav"]=true;
  listing_item();
}

//アイテムをなくす
function losi(n){
  itemArr[n]["hav"]=false;
  item_reflesh();
  listing_item();
}

//道具を持っているかを返す(true,false)
function hav(n){
  return(itemArr[n]["hav"]);
}

// ====================================================

//gebi：document.getElementById(id).innerHTML = str の糖衣
function gebi(id, str){
  document.getElementById(id).innerHTML = str;
}

// ====================================================
// 数値の取り扱い

//番号の書き込み
function wnum(i, num){
  numArr[i] = num;
}

//番号の読み込み
function rnum(i){
  return(numArr[i]);
}

//numArrの引き算(numArr要素からnumArr要素を引く)
function nminn(n1, n2){
  numArr[n1] -= numArr[n2];
}

//numArrの引き算(numArr要素から実際に数字を引く)
function nminx(n, x){
  numArr[n] -= x;
}


//numArrの足し算(numArr要素にnumArr要素を足す)
function naddn(n1, n2){
  numArr[n1] += numArr[n2];
}

//numArrの足し算(numArr要素に実際に数字を足す)
function naddx(n, x){
  numArr[n] += x;
}

//Math.randomの糖衣
function rand(){
  return(Math.random());
}

//Math.floorの糖衣
function flor(x){
  return(Math.floor(x));
}

//Math.ceilの糖衣
function ceil(x){
  return(Math.ceil(x));
}
