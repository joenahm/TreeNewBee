# 树新蜂纸牌游戏 (Tree New Bee)

一款考研心理战术的纸牌小游戏 A cards game that you use your tactics to win

游戏规则待写... Rules remain to be written ...

### 接口信息

#### 听：
- ` accessible: 询问是否能进房间 data: { accessible: true } `
- ` room_info: 询问进入房间后，我的id和大家的名字 data: { id: 1, other_players: ['小红', '小刚' ] } `
- ` game_begins: 游戏开始了 `

#### 说：
- ` enter_room: 进入房间 data: { name: "我的名字" } `
- ` ready: 准备好了 data: { id: 1 } `
