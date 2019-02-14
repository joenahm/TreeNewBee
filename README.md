# 树新蜂纸牌游戏 (Tree New Bee)

一款考验心理战术的纸牌小游戏 A cards game that you use your tactics to win

游戏规则待写... Rules remain to be written ...

### 接口信息

#### 听：
- ` accessible: 询问是否能进房间 data: { accessible: true } `
- ` room_info: 询问进入房间后，我的id和大家的名字 `
```
data: {
    id: 1,
    others: [
        {
            name: "小明",
            amount: 0,
        }
    ]
}
```
- ` game_begins: 游戏开始了,返回我的牌，和其他人的牌数 `
```
 data: {
    cards: ["A1", "A2"],
    others: [
        {
            name: "小明",
            amount: 13,
        },
    ],
 }
```
- ` play_status: 我是不是可以出牌 data: { status: true } `

#### 说：
- ` enter_room: 进入房间 data: { name: "我的名字" } `
- ` ready: 准备好了 data: { id: 1 } `
- ` can_i_play: 我可不可以出牌 data { id: 1 } `
- ` play: 出牌 data { id: 1, cards: ["A1"], statement: "1" } `
