console.log("欢迎来到吹牛逼小游戏！");

const table = {
    cards: [],
};

class sexyDealer {
    leftAmount = 0;
    userList = [];
    lastPlayerId = null;
    isTrue = true;
    passAmount = 0;

    constructor(playerAmount) {
        this.leftAmount = playerAmount;
        this.generateCards();
    }

    generateCards() {
        const textArr = ['A', 'B', 'C', 'D'];
        const END = 13;

        for (let j = 0; j < textArr.length; j+=1) {
            for (let i = 1; i <= END; i+=1) {
                table.cards.push(`${textArr[j]}${i}`);
            }
        }
        table.cards.push("X1");
        table.cards.push("X2");

        this.showCards();
    };
    shuffle() {
        let randomEnd = table.cards.length;

        while (randomEnd > 0) {
            const index = parseInt(Math.random()*randomEnd, 10);

            const temp = table.cards[randomEnd-1];
            table.cards[randomEnd-1] = table.cards[index];
            table.cards[index] = temp;

            randomEnd -= 1;
        }
    }

    showCards = () => console.log(`荷官手中的余牌: `, table.cards);
    addUser = (player) => {
        this.userList.push(player);
    };
    handlePlay = (pid, fact, statement) => {
        console.log(table.cards);

        let userName = "";
        let status = false;
        for (let i = 0; i < this.userList.length; i+=1) {
            if (pid === this.userList[i].id) {
                status = true;
                userName = this.userList[i].name;
            }
        }

        this.isTrue = true;

        if (status) {
            this.lastPlayerId = pid;

            while (fact.length > 0) {
                const temp = fact.pop();
                table.cards.push(temp);
                if (temp !== "X1"
                    && temp !== "X2"
                    && temp.replace(/\w/, "") !== statement) {

                    this.isTrue = false;
                }
            }
        } else {
            console.error(`查无此人: ${pid}，不许出牌`);
        }
        console.log(table.cards);
    };
    handleChallenge = (pid) => {
        let status = false;
        for (let i = 0; i < this.userList.length; i+=1) {
            if (this.userList[i].id === pid &&
                pid !== this.lastPlayerId) {
                status = true;
            }
        }

        if (status && this.lastPlayerId !== null) {
            let id;
            if (this.isTrue) {
                id = pid;
            } else {
                id = this.lastPlayerId;
            }

            for (let i = 0; i < this.userList.length; i+=1) {
                if (this.userList[i].id === id) {
                    console.log(`本轮，${this.userList[i].name}负，桌上的牌全归他！`);
                    while (table.cards.length > 0) {
                        this.userList[i].cards.push(table.cards.pop());
                    }
                }
            }

            this.lastPlayerId = null;
        } else {
            console.error("质疑者身份非法，质疑无效");
        }
    };
    handlePass = (pid) => {
        let status = false;
        let name = "";
        for (let i = 0; i < this.userList.length; i+=1) {
            if (this.userList[i].id === pid &&
                pid !== this.lastPlayerId) {
                status = true;
                name = this.userList[i].name;
            }
        }

        if (status) {
            this.passAmount = this.passAmount + 1;
            console.log(`${name}选择Pass`);

            if (this.passAmount >= this.userList.length-1) {
                console.log("所有用户均选择Pass，桌上的牌将清空");
                while (table.cards.length > 0) {
                    table.cards.pop();
                }
            }
        } else {
            console.error("不允许当前用户Pass");
        }
    };
    deal = () => {
        this.shuffle();

        let onePlayerAmount = Math.ceil(table.cards.length / this.leftAmount);
        while (table.cards.length > 0 &&
            table.cards.length < onePlayerAmount) {
            onePlayerAmount -= 1;
        }

        const tempCards = [];
        for (let i = 0; i < onePlayerAmount; i += 1) {
            tempCards.push(table.cards.pop());
        }

        this.leftAmount = this.leftAmount -1;

        return tempCards;
    };
}

function getDigit(str) {
    return parseInt(str.replace(/\w/, ""), 10);
}
function getCardType(str) {
    return str.slice(0, 1);
}
function wordToPic(str) {
    const type = getCardType(str);
    const digit = getDigit(str);

    let picStr = "";

    switch (type) {
        case 'A':
            picStr = "♥";
            break;
        case 'B':
            picStr = "♠";
            break;
        case 'C':
            picStr = "♣";
            break;
        case 'D':
            picStr = "♦";
            break;
    }

    switch (digit) {
        case 1:
            if (type === "X") {
                picStr = "☆";
            } else {
                picStr += "A";
            }
            break;
        case 2:
            if (type === "X") {
                picStr = "★";
            } else {
                picStr += 2;
            }
            break;
        case 11:
            picStr += "J";
            break;
        case 12:
            picStr += "Q";
            break;
        case 13:
            picStr += "K";
            break;
        default:
            picStr += digit;
    }

    return picStr;
}

class Player {
    id = 0;
    name = "";
    cards = [];
    cardsTemp = [];

    constructor(id, name, dealer) {
        this.id = id;
        this.name = name;

        dealer.addUser(this);
    }


    handleCardClick = (index) => {
        const cards = document.querySelectorAll(".card");

        if (cards[index].getAttribute("selected") === "true") {
            const card = this.cards[index];

            let i = 0;
            let status = true;

            while (status && i < this.cardsTemp.length) {
                if (card === this.cardsTemp[i]) {
                    status = false;
                    this.cardsTemp.splice(i, 1);
                }

                i += 1;
            }

            cards[index].setAttribute("selected", "false");
            cards[index].setAttribute("class", "card");
        }
         else {
            this.cardsTemp.push(this.cards[index]);
            cards[index].setAttribute("selected", "true");
            cards[index].setAttribute("class", "card selected");
        }

        const statementSelector = document.querySelector("#statementSelector");
        if (this.cardsTemp.length > 0) {
            statementSelector.style.display = "block";
        } else {
            statementSelector.style.display = "none";
        }
    };
    showInfo = () => {
        const userInfo = document.querySelector("#userInfo");

        userInfo.innerText = `编号: ${this.id} 用户名: ${this.name}`;
    };
    showCards = () => {
        const myCardStage = document.querySelector('#myCards');
        myCardStage.innerHTML = "";

        for (let i = 0; i < this.cards.length; i++) {
            const card = document.createElement('div');
            card.innerText = wordToPic(this.cards[i]);
            card.setAttribute("class", "card");
            card.setAttribute("selected", "false");
            card.onclick = () => this.handleCardClick(i);

            let color = "";
            switch (getCardType(this.cards[i])) {
                case 'A':
                case 'C':
                    color = "#f00";
                    break;
                case 'B':
                case 'D':
                    color = "#000";
                    break;
                case 'X':
                    color = "#5347ff";
                    break;
            }
            card.style.color = color;

            myCardStage.appendChild(card);
        }
    };
    getCards = (dealer) => {
        this.cards = dealer.deal();
        this.cards.sort((a, b) => getDigit(a)-getDigit(b));
        // this.showCards();
    };
    play = (fact, statement, dealer) => {
        let status = false;
        let cards = [];

        for (let j = 0; j < fact.length; j+=1) {
            let i = 0;
            while (i < this.cards.length) {
                if (fact[j] === this.cards[i]) {
                    status = true;
                    cards.push(this.cards.splice(i, 1)[0]);
                }

                i += 1;
            }
        }

        if (status) {
            dealer.handlePlay(this.id, cards, statement);
            this.showCards();
        } else {
            console.error("出牌无效！")
        }
    };
    challenge = (dealer) => {
        dealer.handleChallenge(this.id);
        this.showCards();
    };
    pass = (dealer) => {
        dealer.handlePass(this.id);
    };
}
