/*****変数宣言*****/
//目標値
let target = 0;

//カードデータ
class Card {
    constructor(type, num) {
        this.type = type;
        this.num = num;
    }
}
//トランプマーク配列
const card_type = ['&spades;', '&diams;', '&hearts;', '&clubs;'];
//山札配列
const cards = [];


//各カード計算用数値（Aには-1を設定し、1と11を選択させる）

//山札引いた枚数
let picup_cnt = 0;

//親手札配列
const cpu_cards = [];
//親手札合計 , 目標値-親手札合計値
let cpu_sum , cpu_diff = 0;

//子手札配列
const player_cards = [];
//子手札合計 , 目標値-子手札合計値
let player_sum , player_diff= 0;

//各フラグ（Aフラグ , ヒットフラグ , バーストフラグ , 勝敗フラグ）
let ace_flg , hit_flg , burst_flg , win_flg = false;




/*****メイン処理*****/
/***画面読み込み時処理***/
// window.onload = function onLoad() {}
    console.log("game start!");
    //目標値設定
    target =  Math.floor(Math.random() * (16) + 15);
    // console.log(target);
    const target_text = document.getElementById("target_text");
    target_text.textContent = String(target);

    //山札作成
        //シャッフルはAPIにある

    //初期手札配布
    newgame_cards();
        //Aフラグ判定

    //手札合計値算出
    calc_sum();
    //バースト時配りなおし
        //手札を山札に戻してシャッフル
    newgame_cards();


/***ヒットボタン押下時処理***/
function hit() {
    hit_flg = true;
    //山札から１枚引く
    picup_cnt++;
    console.log("ヒットしました\n山札から" + picup_cnt + "枚目を引きました");
    player_cards[picup_cnt] = cards[picup_cnt];
    console.log(player_cards[picup_cnt]);
    //Aフラグ判定
    ace_check(player_cards[picup_cnt].num );
    //手札合計値算出
    calc_sum();
}

/***スタンドボタン押下時処理***/
function stand() {
    console.log("スタンドしました");

}

/***両プレイヤースタンド時処理***/
function win_or_lose(){
    console.log("勝敗判定");
    //勝敗判定

    //ボタン表示
}

/*****関数******/
/***初期手札配布***/
function newgame_cards(){
    console.log("初期手札配布");
}

/***Aフラグ判定***/
function ace_check(picup_card){

}

/***手札合計値算出***/
function calc_sum(){
    
}
//合計値チェック
function sum_check(sum){
    const msg = document.getElementById("msg");

    if(target - sum >= 0){
        msg.textContent = "せーふ";
    }else{
        msg.textContent = "あうと";
    }

}
    
