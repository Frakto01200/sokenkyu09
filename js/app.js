
//画面読み込み時
// window.onload = function onLoad() {}
// console.log("onload");

class Card {
    constructor(type, num) {
        this.type = type;
        this.num = num;
    }
}
//山札配列
const cards = [];
//山札から引いた数
let picup_cnt = 0;
let hit_flg = false;

//手札配列
const player_cards = [];
let p_sum = 0;


//目標値設定
const target =  Math.floor(Math.random() * (16) + 15);
console.log(target);
const target_text = document.getElementById("target_text");
target_text.textContent = String(target);



const card_type = ['&spades;', '&diams;', '&hearts;', '&clubs;'];
let count = 0;
//山札作成
for (let i = 0; i < card_type.length; i++) {

    for (let j = 1; j <= 13; j++) {
        cards[count] = new Card(card_type[i], j);
        //   console.log(count +': type:' + card_type[i] + ' num:' + j);
        count++;
    }

}
//シャッフルする
let i = cards.length;
//ランダムな位置と入れ替え
while (i) {
    let swap_idx = Math.floor(Math.random() * i--);
    //console.log();
    let tmp = cards[i];
    cards[i] = cards[swap_idx];
    cards[swap_idx] = tmp;
}


//初期手札作成
for (picup_cnt; picup_cnt < 2; picup_cnt++) {
    player_cards[picup_cnt] = cards[picup_cnt];
    console.log(player_cards[picup_cnt]);
}

viwe_and_sum();

//手札、合計値表示
function viwe_and_sum() {
    //playerタグ取得
    const player = document.getElementById("player");
    const p_sum_text = document.getElementById("p_sum");

    if (hit_flg === true) {
        let qur_cnt = player_cards.length;
        const p_show = document.createElement("p");

        p_sum += cards[qur_cnt].num;

        p_show.classList.add('card');
        p_show.setAttribute('id', cards[qur_cnt]);
        p_show.innerHTML = cards[qur_cnt].type + '<br>' + cards[qur_cnt].num;
        p_show.style.width = '1.5em';
        p_show.style.textAlign = 'center';
        player.appendChild(p_show);

    } else {
        p_sum = 0;
        count = 0;
        for (let i = 0; i < player_cards.length; i++) {
            const p_show = document.createElement("p");
            let p_card = cards[count];

            //合計値計算
            console.log(p_card.num + " : " + typeof (p_card.num));
            // let tmp = p_sum + p_card.num;
            p_sum += p_card.num;

            p_show.classList.add('card');
            p_show.setAttribute('id', count);
            p_show.innerHTML = p_card.type + '<br>' + p_card.num;
            p_show.style.width = '1.5em';
            p_show.style.textAlign = 'center';
            player.appendChild(p_show);

            count++;
        }
    }

    let tmp = String(p_sum);
    p_sum_text.textContent = tmp;
    sum_check(p_sum);

}




//ヒット選択時
function hit() {
    picup_cnt++;
    console.log("山札から" + picup_cnt + "枚目を引きました")
    player_cards[picup_cnt] = cards[picup_cnt];
    console.log(player_cards[picup_cnt]);
    hit_flg = true;
    viwe_and_sum();
}

//スタンド選択時
function stand() {

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