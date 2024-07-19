


export const enum game_state { playing, gameover, win, pause, ready }
export const enum visible_state { default, flag, boom, number, blank }
export default class Game {
    
/*
    有一个二维数组存储游戏数据,二维数组的元素为{isBoom,visible_state} }
    不同的数字代表不同的 状态，有五种状态visible_state：default,flag,boom,number,blank
        1.default: 
        右键: 插旗子 visible_state = flag
        左键: if (isBoom) {gameOver} 
            else {open,
                    visible_state=number
                    如果 number==0 ，则递归打开周围格子,同时自己的visible_state=blank
                    } 
        2. flag: 
            右键: 删除插旗子
            左键：无反应
        3. boom: 
            gameover
        4. number: 
            右键：无反应
            左键：无反应
        5. blank: 
            右键：无反应
            左键：无反应
    game_state 记录游戏状态，有五种状态：playing,gameover,win,pause,ready
*/
    private data: Array<Array<{ isBoom: boolean, visible_state: visible_state, mineCount: number }>>;
    public game_state: game_state;
   

    constructor(private row: number, private col: number, private boomNum: number) {
        this.row = row;
        this.col = col;
        this.boomNum = boomNum;
        this.game_state = game_state.ready;
        this.data = new Array<Array<{ isBoom: boolean, visible_state: visible_state , mineCount: number }>>();
        for (let i = 0; i < row; i++) {
            this.data[i] = new Array<{ isBoom: boolean, visible_state: visible_state , mineCount: number }>();
            for (let j = 0; j < col; j++) {
                this.data[i][j] = { isBoom: false, visible_state: visible_state.default, mineCount: 0 };
                if (Math.random() < this.boomNum / (this.row * this.col)) {
                    this.data[i][j].isBoom = true;
                }

            }
        }
        // 计算周围的雷数
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (!this.data[i][j].isBoom) {
                    this.data[i][j].mineCount = this.getAroundMine(i, j);
                }
            }
        }

    }
    public getData() {
        return this.data;
    }
    public open(row: number, col: number,mouseright:boolean) {
        if ( this.game_state !== game_state.ready && this.game_state !== game_state.playing) {
            console.log("游戏已结束");
            return;
        }
        // 检查
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            console.log("超出边界");
            return;
        }
        if (this.data[row][col].visible_state == visible_state.boom) {
            this.game_state = game_state.gameover;
            return;
        }
        
        // 打开 flag
        if (this.data[row][col].visible_state == visible_state.flag && mouseright===true) {
            
            this.data[row][col].visible_state = visible_state.default;
            return;
        }
        // 打开 default
        if (this.data[row][col].visible_state == visible_state.default) {
            if (this.data[row][col].isBoom) {
                // boom
                this.data[row][col].visible_state = visible_state.boom;
                this.game_state = game_state.gameover;
                return;
            } else { // 不是地雷
                this.data[row][col].visible_state = visible_state.number;
                let mineCount = this.getAroundMine(row, col);
                if (mineCount == 0) {
                    this.openAround(row, col);
                }
            }
        }
        
    }

    // 检查自己和周围的格子，只要是getAroundMine == 0，则递归打开周围的格子
    public openAround(row: number, col: number) {
        
        if(row < 0 || row >= this.row || col < 0 || col >= this.col){
            return;
        }
        if(this.data[row][col].visible_state === visible_state.default
            || this.data[row][col].visible_state === visible_state.flag){
                let mineCount =  this.data[row][col].mineCount;
                if(mineCount == 0){
                    this.data[row][col].visible_state = visible_state.blank;
                    this.openAround(row-1,col-1);
                    this.openAround(row-1,col);
                    this.openAround(row-1,col+1);
                    this.openAround(row,col-1);
                    this.openAround(row,col+1);
                    this.openAround(row+1,col-1);
                    this.openAround(row+1,col);
                    this.openAround(row+1,col+1);

                }else{
                    this.data[row][col].visible_state = visible_state.number;
                }
            }
        }


    private getAroundMine(row: number, col: number) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i == row && j == col) {
                    continue;
                }
                if (this.IamMine(i, j)) {
                    count++;
                }
            }
        }
        return count;
    }
    private IamMine(row: number, col: number) {
        // 检查
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            // console.log("超出边界");
            return false;
        }
        if (this.data[row][col].isBoom) {
            return true;
        } else {
            return false;
        }
    }
    public getGameState() {
        return this.game_state;
    }
    public setGameState(state: game_state) {
        this.game_state = state;
    }



}