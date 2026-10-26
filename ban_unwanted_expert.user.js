// ==UserScript==
// @name     ban unwanted expert
// @version  1
// @include  https://news.yahoo.co.jp/expert
// @grant    none
// ==/UserScript==

const theList = document.getElementById("contentsWrap").querySelector("ul"); // 記事リスト
  //console.log(`theList contains ${theList.childElementCount} items`); 

var theTarget = null;	// 右クリックした<li>要素
var theAuthor = null; // ↑その著者名
const strAuthorSelector = "div > span:first-of-type, div.yads_ad_info div > span";

// 右クリックイベントを処理するハンドラ
theList.addEventListener('contextmenu', function (event) {
  theTarget = event.target.closest("li");
  if (theTarget) {
    let authorElem = theTarget.querySelector(strAuthorSelector);
    if (authorElem) {
      theAuthor = authorElem.innerText;
      if (theAuthor === event.target.innerText) {
        // 著者名の上で右クリックした場合
        event.preventDefault(); // デフォルトのメニューを防ぐ
	      //console.log(`right click on author ${theAuthor}`);
        handleHiding(true, event);	// この要素or著者の非表示化
      }else{
        // 著者名以外の部分で右クリックの場合
        if (theTarget.title != "") {
          // 既に非表示になってる項目
        	event.preventDefault(); // デフォルトのメニューを防ぐ
	      	//console.log(`right click on hidden author ${theAuthor}`);
        	handleHiding(false, event);	// この要素or著者の復元再表示
        }else{
          // 通常状態の項目で右クリックなら、デフォルトの右クリック処理
	      	//console.log(`right click on normal item ${authorElem.innerText}/${authorElem.tagName}/<${event.target.tagName}>`);
        }
      }
    }
  }
});

// ストレージに保存してあるBANリストを読み込む
var hasModified = false;
var unwanted_authors = localStorage.getItem("unwanted_authors");

// 保存されてなければ初期状態のBANリストを作成
if (!unwanted_authors) {
  unwanted_authors = "広告,akaneko715,Gaya Sachiko,Life log,maimai,My-Room\
,N.D.Kitchen,NANA,ryoko,saya,tsukigumidesu,あかし,いぬきち,おかさん\
,おにころ|簡単おにぎりレシピ,お天気ママ,かなざわ,キャプテン福田,きょうも食べてみました。,くろにゃん,くろねこ\
,コーヒーソムリエKazu,ティール,なかべぇ,なないろの扉,ナナホシ,なべのだいどころ。,ネタフル\
,のんある男子の東京ランチ飯,ぱるとよ,バロンママ,ぺち,ポロンノCamp,まいにち3品食堂,マッシ\
,まめ☆毎日スタバカスタム,みなみやん,みみこ,むねさだよしろう,業務スーパーマニアスパ子,筋肉料理人,進撃のグルメ\
,菅智香,整理収納アドバイザー渡部夏代,相場一花,脱サラ料理家ふらお,舞,麺ターテイナー藤,木南きなこ,矢野きくの\
,ramentimesだいち,aiko*,わんた,miu,柳谷ナオ,つけ麺バカ（つけログの主）,おうちごはんと日常\
,セブンイレブンに魂を売った男,きょん。,あさごはんチャンネル,スウHITOMI KITA\
,Megumi 夫が惚れたおつまみレシピ,ミキ【カフェ風お弁当】,ライフハックまも,みんと,南森エレナ,ムジオタまこ\
,samia,ごま,こたろぐ,もみ,ユニ子＊100均スリコ大好き,むらせ,にゃんころもち,ラーメンたろしん\
,RAMEN ANTENNA,発酵・フードデコレーターRisa,Momo＊Kinari,コストコハッカー,すまいる\
,アイビー,湯川カオル子,HITOMI KITA,よっしー@関西グルメ,ラーログ/博多のススリスト,森本聡子,上村敏行\
,ムタログ | 無印好き男子,クリームパンおやじ,あや,かな@コンビニスイーツブロガー,いでくん\
,ノーヌードルノーライフかずくん,磯貝由起,シズリーナ荒井,ななせまる nanasehirasawa";
  hasModified = true;
  console.log(`initialized unwanted_authors: ${unwanted_authors}`); 
}else{
  console.log(`loaded unwanted_authors: ${unwanted_authors}`); 
}
// ストレージに置くときはCSV文字列で、プログラム中で扱うときはSetで持っておく
unwanted_authors = new Set(unwanted_authors.split(","));

// ページを閉じるor離れるときに、BANリストが変更されていれば保存
document.addEventListener("visibilitychange", () => {
  if (document.hidden && hasModified) {
    localStorage.setItem("unwanted_authors", unwanted_authors.values().join(","));
    hasModified = false;
  }
});

// 1個の<li>要素を非表示化(縮小)する関数
function hide1item(elem, title) {
  // <li>要素と、tooltip用のテキスト(著者名)を渡す
  elem.style.height = "20px";
  elem.style.overflow = "hidden";
  elem.title = title;
}

// 非表示の<li>要素を復元再表示する関数
function restore1item(elem) {
  // <li>要素をもらい、tooltipは無くす
  elem.style.height = "";
  elem.style.overflow = "";
  elem.title = "";
}

// コンテキストメニュー用styleを定義
const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.textContent = `
  .context-menu {
    display: none;
    position: absolute;
    z-index: 10000;
    width: stretch;
    background-color: #ffffff;
    opacity: 0.9;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 6px 4px;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    color: #020202;
  }
  .context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .context-menu li {
    border-radius: 8px;
    padding: 4px 20px;
    cursor: default;
  }
  .context-menu li:hover:not(.disabled) {
    background-color: #0066ff;
    color: #ffffff;
  }
  .context-menu li.disabled {
  	color: #b0b0b0;
  }
  .context-menu hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 6px 0;
	}
`;
document.head.appendChild(style);

// コンテキストメニューのdiv要素
const menuDiv = document.createElement('div');
menuDiv.id = 'custom-context-menu';
menuDiv.className = 'context-menu';
menuDiv.innerHTML = `<ul>
  <li id='hide-show-one'>この記事を非表示</li>
  <li id='hide-show-all'>著者「〜〜」を全て非表示</li>
  <hr/>
  <li id='disp-ban-list'>BANリスト表示</li>
</ul>
`;
document.body.appendChild(menuDiv);

// コンテキストメニューの選択肢の処理
menuDiv.querySelector("#hide-show-one").addEventListener('click', (event) => {
  // 1項目分の処理
  //console.log(`chosen hide-show-one`);
  if (theTarget.title === "") { // 表示中なら非表示へ
    hide1item(theTarget, theAuthor);
  }else{												// すでに非表示なら復元
    restore1item(theTarget);
  }
});

menuDiv.querySelector("#hide-show-all").addEventListener('click', (event) => {
  // この著者全部の処理
  //console.log(`chosen hide-show-all`);
  if (theTarget.title === "") { // 表示中なら非表示へ
    theList.childNodes.forEach( (item) => {
      var authorElem = item.querySelector(strAuthorSelector);
      if (authorElem.innerText === theAuthor) {
        console.log(`hiding: ${theAuthor}`);
        hide1item(item, theAuthor);
      }
    });
    if (!unwanted_authors.has(theAuthor)) {
      unwanted_authors.add(theAuthor);
      hasModified = true;
    }
  }else{												// すでに非表示なら復元
    theList.childNodes.forEach( (item) => {
      var authorElem = item.querySelector(strAuthorSelector);
      if (authorElem.innerText === theAuthor) {
        console.log(`restoring: ${theAuthor}`);
        restore1item(item);
      }
    });
    if (unwanted_authors.has(theAuthor)) {
      unwanted_authors.delete(theAuthor);
      hasModified = true;
    }
  }
  theTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });	// 右クリックした要素が表示範囲に納まるように
});

	menuDiv.querySelector("#disp-ban-list").addEventListener('click', (event) => {
    // BANリスト表示
    console.log(`chosen disp-ban-list`);
    let strMsg = "";
    let nLen = 0;
    unwanted_authors.values().forEach( (name) => {
    	if (nLen + name.length > 60) {
        strMsg += "\\\n";
        nLen = 0;
      }
      if (strMsg != "") {
        strMsg += ",";
        nLen++;
      }
      strMsg += name;
      nLen += name.length;
    });
  	window.alert(`"${strMsg}"`);
  });

// 非表示／表示コンテキストメニュー処理
function handleHiding(hide_or_show, event) {
  // 非表示or復元のフラグと右クリックイベントをもらう

  if (hide_or_show) {
    menuDiv.querySelector("#hide-show-one").innerText = "この記事を非表示";
		menuDiv.querySelector("#hide-show-all").innerText = `著者「${theAuthor}」を全て非表示`;
  }else{
    menuDiv.querySelector("#hide-show-one").innerText = "この記事を表示";
		menuDiv.querySelector("#hide-show-all").innerText = `著者「${theAuthor}」を全て表示`;
  }
  //マウスポインタの位置を取得してメニューの座標を設定
  menuDiv.style.left = `${event.pageX + 5}px`;
  menuDiv.style.top = `${event.pageY}px`;
  //メニューを表示状態にする
  menuDiv.style.display = 'block';

	// 画面のどこかを左クリックしたらメニューを閉じる
  document.body.addEventListener('click', (event) => {
    //if (event.button !== 2) { // 右クリック以外
      event.preventDefault(); // デフォルト動作を防ぐ
      menuDiv.style.display = 'none';
    //}
  }, {capture: true, once: true});
}

// ページLoad時の初期リスト処理
console.log(`theList contains ${theList.childNodes.length} items`); 
theList.childNodes.forEach( (node) => {
  // 記事の著者名、または「広告」が書いてある<span>要素を見つけ
  let authorElem = node.querySelector(strAuthorSelector);
  // BANリストに含まれる著者だったら、その<li>要素を非表示にする
  if (authorElem && unwanted_authors.has(authorElem.innerText)) {
    console.log(`found: ${authorElem.innerText}`);
    hide1item(node, authorElem.innerText);
  }
});

// 無限リストに追加される記事を監視
const theObserver = new MutationObserver((records, obs) => {
	records.forEach((rec) => {
    //console.log(`type: ${rec.type}, added ${rec.addedNodes.length}, removed ${rec.removedNodes.length}`);
    rec.addedNodes.forEach((node) => {
      let authorElem = node.querySelector(strAuthorSelector);
      if (authorElem && unwanted_authors.has(authorElem.innerText)) {
        console.log(`added;found: ${authorElem.innerText}`);
        hide1item(node, authorElem.innerText);
      }
    });
  });
});
theObserver.observe(theList, {childList: true});
