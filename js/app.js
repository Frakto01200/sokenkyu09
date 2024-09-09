let deckId;
let totalPlayer = 0;
let totalCpu = 0;

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
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;
				const deckBackImg = document.createElement('img');
            	deckBackImg.src = "https://deckofcardsapi.com/static/img/back.png";

				//2枚づつカードを配る
                if (index < 2) {
                    cardImg.onclick = () => selectCard(cardImg);
                    playerCardsDiv.appendChild(cardImg);
                } else {
                    cpuCardsDiv.appendChild(deckBackImg);
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
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;

                cardImg.onclick = () => selectCard(cardImg);

                drawnCardsDiv.appendChild(cardImg);
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

//合計値チェック
function sum_check(sum){
    const msg = document.getElementById("msg");

    if(target - sum >= 0){
        msg.textContent = "セーフ";
    }else{
        msg.textContent = "バースト";
        // ヒットとスタンドのボタンを無効化する
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
    }

}


// カードの合計値を計算する関数
function calculateSum(cards) {
    let sum = 0;
    let aceCount = 0;
    
    cards.forEach(card => {
        if (['JACK', 'QUEEN', 'KING'].includes(card.value)) {
            sum += 10;
        } else if (card.value === 'ACE') {
            aceCount += 1;
            sum += 11; // エースはまず11として計算
        } else {
            sum += parseInt(card.value);
        }
    });

    // エースを1に変える必要があるか確認
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }

    return sum;
}


/////////////////////////////////////////////////////////


// カードを選択してリストに追加、場から削除
function selectCard(cardElement) {
    const selectedCardsDiv = document.getElementById('selected-cards');
    const clonedCard = cardElement.cloneNode(true); // カードを選択リストに追加
    selectedCardsDiv.appendChild(clonedCard);

    // カードの値をスートごとに合計値に追加
    updateTotals(cardElement.dataset.suit, cardElement.dataset.value);

    // 場から選択されたカードを削除
    cardElement.remove();
}

// カードの値を数値に変換する
function getCardValue(value) {
    if (value === 'ACE') return 1;
    if (value === 'JACK' || value === 'QUEEN' || value === 'KING') return 10;
    return parseInt(value);
}

// スートごとの合計値を更新
function updateTotals(suit, value) {
    const cardValue = getCardValue(value);

    switch (suit) {
        case 'HEARTS':
            totalHearts += cardValue;
            document.getElementById('hearts-total').textContent = totalHearts;
            break;
        case 'DIAMONDS':
            totalDiamonds += cardValue;
            document.getElementById('diamonds-total').textContent = totalDiamonds;
            break;
        case 'CLUBS':
            totalClubs += cardValue;
            document.getElementById('clubs-total').textContent = totalClubs;
            break;
        case 'SPADES':
            totalSpades += cardValue;
            document.getElementById('spades-total').textContent = totalSpades;
            break;
        default:
            break;
    }
}