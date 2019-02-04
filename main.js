console.log("欢迎来到吹牛逼小游戏！");

const table = {
    cards: [],
};

class sexyDealer {
    leftAmount = 0;
    userList = [];
    lastPlayerId = null;
    isTrue = true;

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
            console.error(`查无此人: ${uid}，不许出牌`);
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

class Player {
    id = 0;
    name = "";
    cards = [];

    constructor(id, name, dealer) {
        this.id = id;
        this.name = name;

        dealer.addUser(this);
    }


    showInfo = () => console.log(`${this.id}: ${this.name}`);
    showCards = () => console.log(`${this.name}当前的余牌: `, this.cards);
    getCards = (dealer) => {
        this.cards = dealer.deal();
        this.showCards();
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

    };
}
