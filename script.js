var flgarr = [];  //フラグ
var itearr = [];  //アイテム[nam:名前, exp:説明, hav:true/falseで所有]
var fiearr = [];  //フィールド[nam:名前, exp:説明, sel:[選択肢名, 実行文章]]
var fie = 0;      //フィールド番号
var numarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  //番号配列（フラグの補助的）


var breadcrumbs = []; //セーブデータの配列。パンくず。

//ページ選択テーブルのソート======================================================
function sort_page_sel_table(){
		var way = document.getElementById("way_sel").value;
		var category = document.getElementById("category_sel").value;
		var table = document.getElementById("page_sel_table");
		
		const name_clm = 0;
		const series_clm = 1;
		const made_clm = 2;
		const history_clm = 3;
		
		if(way == "ascend"){
			way = 1;
		}else{
			way = -1;
		}
		
		switch (category){
			case "made":
				category = made_clm;break;
			case "series":
				category = series_clm;break;
			case "history":
				category = history_clm;break;
			default: 
				break;
		}
		
		var jun=[];

		for (i = 1; i < table.rows.length; i++) {
			temp_jun = [table.rows[i].onclick];
			for(j = 0; j<table.rows[i].cells.length; j++){
				temp_jun.push(
				[table.rows[i].cells[j].innerHTML,
				table.rows[i].cells[j].innerText]);
			}
			jun.push(temp_jun);
		}
		
		jun.sort(function(a, b) {
			if (parseInt(a[category+1][1]) > parseInt(b[category+1][1])) {
				return 1*way;
			} else {
				return -1*way;
			}
		});
		
				
		for (i = 1; i < table.rows.length; i++) {
      table.rows[i].onclick = jun[i-1][0];
			for(j = 0; j < table.rows[i].cells.length; j++){
				table.rows[i].cells[j].innerHTML = jun[i-1][j+1][0];
			}
		}
	}

//ヘッダータブの変更=========================================================
	function change_li(selected_li){
		var li_setting = document.getElementById("li_setting");
		var li_select = document.getElementById("li_select");
		var li_page = document.getElementById("li_page");
		
		var ran_setting = document.getElementById("ran_setting");
		var ran_select = document.getElementById("ran_select");
		var ran_page = document.getElementById("ran_page");
		
		var li_arr = [li_setting, li_select, li_page];
		var ran_arr = [ran_setting, ran_select, ran_page];
		
		for(var i = 0; i < li_arr.length; i++){
			if(i==selected_li){
				li_arr[i].className = "active-li";
				ran_arr[i].style.display="block";
			}else{
				li_arr[i].className = "non-active_li";
				ran_arr[i].style.display="none";
			}
		}
	}
 
//横幅の制限--================================================================
  function change_yokohaba(){
    var chb_yokohaba = document.getElementById("chb_yokohaba");
    var desc_and_item = document.getElementById("desc_and_item");
    
    if(chb_yokohaba.checked){
      desc_and_item.style.width = "330px";
    }else{
      desc_and_item.style.width = "100%";
    }
  }
  
//ページを左揃えにする--================================================================  
  function change_align_left(){
    var chb_align_left = document.getElementById("chb_align_left");
    var desc_and_item = document.getElementById("desc_and_item");
    
    if(chb_align_left.checked){
      desc_and_item.style.textAlign = "left";
    }else{
      desc_and_item.style.textAlign = "center";
    }
  }
	

//フォントサイズの変更========================================================== 	
function change_fontsize(){
	var range_fontsize = document.getElementById("range_fontsize");
	var ran_page = document.getElementById("ran_page");
	var reibun = document.getElementById("reibun");
	ran_page.style.fontSize = range_fontsize.value + "px";
	reibun.style.fontSize = range_fontsize.value + "px";
}
//設定のリセット(横幅、左揃え、フォントサイズ)==========================================================  
function reset_setting(){
  var chb_yokohaba = document.getElementById("chb_yokohaba");
	var chb_align_left = document.getElementById("chb_align_left");
	var range_fontsize = document.getElementById("range_fontsize");
	
	chb_yokohaba.checked = false;
	chb_align_left.checked = false;
	range_fontsize.value = 16;
	
	change_yokohaba();
	change_align_left();
	change_fontsize();
}
//アイテム欄の表示・非表示==========================================================  
function hide_item(){
	var d_item = document.getElementById("d_item");
  var button_openitem = document.getElementById("button_openitem");
	
	d_item.style.display = "none";
  button_openitem.innerHTML = "↓アイテムを表示";
}

function unvail_item(){
	var d_item = document.getElementById("d_item");
  var button_openitem = document.getElementById("button_openitem");
	
	d_item.style.display = "inline-block";
  button_openitem.innerHTML = "↑アイテムを非表示";
}

  function show_item(){   
    var d_item = document.getElementById("d_item");
    var button_openitem = document.getElementById("button_openitem");
    
		geti_alert(false);
		
		
	  if(d_item.style.display == "none"){
      unvail_item();
    }else{
      hide_item();
    }
  }
//カラースキームの変更==========================================================  
function change_colorscheme(colorscheme_name) {
	var colorscheme = document.getElementById("colorscheme");
	colorscheme.href = "Colors/" + colorscheme_name + ".css";
}


window.addEventListener('DOMContentLoaded', function() {
  sort_page_sel_table();
});

//================
//セーブデータの書き出し
function write_savefile(){
    try{
      var savedata = makesave();
      var t_savedata = document.getElementById("t_savedata")

      t_savedata.innerHTML = "";
      t_savedata.innerHTML = savedata;
      alert("セーブデータを下に書き出しました。\nセーブファイルにペーストして上書きしてください。");
      t_savedata.select();
      document.execCommand("copy");

    }catch{
      alert("エラーあり。")
    }
  }
  
//================
//セーブデータのロード
  function load_savefile(txt){
    document.getElementById("t_savedata").textContent = txt;

  txt = txt.replace(/\r\n/g,'\n'); //改行コードの統一
  txt = txt.replace(/\r/g, '\n');	 //改行コードの統一

    var arr = txt.split("\n");
    for(var i = 0;i < arr.length;i++){
      if(arr[i].match(/flg:(.*)/)){             //フラグ
        for(var j = 0;j < RegExp.$1.length;j++){
          if(RegExp.$1.charAt(j) == "f"){
            flgarr[j] = false;
          }else{
            flgarr[j] = true;
          }
        }

      }else if(arr[i].match(/ite:(.*)/)){       //道具
        for(var j = 0; j < RegExp.$1.length; j++){
          if(RegExp.$1.charAt(j) == "f"){
            itearr[j]["hav"] = false;
          }else{
            itearr[j]["hav"] = true;
          }
        }
      }else if(arr[i].match(/fie:(.*)/)){       //ページ名
        fie = parseInt(RegExp.$1);
      }else if(arr[i].match(/num:(.*)/)){       //ページ名
        numarr = RegExp.$1.split(",");
      }
    }

    show_page();
    alert("セーブデータがロードされました。")
  }



  //セーブデータ書き込み用
  function makesave(){
    var ans = "flg:";    //フラグ
    for(var i=0;i<flgarr.length;i++){
      if(flgarr[i]){
        ans += "t";
      }else{
        ans += "f";
      }
    }

    ans += "\nite:";     //アイテム
    for(var i=0;i<itearr.length;i++){
      if(itearr[i]["hav"]){
        ans += "t";
      }else{
        ans += "f";
      }
    }

    ans += "\nfie:" + fie + "";  //ページ番号

    ans += "\nnum:" + numarr[0];     //番号
    for(var i = 1;i < numarr.length; i++){
      ans += "," + numarr[i];
    }

    return(ans);
  }


  //=======================================
  //ページデータを整形して得る
  function load_data(scr){
    scr = scr.replace(/\r\n/g,'\n'); //改行コードの統一
    scr = scr.replace(/\r/g, '\n');	 //改行コードの統一
    
    var arr = scr.split("\n");
    var myRE = new RegExp("flag:(.+)>");

		flgarr = [];
		itearr = [];
		fiearr = [];
		numarr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		breadcrumbs = [];
		fie = 0;
		
		//アイテム欄の非表示
		hide_item();
		document.getElementById("button_openitem").style.display="none";
		
    if(!arr[0].match(/flag:(.+)>/)){
      alert("ページデータとして不適なものが選択されました。");
    }else{

      //走査する
      for(i=0;i<arr.length;i++){
        //「フラグ」タグ
        if(arr[i].match(/flag:(.+)>/)){
          flgarr = new Array(parseInt(RegExp.$1));
          for(var j=0;j<flgarr.length;j++){
            flgarr[j]=false;   //flagarrの初期化
          }
          i++;
        }
        //「アイテム」タグ
        if(arr[i].match(/item:(.+)>/)){
          itearr = new Array(parseInt(RegExp.$1));

          for(;i<arr.length;i++){     //タグの終わりまでforを続行する
            if(arr[i].match(/<\/item>/)){  //タグの終わり
              break;
            }else{
              //アイテムタグを、名前と説明に分ける
              if(arr[i].match(/\[(.+?)\](.+?)#(.+)/)){
                itearr[parseInt(RegExp.$1)] = 
									{nam: OpenInlineTag(RegExp.$2), 
									exp: OpenInlineTag(RegExp.$3),
									hav:false};
									//名前、説明文、所持しているか(初期値はfalse)
              }
            }
          }
          i++;
        }
        if(arr[i].match(/BFmap:([0-9]+)>/)){
            arr = BFtoBTAP(arr, i);
				}

				//「マップ(フィールド)」タグ
				if(arr[i].match(/map:([0-9]+)>/)){
					fiearr = new Array(parseInt(RegExp.$1));
					var temp_map=0;

					for(;i<arr.length;i++){    //タグの終わりまでforを続行する
						if(arr[i] == "</map>"){  //タグの終わり
							break;
						}else{
							if(arr[i].match(/\[(.+?)\]/)){  //フィールド番号
								temp_map=parseInt(RegExp.$1);
								fiearr[temp_map]={nam: "", exp:"", sel:[]};
								
							}else if(arr[i].match(/n:(.+)/)) {  //名前
								fiearr[temp_map]["nam"] = OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/e:(.+)/)) {  //説明文
								fiearr[temp_map]["exp"] = OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/\^\^(.*)$/)){  //改行を簡潔にした説明文
								fiearr[temp_map]["exp"] += OpenInlineTag(RegExp.$1);
								
							}else if(arr[i].match(/\^(.*)$/)){  //改行を簡潔にした説明文
								fiearr[temp_map]["exp"] += OpenInlineTag(RegExp.$1) + "<br>";
								
							}else if(arr[i].match(/v:(.*)$/)){  //v要素（道具の内容を描写タブ部にかく）
								fiearr[temp_map]["exp"] += itearr[parseInt(RegExp.$1)]["exp"] + "<br>";

							}else if(arr[i].match(/s:(.+)#(.+)/)) { //選択肢
								fiearr[temp_map]["sel"].push(new Array(RegExp.$1, RegExp.$2));
							}
						}
					}
				}
			}
			

      //fiearrとitearrの内容を、＊JSON形式で＊、d_descに表示するには…
      /*var jstr = JSON.stringify({"fie": fiearr,"ite":itearr});
      document.getElementById("d_desc").innerText = jstr;
      break; */
			document.getElementById("button_redo_and_skip").style.display="inline-block";		
      show_introduction();
			scrollTo(0,0);
			change_li(2);
		}
	}

  //BFstyle to BTAP=========================================================
  function BFtoBTAP(arr,n){
  var ifpage = 0; //ページ編集中？（空白文字が改行かページ区切りかの判別に）
  var temp_num = -1;
  var back_num = temp_num-1;
  var front_num = temp_num+1;

  for(var i = n; i< arr.length;i++){
    if(arr[n].match(/BFmap:([0-9]+)/)){  //改行を簡潔にした説明文
      arr[n].replace(/BFmap:([0-9]+)/g, "map:($1)");
    }

    //map部おわり
    if(arr[i] == "</map>"){
      break;
    }

    //ページ開始
    if(arr[i].match(/\[(.+)/)){
      temp_num++;
      back_num = temp_num - 1;
      front_num = temp_num + 1;
      arr[i] = "[" + temp_num + "]" ;
      arr.splice(i+1, 0, "n:" + RegExp.$1); //"n:" + RegExp.$1);//n要素の追加
      i++;
      ifpage = 1;

    }else if(arr[i].match(/\]/)){
      if(arr[i].match(/bf/)){//前後に壁
        arr[i] = "";
      }else if(arr[i].match(/b\]/)){//後ろに壁
        arr[i] = "s:次へ#mov(" + front_num + ")";
      }else if(arr[i].match(/f\]/)){//後ろに壁
        arr[i] = "s:戻る#mov(" + back_num + ")";
      }else{//前後に壁無し
        arr.splice(i,1,"s:次へ#mov(" + front_num +")", "s:戻る#mov(" + back_num +")");
      }
      ifpage = 0;
    }else if((ifpage == 1) && !(arr[i].match(/s:/)) && !(arr[i].match(/v:/)))　{ //e要素に「^」を追加
      arr[i] = "^" + arr[i];
    }
  }

  return(arr);
  }

//ルビやハイパーリンクなどのBTAPタブをHTMLになおす。==============================

	function OpenInlineTag(scr){
		var ans = scr;
		
		//ルビの設定<r> => <ruby>
		ans = ans.replace(/<r>(.+?)#(.+?)<\/r>/g, "<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>");
		
		//ハイパーリンクの設定 <hl> => <span>
		ans = ans.replace(/<hl>(.+?)#(.+?)<\/hl>/g, "<span onclick=\"$2\" class=\"hl-border\">$1</span>");
    
		return(ans);
	}
	
  //==============================================================================
  //「ページ」タブの表示
  function show_page(){
    var page=document.getElementById("d_desc");
    //ページ名＆ページ説明div
		var ans = '<p><span style="font-size:200%;font-weight:bold;">' + fiearr[fie]["nam"] + "</span></p><div>"
                      + fiearr[fie]["exp"] + '</div><div style="display:inline-block;text-align:left"><ul>';

    //ページの選択肢
    for(var i=0;i<fiearr[fie]["sel"].length;i++){
      ans += '<li class="li_sel" onclick="' + fiearr[fie]["sel"][i][1] + '">'
                        + fiearr[fie]["sel"][i][0] + "</li>";
    }
    ans += "</ul></div>";

    page.innerHTML = ans;

  }
	
	//========================================================================
	
	//イントロダクションを表示
	function show_introduction(){
    var page=document.getElementById("d_desc");
		
		var abst = '<p><span style="font-size:200%;font-weight:bold;">' + fiearr[fie]["nam"] + "</span></p>";
		
		abst += '<div style="display:inline-block;text-align:left;"><ul><li class="li_sel" onclick="mov(0)">始める</li></ul></div>';
		
		//ページ数
		abst += "<p>[ ページ数 : " + fiearr.length + " ]</p>";
		
		//リードミー
		abst += "<p>[ リードミー ]<br>" + itearr[itearr.length-1]["exp"] + "</p>";
		
		page.innerHTML = abst;
	}
	


  //アイテムの有無でオプションボタンを変える===========================================
  function display_ite(){
    var item_sel = document.getElementById("d_item_sel");
    var item_exp = document.getElementById("d_item_exp");
    item_exp.innerHTML="";
    item_sel.innerHTML="";

    for(var i=0;i<itearr.length;i++){
      if(itearr[i]["hav"]){
        //「もちもの」タブにラジオボタンを追加する。
        item_sel.innerHTML += '<label><input type="radio" name="item" onclick="' +
                                'document.getElementById(&quot;d_item_exp&quot;).innerHTML=&quot;' +
                                itearr[i]["exp"] + '&quot;"/>' +
                                itearr[i]["nam"] + "</label><br>";
      }
    }
  }
  //新アイテム獲得！アラートを発する==============================  
  function geti_alert(ifalert){
		var button_openitem = document.getElementById("button_openitem");
		
		button_openitem.style.display="inline-block";
		
		if(ifalert){
			button_openitem.className="tool_button openitem geti_alert";
		}else{
			button_openitem.className="tool_button openitem";
		}
	}


  
  //もとに戻す==================================
  function remov(){
    if (breadcrumbs.length <= 1){ //セーブパンくずがない場合（初期値）
      alert("戻せません");
    }else{
      breadcrumbs.shift();
      load_savefile(breadcrumbs[0]);//セーブパンくずの最初の要素が１つ前のセーブデータ
    }
  }

  //選択肢スキップ==============================
  function pageskip(){
		
		if(fiearr.length == 0 || fiearr[fie]["sel"].length != 1){ //まだページが選択されていない
			alert("スキップできません");
		}else{
			var ifskip = window.confirm("次に来る、選択肢が複数あるページまでスキップしますか？（この先にそのようなページがない場合は、最後のページまでスキップされます）");
			
			if(ifskip){
				while(1){
					if (fiearr[fie]["sel"].length == 1){  //選択肢数が1の時、その先へ
						eval(fiearr[fie]["sel"][0][1]);
					}else{
						alert("スキップしました");  //複数選択肢があるページ、もしくはページの終わり(選択肢0)までスキップ
						break;
					}
				}
			}
		}
  }
	

  
  //スクリプトでかける関数=========================================================-
  //マップ移動
  function mov(tow) {
    fie = tow;
    breadcrumbs.unshift(makesave());  //セーブを追加、パンくずを追加する
    show_page();
  }

  //アイテム獲得
  function geti(n){
		if(!itearr[n]["hav"]){
			geti_alert(true);
		}
		
    itearr[n]["hav"]=true;
    display_ite();
  }

  //アイテムをなくす
  function losi(n){
    itearr[n]["hav"]=false;
    display_ite();
  }

  //フラグtrueに
  function onflg(n){
    flgarr[n]=true;
  }

  //フラグfalseに
  function offlg(n){
    flgarr[n]=false;
  }

  //フラグがtrueか
  function iflg(n){
    return(flgarr[n]);
  }

  //道具を持っているか
  function hav(n){
    return(itearr[n]["hav"]);
  }
	
  //document.getElementById(id).innerHTML = str の糖衣
  function gebi(id, str){
    document.getElementById(id).innerHTML = str;
  }

  //番号の書き込み
  function wnum(i, num){
    numarr[i] = num;
  }

  //番号の読み込み
  function rnum(i){
    return(numarr[i]);
  }

  //numarrの引き算(numarr要素からnumarr要素を引く)
  function nminn(n1, n2){
    numarr[n1] -= numarr[n2];
  }

  //numarrの引き算(numarr要素から実際に数字を引く)
  function nminx(n, x){
    numarr[n] -= x;
  }


  //numarrの足し算(numarr要素にnumarr要素を足す)
  function naddn(n1, n2){
    numarr[n1] += numarr[n2];
  }

  //numarrの足し算(numarr要素に実際に数字を足す)
  function naddx(n, x){
    numarr[n] += x;
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
	