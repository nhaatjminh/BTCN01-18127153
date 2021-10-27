import React, {useState} from "react";
import Board from "../Board";

const nToWin = 5;
const boardSize = 5;

function calculateWinner(squares) {

    let win;
    var line;
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) continue;
        let y = i % boardSize;
        let x = Math.floor(i/boardSize);
        console.log(x);
        console.log(y);
        if (y <= boardSize - nToWin) {
          win = true;
          line = [];
          line.push(i);
          for (let k = 0; k < nToWin - 1; k++) {
            if (squares[i + k] !== squares[i + k + 1]) {
              win = false
            }
            else {
              line.push(i + k + 1)
            }
          }
          if (win) {
            return {
              winner: squares[i],
              winLine: line,
              isDraw: false,
            };
          }
        }
        if (x <= boardSize - nToWin) {
          win = true;
          line = [];
          line.push(i);
          for (let k = 0, j = 0; j < nToWin - 1; j++, k += boardSize) {
            if (squares[i + k] !== squares[i + k + boardSize]) {
              win = false
            }
            else {
              line.push(i + k + boardSize)
            }
          }
          if (win) {
            return {
              winner: squares[i],
              winLine: line,
              isDraw: false,
            };
          }
        }
        if (y <= boardSize - nToWin && x <= boardSize - nToWin) {
          win = true;
          line = [];
          line.push(i);
          for (let k = 0, j = 0; j < nToWin - 1; k += boardSize + 1, j++) {
            if (squares[i + k] !== squares[i + k + boardSize + 1]) {
              win = false
            }
            else {
              line.push(i + k + boardSize + 1)
            }
          }
          if (win) {
            return {
              winner: squares[i],
              winLine: line,
              isDraw: false,
            };
          }
        }
        if (x <= boardSize - nToWin && y >= nToWin - 1) {
          win = true;
          line = [];
          line.push(i);
          for (let k = 0, j = 0; j < nToWin - 1; k += boardSize - 1, j++) {
            if (squares[i + k] !== squares[i + k + boardSize - 1]) {
              win = false
            }
            else {
              line.push(i  + k + boardSize - 1)
            }
          }
          if (win) {
            return {
              winner: squares[i],
              winLine: line,
              isDraw: false,
            };
          }
        }
    }

    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] !== 'X' && squares[i] !== 'O') {
        isDraw = false;
        break;
      }
    }
    return {
      winner: null,
      line: null,
      isDraw: isDraw,
    };
}

const Game = () => {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
        position: -1,
      }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isAscending, setIsAscending] = useState(true);

    const handleClick = (i) => {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        if (winner || winInfo.isDraw || squares[i]) {
          return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(newHistory.concat([{
            squares: squares,
            position: i
          }]));
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    const handleSortToggle = () => {
        setIsAscending(!isAscending);
    }


    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;

    const moves = history.map((step, move) => {
        const position = step.position
        const y = position % boardSize
        const x = Math.floor(position/boardSize)
        const desc = move ?
            'Go to move #' + move + ' (' + x + ',' + y + ')':
            'Go to game start';
        return (
            <li key={move}>
            <button 
            className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => jumpTo(move)}>{desc}
            
            </button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        if (winInfo.isDraw) {
        status = "Draw";
        }
        else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    if (!isAscending) {
        moves.reverse();
    }

    return (
    <div className="game">
        <div className="game-board">
        <Board
            squares={current.squares}
            onClick={(i) => handleClick(i)}
            winLine={winInfo.winLine}
            boardSize={boardSize}
        />
        </div>
        <div className="game-info">
        <div>{ status }</div>
        <button onClick={() => handleSortToggle()}>
            {isAscending ? 'Descending' : 'Ascending'}
        </button>
        <ol>{moves}</ol>
        </div>
    </div>
    );
}


export default Game;