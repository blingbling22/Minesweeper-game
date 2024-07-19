<script setup>

import { ref, onMounted } from 'vue'

const kind = ref(0)

const items = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]

const hoveredItem = ref(null)

function handleMouseEnter(row, col) {
    hoveredItem.value = `${row}-${col}`;
    console.log(hoveredItem.value);
}
function handleMouseLeave() {
    hoveredItem.value = null;
}

// 鼠标状态
const PressingState = {
  LEFT: 1,
  RIGHT: 2,
  BOTH: 3
}
let pressingState = PressingState.LEFT
/// 鼠标按下事件
const handleMouseDown = ({ row, col }, e = new MouseEvent()) => {
  switch (e.buttons) {
    // 左
    case 1:
      pressingState = PressingState.LEFT
      break

    // 右
    case 2:
      pressingState = PressingState.RIGHT
      break

    // 左右 中键忽略
    case 3:
    case 4:
    case 7:
      pressingState = PressingState.BOTH
      
      break
  }
}
// 鼠标抬起事件



</script>

<template>

    <div>Minesweeper</div>
    <div id="h" :class="{
        kind_0: kind === 0,
        kind_1: kind === 1,
        kind_2: kind === 2
    }"> 你好</div>
    <div>
        <button @click="kind = 0">kind_0</button>
        <button @click="kind = 1">kind_1</button>
        <button @click="kind = 2">kind_2</button>
    </div>

    <div class="grid-container">
        <!-- 使用v-for指令遍历生成3行 -->
        <div v-for="row in 10" :key="row" class="grid-row">
            <!-- 在每一行中，再使用v-for指令生成4个方块 -->

            <TransitionGroup  name="cell">
                <div v-for="col in 10" :key="col" class="grid-item"
                    :class="{ 'is-hovered': hoveredItem === `${row}-${col}` }"
                    @mouseenter="handleMouseEnter(row, col)"
                    @mouseleave="handleMouseLeave"
                    >
                    <!-- 这里可以添加内容或样式 -->
                </div>

            </TransitionGroup >
        </div>
    </div>







</template>


<style scoped>
.grid-container {
    display: flex;
    flex-direction: column;
}

.grid-row {
    display: flex;
}

.grid-item {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 5px;
  background-color: #f9f9f9;
  
}
.grid-item.is-hovered {
    background-color: blue;
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


#h {
    &.kind_0 {
        color: red;
    }

    &.kind_1 {
        color: blue;
    }

    &.kind_2 {
        color: green;
    }

}


</style>