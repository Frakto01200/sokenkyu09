let deckId;
let totalPlayer = 0;
let totalCpu = 0;
let sum = 0;
let cpuCards = [];

const deckApiUrl = "https://deckofcardsapi.com/api/deck";

// localStorageから目標値を取得して表示
const target = localStorage.getItem("target_value");
if (target) {
    document.getElementById("target_text").textContent = target;
} else {
    document.getElementById("target_text").textContent = "目標値が設定されていません";
}

// リロードした場合に発生する機能
window.onload = () => {
    // ゲーム開始時にデッキを取得（山札）
    fetch(`${deckApiUrl}/new/shuffle/?deck_count=6`)
        .then(response => response.json())
        .then(data => {
            deckId = data.deck_id;
            const fudaCardDiv = document.getElementById('fuda-cards');
            const deckBackImg = document.createElement('img');
            deckBackImg.src = "https://deckofcardsapi.com/static/img/back.png";
            fudaCardDiv.appendChild(deckBackImg);
        });

    // playerとcpuの手札を2枚ずつ配る
    fetch(`${deckApiUrl}/new/draw/?count=4`)
        .then(response => response.json())
        .then(data => {
            const playerCardsDiv = document.getElementById('player-cards');
            const cpuCardsDiv = document.getElementById('cpu-cards');
            playerCardsDiv.innerHTML = ''; // 以前のカードをクリア
            cpuCardsDiv.innerHTML = ''; // 以前のCPUカードをクリア

            data.cards.forEach((card, index) => {
                const cardImg = document.createElement('img');
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.classList.add('card');
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;
                const deckBackImg = document.createElement('img');
                deckBackImg.src = "https://deckofcardsapi.com/static/img/back.png";
                deckBackImg.classList.add('card');

                // 2枚づつカードを配る
                if (index < 2) {
                    playerCardsDiv.appendChild(cardImg);

                    // プレイヤーの合計値を計算
                    const cardValue = calculateCardValue(card);
                    totalPlayer += cardValue;
                    // 画面に表示させる
                    document.getElementById('p_sum').textContent = totalPlayer;


                    const target = parseInt(localStorage.getItem("target_value"), 10);
                    const msg = document.getElementById("msg");
                    //最初に目標値より値が高ければバースト
                    if(target < totalPlayer){
                        msg.textContent = "運悪い";
                        msg.style.color = "gold";
    
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 5000); 
                    
                    //目標値と同じ数字になった場合hitできなくしてstandを自動的に呼ぶ
                    }else if(target === totalPlayer){
                        document.getElementById("hit").disabled = true;
                        stand();
                    }

                } else {
                    cpuCardsDiv.appendChild(deckBackImg);

                    // CPUカードを保存する
                    cpuCards.push(card);

                    // CPUの合計値を計算
                    const cardValue = calculateCardValue(card);
                    totalCpu += cardValue;
                    
                }
            });
        });
};

// hit選択時
function hit() {
    fetch(`${deckApiUrl}/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
            const drawnCardsDiv = document.getElementById('player-cards');

            data.cards.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.classList.add('card'); 

                cardImg.dataset.value = card.value;
                

                drawnCardsDiv.appendChild(cardImg);

                // 合計値を計算して更新
                const cardValue = calculateCardValue(card);
                totalPlayer += cardValue;
                document.getElementById('p_sum').textContent = totalPlayer;

                // 合計値をチェック
                sum_check(totalPlayer);

                const target = parseInt(localStorage.getItem("target_value"), 10);

                //目標値と同じ数字になった場合hitできなくしてstandを自動的に呼ぶ
                if(target === totalPlayer){
                    document.getElementById("hit").disabled = true;
                    stand();
                }
            });
        });
}

// stand選択時
function stand() {
    // ヒットとスタンドのボタンを無効化する
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    // CPU の手札を表向きにする
    const cpuCardsDiv = document.getElementById('cpu-cards');
    cpuCardsDiv.innerHTML = ''; // 以前の裏向きカードをクリア

    // 表向きのカードを追加
    cpuCards.forEach(card => {
        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.alt = `${card.value} of ${card.suit}`;
        cardImg.classList.add('card'); 
        cpuCardsDiv.appendChild(cardImg);

        // 画面に表示させる
        document.getElementById('c_sum').textContent = totalCpu;
    });


    const target = parseInt(localStorage.getItem("target_value"), 10); // 目標値を数値として取得
    const msg = document.getElementById("msg");
    // CPUが目標値に近づくようにカードを引く
    function cpuDrawCard() {
        if (totalCpu < target - 4 && totalCpu < totalPlayer) {
            fetch(`${deckApiUrl}/${deckId}/draw/?count=1`)
                .then(response => response.json())
                .then(data => {
                    const card = data.cards[0]; // 1枚引いたカード
                    const cardImg = document.createElement('img');
                    cardImg.src = card.image;
                    cardImg.alt = `${card.value} of ${card.suit}`;
                    cardImg.classList.add('card'); 
                    cpuCardsDiv.appendChild(cardImg);

                    // 合計値を計算して更新
                    const cardValue = calculateCardValue(card);
                    totalCpu += cardValue;
                    document.getElementById('c_sum').textContent = totalCpu;

                    // 再度チェック
                    cpuDrawCard(); // 再帰的に呼び出してカードを引き続ける
                });
        } else {
            // 最終結果を表示する
            if(totalCpu === target || totalPlayer === target) {
                if(totalCpu === target){
                    msg.textContent = "Brack Jack! Lose";
                    msg.style.color = "blue";
                }else{
                    msg.textContent = "Brack Jack! Win";
                    msg.style.color = "red";
                }
                
            } else if (totalCpu > target) {
                msg.textContent = "You Win!";
                msg.style.color = "red";
            } else if (totalCpu > totalPlayer) {
                msg.textContent = "You Lose!";
                msg.style.color = "blue";
            } else if (totalCpu === totalPlayer) {
                msg.textContent = "Draw!";
                msg.style.color = "green";
            } else {
                msg.textContent = "You Win!";
                msg.style.color = "red";
            }


            // 3秒後に index.html に戻る
            setTimeout(() => {
                window.location.href = "index.html";
            }, 5000);  
        }
    }
    // CPUがカードを引く処理を開始
    cpuDrawCard();
}

// カードの値を数値に変換する
function calculateCardValue(card) {
    const value = card.value;
    if (value === 'ACE') {
        // 1or11かを選ばせるロジックを書く
        return 11;
    } else if (['KING', 'QUEEN', 'JACK'].includes(value)) {
        return 10;
    } else {
        return parseInt(value, 10); // 2から10までの数字カード
    }
}

function sum_check(sum) {
    const target = parseInt(localStorage.getItem("target_value"), 10); // 目標値を数値として取得
    const msg = document.getElementById("msg");

    if (sum <= target) {
        // msg.textContent = "セーフ";
    } else {
        // バーストの文字を真ん中に大きく出せるようにする
        msg.textContent = "バースト";
        // ヒットとスタンドのボタンを無効化する
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;

        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000); 
    }
}
