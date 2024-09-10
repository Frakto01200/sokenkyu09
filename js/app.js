let deckId;
let totalPlayer = 0;
let totalCpu = 0;
let sum = 0;

const deckApiUrl = "https://deckofcardsapi.com/api/deck";

/// localStorageから目標値を取得して表示
const target = localStorage.getItem("target_value");
if (target) {
    document.getElementById("target_text").textContent = target;
} else {
    document.getElementById("target_text").textContent = "目標値が設定されていません";
}

//リロードした場合に発生する機能
window.onload = () => {
	// ゲーム開始時にデッキを取得（山札）
    fetch(`${deckApiUrl}/new/shuffle/?deck_count=6`)
        .then(response => response.json())
        .then(data => {
            deckId = data.deck_id;
			const fudaCardDiv = document.getElementById('fuda-cards');
			const deckBackImg = document.createElement('img');
			deckBackImg.width = "150";
            deckBackImg.height = "210";
            deckBackImg.src = "https://deckofcardsapi.com/static/img/back.png";
            fudaCardDiv.appendChild(deckBackImg);
        });
        
        
	//playerとcpuの手札を2枚ずつ配る
	fetch(`${deckApiUrl}/new/draw/?count=4`)
        .then(response => response.json())
        .then(data => {
            const playerCardsDiv = document.getElementById('player-cards');
            const cpuCardsDiv = document.getElementById('cpu-cards');
            playerCardsDiv.innerHTML = ''; // 以前のカードをクリア
            cpuCardsDiv.innerHTML = ''; // 以前のCPUカードをクリア

            
            data.cards.forEach((card, index) => {
                const cardImg = document.createElement('img');
                cardImg.width = "150";
                cardImg.height = "210";
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;
				const deckBackImg = document.createElement('img');
				deckBackImg.width = "150";
                deckBackImg.height = "210";
            	deckBackImg.src = "https://deckofcardsapi.com/static/img/back.png";

				//2枚づつカードを配る
                if (index < 2) {
                    playerCardsDiv.appendChild(cardImg);

                    // プレイヤーの合計値を計算
                    const cardValue = calculateCardValue(card);
                    totalPlayer += cardValue;
                    document.getElementById('p_sum').textContent = totalPlayer;
                } else {
                    cpuCardsDiv.appendChild(deckBackImg);

                    // CPUの合計値を計算
                    const cardValue = calculateCardValue(card);
                    totalCpu += cardValue;
                    document.getElementById('c_sum').textContent = totalCpu;
                }
            });
        });
};

//hit選択時
function hit() {
    fetch(`${deckApiUrl}/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
            const drawnCardsDiv = document.getElementById('player-cards');

            data.cards.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.width = "150";
                cardImg.height = "210";
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;

                drawnCardsDiv.appendChild(cardImg);

                // 合計値を計算して更新
                const cardValue = calculateCardValue(card);
                totalPlayer += cardValue;
                document.getElementById('p_sum').textContent = totalPlayer;

                // 合計値をチェック
                sum_check(totalPlayer);
            });
        });
}

//stand選択時
function stand() {
    // ヒットとスタンドのボタンを無効化する
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    // CPU の手札や結果を処理するロジックを追加する
	
	
}

function sum_check(sum) {
    const target = parseInt(localStorage.getItem("target_value"), 10); // 目標値を数値として取得
    const msg = document.getElementById("msg");

    if (sum <= target) {
        // msg.textContent = "セーフ";
    } else {
        msg.textContent = "バースト";
        // ヒットとスタンドのボタンを無効化する
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
    }
}


// カードの値を数値に変換する
function calculateCardValue(card) {
    const value = card.value;
    if (value === 'ACE') {

        //1or11かを選ばせるロジックを書く
        return 11;
    } else if (['KING', 'QUEEN', 'JACK'].includes(value)) {
        return 10;
    } else {
        return parseInt(value, 10); // 2から10までの数字カード
    }
}





/////////////////////////////////////////////////////////
