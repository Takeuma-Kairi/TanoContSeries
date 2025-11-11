
//=======================================
//ストーリーデータを整形して得る
function load_data(scr, temp_if_under_writable=false, temp_cleartext_filename=""){
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
//===================================

	/* 下に積み上げて表示するか(するならtrue) */
	if_under_writable = temp_if_under_writable;
  
	/* 平文版あるか(あるならHTMLファイル名、さもなくば空文字) */
	cleartext_filename = temp_cleartext_filename;

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
		if(all_page_mode.innerHTML==ToZENPAGE){
			show_introduction();
		}else{
			all_page_sel_clean();
			show_introduction();
		}
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
	function show_introduction(){
    let page=document.getElementById("abst_desc");
    document.getElementById("modalDiv").style.display="inline-block";

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
    
    if(cleartext_filename != ""){
      abst += '<li class="li_sel">'
            + '<a href="StoryCleartext\\' + cleartext_filename + '.html" target="_blank">平文版（新しいタブで開く）</a>'
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
  
