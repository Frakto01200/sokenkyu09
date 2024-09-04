
//目標値設定
document.getElementById("get").addEventListener("click", async () => {
    const target =  Math.floor(Math.random() * (16) + 15);
    console.log(target);
    const target_text = document.getElementById("target_text");
    target_text.textContent = String(target);

    window.location.href = "home.html";
});



playerCards:[],
pcCards:[],

async deal() {
	// 
	this.playerCards.push(await this.drawCard());
	// 
	let newcard = await this.drawCard();
	newcard.showback = true;
	this.pcCards.push(newcard);
	this.playerCards.push(await this.drawCard());
	this.pcCards.push(await this.drawCard());
},

const BACK_CARD = "https://deckofcardsapi.com/static/img/back.png";