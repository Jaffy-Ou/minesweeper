import { useState, useEffect } from "react";
import createBoard from "./createBoard";
import Cell from "./Cell";

const Board = ({row, col, mines}) => {
    const [gameData, setGameData] = useState({});
    const [resetGame, setResetGame] = useState(true);
    const [count, setCount] = useState(0);
    const [startCount, setStartCount] = useState(false);

    useEffect(()=>{
        let interval;
        if(!startCount) {return () => {}}
        interval = setInterval(() => {
            // ここを埋めてください。
        setCount((prev) => {return prev + 1});
        }, 1000);
        return () => clearInterval(interval);
    }, [startCount, gameData.gameStatus])

    // useEffectの第二引数をresetGameにしてresetGameが変換あるたびに新しいボートを作成する
    useEffect(() => {
        // 新たなボートを作成する
        const resetedBoard = createBoard(row, col, mines);
        console.log(resetedBoard);
        setGameData({
            board: resetedBoard,
            gameStatus: 'Game in Progress',
            cellWithoutMines: row * col - mines,
            numOfMines: mines
        });
    }, [resetGame, row, col, mines]);

    useEffect(() => {
        const newBoard = createBoard(row, col, mines);
        console.log(newBoard);
        setGameData({
            board: newBoard,
            gameStatus: 'Game in Progress',
            cellWithoutMines: row * col - mines,
            numOfMines: mines
        });
    }, []);

    if (!gameData.board) {return <div>Loading...</div>}

    const handleUpdateFlag = (e, x, y) => {
        if(!startCount) {
            setStartCount(true);
        }
        e.preventDefault();
        if(gameData.gameStatus === 'You Lost' || gameData.gameStatus === 'You Win'){
            return;
        }
        if(gameData.board[x][y].revealed){
            return;
        }

        setGameData((prev) => {
            const newBoard = [...prev.board];
            const newFlag = !newBoard[x][y].flagged;        // prevのflaggedを逆転します
            let newNumOfMines = prev.numOfMines;
            newFlag ? newNumOfMines-- : newNumOfMines++;    // newFlagがfalseならば地雷の数を一減らす、trueならば一増やす
            newBoard[x][y].flagged = newFlag;

            return{
                ...prev,
                numOfMines: newNumOfMines,
                board: newBoard
            }
        });
    }
    const revealEmpty = (x, y, data) => {
        if(data.board[x][y].revealed){return;}
        data.board[x][y].revealed = true;
        data.cellWithoutMines--;
        if(data.cellWithoutMines === 0) {
            data.gameData = 'You Win';
        }
        // マスの周辺に地雷が無い場合は、その周辺のマスをいっぺんに 開示
        if(data.board[x][y].value === 0) {
            for(let y2 = Math.max(y-1, 0); y2 < Math.min(y+2, col); y2++) {
                for(let x2 = Math.max(x-1, 0); x2 < Math.min(x+2, row); x2++){
                    if(x2 !== x || y2 !== y){revealEmpty(x2, y2, data);}
                }
            }
        }
        return data;
    }

    const handleRevealCell = (x, y) => {
        if(!startCount) {
            setStartCount(true);
        }
        if(gameData.gameStatus === 'You Lost' || gameData.gameStatus === 'You Win'){return;}
        if(gameData.board[x][y].revealed || gameData.board[x][y].flagged){return;}

        const newGameData = {...gameData};

        if(newGameData.board[x][y].value === 'X') {
            // クリックしたマスが地雷だった場合
            // 全ての地雷をオープンします。
            for(let i = 0; i < row; i++) {
                for(let j = 0; j < col; j ++){
                    // もしnewGameData.board[i][j]が爆弾ならば開示します。
                    if(newGameData.board[i][j].value === 'X') {
                        newGameData.board[i][j].revealed = true;}
                }
            }
            newGameData.gameStatus = 'You Lost';
            setStartCount(false);
        } else if(newGameData.board[x][y].value === 0) {
            // クリックしたマスの周辺に地雷が無い場合
            const newRevealedData = revealEmpty(x, y, newGameData);
            setGameData(newRevealedData);return;
        } else {
            // クリックしたマスに一個以上の地雷がある場合
            newGameData.board[x][y].revealed = true;
            newGameData.cellWithoutMines--;
            if(newGameData.cellWithoutMines === 0) {
                newGameData.gameStatus = 'You Win';
                setStartCount(false);
            }
        }
        setGameData(newGameData);

    }

    return(
        <div>
            <div>
                🚩{gameData.numOfMines} &nbsp;&nbsp;
                ⏰ {count} &nbsp;&nbsp;
                <button onClick={() => {setResetGame(!resetGame);setCount(0);setStartCount(false);}}>Reset</button>
            </div>
            <div>Game Status:{gameData.gameStatus}</div>
            <div>
                {gameData.board.map((singleRow, index1) =>{
                    return(
                        <div style={{display:'flex'}} key={index1}>
                        {
                            singleRow.map((singleCell, index2) => {
                                return <Cell 
                                        details={singleCell} 
                                        onUpdateFlag={(e) => handleUpdateFlag(e, index1, index2)} 
                                        onRevealCell={() => handleRevealCell(index1, index2)} 
                                        key={index2} 
                                        />
                            })
                        }
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Board;