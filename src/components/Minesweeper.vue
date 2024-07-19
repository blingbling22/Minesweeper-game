<script setup lang="ts">

import { ref, onMounted } from 'vue'
const hoveredItem = ref(null)

const info = ref('hello')

const _row = 15
const _col = 20
const enum mouse_pressing{
    
    // 鼠标交互
    DEFAULT,
    DOWN,
    UP,
    ENTER_CELL
}
const enum  muose_key{
    DEFAULT,
    LEFT,
    RIGHT,
    BOTH,
}
const enum cell_state{
    UNKNOWN,
    NUMBER,
    FLAG,
    BOOM,
    BLANK
}

interface cell{
    position: { x: number, y: number },
    state: cell_state
}

const mouse = ref({
    key: muose_key.DEFAULT,
    pressing: mouse_pressing.DEFAULT,
    position_on_cell:{ x:-1,y:-1} // 鼠标在方块上的位置 ：初始值不可以存在
})

const grid = ref<cell[][]>([])

// 初始化 grid
onMounted(() => {
    for (let i = 0; i < _row; i++) {
        grid.value[i] = []
        for (let j = 0; j < _col; j++) {
            grid.value[i][j] = {
                position: { x: i, y: j },
                state: cell_state.UNKNOWN
            }
        }
    }
})


// console.log(grid.value)

/// 鼠标按下事件
const handleMouseDown = (row: number, col: number, e:MouseEvent) => {
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
const handleMouseUp = (row: number, col: number, e:MouseEvent) => {
    // pressingState = PressingState.LEFT
    // grid.value[row][col]  = cell_state.UP
    mouse.value.pressing = mouse_pressing.UP

    if (mouse.value.key === muose_key.RIGHT) {
        grid.value[row][col].state = cell_state.FLAG
    } else if (mouse.value.key === muose_key.LEFT) {
        grid.value[row][col].state = cell_state.BOOM
    }


    info.value = `抬起 ${row}-${col} ${ mouse.value.pressing}  e: ${e.buttons}`
}
const handleMouseEnter = (row: number, col: number, e:MouseEvent) => {
    hoveredItem.value = `${row}-${col}`
    mouse.value.position_on_cell = { x: row, y: col }
    mouse.value.pressing = mouse_pressing.ENTER_CELL


    info.value = `进入 ${row}-${col} e: ${e.buttons}`
 
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
        <div v-for="(row, rowIndex) of grid" :key="rowIndex" class="grid-row">
            <!-- 在每一行中，再使用v-for指令生成4个方块 -->

            <TransitionGroup name="cell">
                <div v-for="(col, colIndex) of row" :key="colIndex">
                    <div class="grid-item" 
                        :key="`${rowIndex}-${colIndex}`"
                        :class="{
                        'is-hovered':  mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        'is-down': mouse.pressing === mouse_pressing.DOWN && mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        'is-up': mouse.pressing === mouse_pressing.UP && mouse.position_on_cell.x === rowIndex && mouse.position_on_cell.y === colIndex,
                        'is-left-up': grid[rowIndex][colIndex].state ===  cell_state.FLAG,
                        'is-right-up':grid[rowIndex][colIndex].state === cell_state.BOOM
                        
                        
                        // 'is-left-up': grid[rowIndex][colIndex] === cell_state.LEFT_UP,
                        // 'is-right-up': grid[rowIndex][colIndex] === cell_state.RIGHT_UP,
                        }"
                        @mouseenter.stop="handleMouseEnter(rowIndex, colIndex, $event)"
                        @mousedown.stop="handleMouseDown(rowIndex, colIndex, $event)"
                        @mouseup.stop="handleMouseUp(rowIndex, colIndex, $event)">
                        {{ 1 }}

                        <!-- 这里可以添加内容或样式 -->
                    </div>
                </div>

            </TransitionGroup>
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
.grid-item.is-left-up {
    background-color: rgb(0, 255, 157);
}
.grid-item.is-right-up {
    background-color: rgb(255, 196, 0);
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