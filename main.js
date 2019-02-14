console.log("欢迎来到吹牛逼小游戏！");

const table = {
    cards: [],
};

class sexyDealer {
    leftAmount = 0;
    userList = [];
    lastPlayerId = null;
    nextId = 1;
    isTrue = true;
    passAmount = 0;

    constructor(playerAmount) {
        this.leftAmount = playerAmount;
        this.generateCards();
        this.shuffle();
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
    generateNextId(pid) {
        let status = true;
        let i = 0;
        while (status && i < this.userList.length) {
            if (pid === this.userList[i].id) {
                status = false;

                if (i+=1 >= this.userList.length) {
                    this.nextId = this.userList[0].id;
                } else {
                    this.nextId = this.userList[i+1].id;
                }

            } else {
                i += 1;
            }
        }
    }

    showCards = () => console.log(`荷官手中的余牌: `, table.cards);
    addUser = (player) => {
        this.userList.push(player);
    };
    canIPlay = (pid) => {
        if (pid === this.nextId) {
            return true;
        } else {
            return false;
        }
    };
    handlePlay = (pid, fact, statement) => {
        const count = fact.length;
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

            this.notify(`${userName}： ${count}张${digitToWord(statement)}`);

            this.generateNextId(pid);
        } else {
            console.error(`查无此人: ${pid}，不许出牌`);
        }
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
                    this.notify(`本轮，${this.userList[i].name}负，桌上的牌全归他！`);
                    while (table.cards.length > 0) {
                        this.userList[i].cards.push(table.cards.pop());
                    }
                }
            }

            this.lastPlayerId = null;

            this.generateNextId(pid);
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
                this.notify("所有用户均选择Pass，桌上的牌将清空");
                while (table.cards.length > 0) {
                    table.cards.pop();
                }
            }

            this.generateNextId(pid);
        } else {
            console.error("不允许当前用户Pass");
        }
    };
    deal = () => {
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
function digitToWord(digit) {
    switch (digit) {
        case "1":
            return "A";
        case "11":
            return "J";
        case "12":
            return "Q";
        case "13":
            return "K";
        default:
            return digit;
    }
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
            picStr = "♦";
            break;
        case 'D':
            picStr = "♣";
            break;
    }

    if (type === "X") {
        if (digit === 1) {
            picStr = "☆";
        } else {
            picStr = "★";
        }
    } else {
        picStr += digitToWord(`${digit}`);
    }

    return picStr;
}

class Player {
    id = 0;
    name = "";
    cards = [];
    cardsTemp = [];

    constructor(id, name) {
        this.id = id;
        this.name = name;
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
    getCards = (cards) => {
        this.cards = cards;
        this.cards.sort((a, b) => getDigit(a)-getDigit(b));
    };
    play = () => {
        let status = false;
        let cards = [];

        for (let j = 0; j < this.cardsTemp.length; j+=1) {
            let i = 0;
            while (i < this.cards.length) {
                if (this.cardsTemp[j] === this.cards[i]) {
                    status = true;
                    cards.push(this.cards.splice(i, 1)[0]);
                }

                i += 1;
            }
        }

        if (status) {
            this.showCards();

            while (this.cardsTemp.length > 0) {
                this.cardsTemp.pop();
            }
        }

        return cards;
    };
}
