<script setup lang="ts">

import { ref, onMounted, reactive } from 'vue'

import Game from './game'
import { game_state, visible_state } from './game'

const info = ref('hello')



const rows = ref(20)
const cols = ref(15)
const boompossibility = ref(0.3)



onMounted(() => {
    // 获取游戏状态
    game.setGameState(game_state.ready)
    // console.log(game.data)
})


const game = reactive(new Game(rows.value, cols.value, boompossibility.value))


const init_game = () => {
    game.init(rows.value, cols.value, boompossibility.value)

}
init_game()









const enum mouse_pressing {

    // 鼠标交互
    DEFAULT,
    DOWN,
    UP,
    ENTER_CELL
}
const enum muose_key {
    DEFAULT,
    LEFT,
    RIGHT,
    BOTH,
}
const mouse = ref({
    key: muose_key.DEFAULT,
    pressing: mouse_pressing.DEFAULT,
    position_on_cell: { x: -1, y: -1 } // 鼠标在方块上的位置 ：初始值不可以存在
})

/// 鼠标按下事件
const handleMouseDown = (row: number, col: number, e: MouseEvent) => {
    switch (e.buttons) {
        // 左
        case 1:
            mouse.value.key = muose_key.LEFT
            break
        // 右
        case 2:
            mouse.value.key = muose_key.RIGHT
            break

        // 左右 中键忽略
        case 3:
        case 4:
        case 7:
            mouse.value.key = muose_key.DEFAULT
            break
    }
    mouse.value.pressing = mouse_pressing.DOWN

    mouse.value.position_on_cell = { x: row, y: col }
    info.value = `按下 ${row}-${col} press ${mouse.value.pressing}`
}
const handleMouseUp = (row: number, col: number, e: MouseEvent) => {
    // pressingState = PressingState.LEFT
    // grid.value[row][col]  = cell_state.UP
    mouse.value.pressing = mouse_pressing.UP

    if (mouse.value.key === muose_key.RIGHT) {

        game.open(mouse.value.position_on_cell.x, mouse.value.position_on_cell.y, true)
    } else if (mouse.value.key === muose_key.LEFT) {
        game.open(mouse.value.position_on_cell.x, mouse.value.position_on_cell.y, false)
    }
    info.value = `抬起 ${row}-${col}  state: ${game.getVisibleState(mouse.value.position_on_cell.x, mouse.value.position_on_cell.y)}`
}
const handleMouseEnter = (row: number, col: number, e: MouseEvent) => {
    mouse.value.position_on_cell = { x: row, y: col }
    mouse.value.pressing = mouse_pressing.ENTER_CELL

    // console.log( game.getVisibleState(mouse.value.position_on_cell.x, mouse.value.position_on_cell.y))
    info.value = `进入 ${row}-${col}  v-state: ${game.getVisibleState(mouse.value.position_on_cell.x, mouse.value.position_on_cell.y)}`

}


// 屏蔽右键菜单
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
// 屏蔽中键
// document.addEventListener('mousewheel', function(event) {
//         event.preventDefault();
//     });



</script>

<template>
    <div> {{ info }}</div>
    <div class="grid-container">
        <!-- 使用v-for指令遍历生成 -->
        <div v-for="(row, rowIndex) of game.data" :key="rowIndex" class="grid-row">
            <!-- 在每一行中，再使用v-for指令生成4个方块 -->

            <TransitionGroup name="cell">
                <div v-for="(col, colIndex) of row" :key="colIndex">
                    <div class="grid-item" :key="`${rowIndex}-${colIndex}`" :class="{
                        // 与鼠标交互
                        'is-hovered': mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        'is-down': mouse.pressing === mouse_pressing.DOWN && mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        'is-up': mouse.pressing === mouse_pressing.UP && mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        // 格子状态
                        'is-flag': game.data[rowIndex][colIndex].visible_state === visible_state.flag,
                        'is-default': game.data[rowIndex][colIndex].visible_state === visible_state.default,
                        'is-blank': game.data[rowIndex][colIndex].visible_state === visible_state.blank,
                        'is-boom': game.data[rowIndex][colIndex].visible_state === visible_state.boom,
                        'is-number': game.data[rowIndex][colIndex].visible_state === visible_state.number,
    }"
                        @mouseenter.stop="handleMouseEnter(rowIndex, colIndex, $event)"
                        @mousedown.stop="handleMouseDown(rowIndex, colIndex, $event)"
                        @mouseup.stop="handleMouseUp(rowIndex, colIndex, $event)">

                        <div v-if="game.game_state === game_state.gameover">
                            <div
                                v-if="game.data[rowIndex][colIndex].isBoom === true && game.data[rowIndex][colIndex].visible_state !== visible_state.boom">
                                💣</div>
                        </div>

                        <div v-if="game.data[rowIndex][colIndex].visible_state === visible_state.default"> </div>
                        <div v-else-if="game.data[rowIndex][colIndex].visible_state === visible_state.number">{{
        game.data[rowIndex][colIndex].mineCount }}</div>
                        <div v-else-if="game.data[rowIndex][colIndex].visible_state === visible_state.blank"> </div>
                        <div v-else-if="game.data[rowIndex][colIndex].visible_state === visible_state.boom">💥</div>
                        <div v-else-if="game.data[rowIndex][colIndex].visible_state === visible_state.flag">🚩</div>
                        <!-- 这里可以添加内容或样式 -->
                    </div>
                </div>

            </TransitionGroup>
        </div>
    </div>

    <!--  设置 参数 -->
    <div class="setting-container">
        <div class="setting-item">
            <label for="row">行数</label>
            <input type="number" id="row" v-model="rows" min="1" max="100">
        </div>
        <div class="setting-item">
            <label for="col">列数</label>
            <input type="number" id="col" v-model="cols" min="1" max="100">
            </input>
        </div>
        <div class="setting-item">
            <label for="boom">地雷概率</label>
            <input type="number" id="boom" v-model="boompossibility" min="0" max="1" step="0.01">
        </div>
        <div class="setting-item">
            <button @click="init_game">开始游戏</button>
        </div>
    </div>



</template>


<style scoped>
.grid-container {
    display: flex;
    flex-direction: column;
    padding: 4px;
    border: 2px solid rgb(180, 180, 180);
    width: auto;

    box-sizing: border-box;


    /* 鼠标样式 */
    cursor: pointer;


}

.grid-row {
    display: flex;
}

.grid-item {
    height: 26px;
    width: 26px;
    display: flex;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin: 2px;
    background-color: rgb(38, 171, 201);
    border-radius: 10%;
    box-sizing: border-box;
    /* 该函数用于设置元素的盒子模型为border-box。在border-box模型下
    ，元素的总宽度和高度包括内边距和边框，
    即宽度和高度只包含内容区域的大小，
    不包括内边距和边框的宽度。这样设置可以让元素的大小更容易控制和布局。 */
    font-size: 14px;
    /*  禁止用户选中文本 */
    user-select: none;


    align-items: center;
    justify-content: center;
    color: black;
}

.grid-item.is-hovered {
    background-color: rgb(116, 221, 245);
}

.grid-item.is-down {
    background-color: rgb(163, 235, 193);
}

.grid-item.is-flag {
    background-color: rgb(0, 255, 157);
}

.grid-item.is-boom {
    background-color: rgb(255, 196, 0);
}

.grid-item.is-blank {
    background-color: rgb(255, 255, 255);
}

.grid-item.is-default {
    background-color: rgb(38, 171, 201);
}

.grid-item.is-number {
    background-color: rgb(18, 183, 68);
}

.grid-item.is-up {
    /* background-color: rgb(255, 255, 255); */
}

.cell-enter-active {
    transition: background-color 0.3s ease;
}

.cell-leave-active {
    transition: opacity 1s linear;
    /* opacity（透明度) */
}

.cell-enter-from,
.cell-leave-to {
    opacity: 0;
}
</style>