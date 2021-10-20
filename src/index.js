import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const nToWin = 5;
const boardSize = 5;

const Square = ({highlight, value, onClick}) => {
  const className = 'square' + (highlight ? ' highlight' : '');
  return ( 
      <button 
        className = {className} 
        onClick={() => onClick()}>
        {value}
      </button>
  );
}
      
  
class Board extends React.Component {

    renderSquare(i) {
      const winLine = this.props.winLine;
      return <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          highlight={winLine && winLine.includes(i)}
          />;
    }
  
    render() {
      var board = [];
      for (var i = 0; i < boardSize; i++) {
        var row = [];
        for (var j = 0; j < boardSize; j++) {
          row.push(this.renderSquare(j + i*boardSize));
        }
        board.push(<div className="board-row">
                      {row}
                    </div>);
      }

      return (
        <div>
          {board}
        </div>
      );
    }
  }


  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
            position: -1,
          }],
          stepNumber: 0,
          position: [{
            x: -1,
            y: -1,
          }],
          xIsNext: true,
          isAscending: true
        };
    }

    // renderSquare(i) {
    //     const winLine = this.props.winLine;
    //     return (
    //       <Square
    //         value={this.props.squares[i]}
    //         onClick={() => this.props.onClick(i)}
    //         highlight={winLine && winLine.includes(i)}
    //       />
    //     );
    // }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        if (winner || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            position: i
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    handleSortToggle() {
      this.setState({
        isAscending: !this.state.isAscending
      });
    }
  

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const stepNumber = this.state.stepNumber;
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
                onClick={() => this.jumpTo(move)}>{desc}
                
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
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
          }
        }

        const isAscending = this.state.isAscending;
        if (!isAscending) {
          moves.reverse();
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winLine={winInfo.winLine}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <button onClick={() => this.handleSortToggle()}>
              {isAscending ? 'Descending' : 'Ascending'}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

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
            //return squares[i];
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
            //return squares[i];
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
            //return squares[i];
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
            //return squares[i];
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
      if (squares[i] === null) {
        isDraw = false;
        break;
      }
    }
    return {
      winner: null,
      line: null,
      isDraw: isDraw,
    };

    //return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  