import React from "react";
import Square from "../Square";

const Board = ({winLine, onClick, squares, boardSize}) => {

    const renderSquare = (i) => {
        return <Square 
            value={squares[i]}
            onClick={() => onClick(i)}
            highlight={winLine && winLine.includes(i)}
            />;
    }

    const renderRow = () => {
        var board = [];
        for (var i = 0; i < boardSize; i++) {
            var row = [];
            for (var j = 0; j < boardSize; j++) {
            row.push(renderSquare(j + i*boardSize));
            }
            board.push(<div className="board-row">
                        {row}
                        </div>);
        }
        return board;
    }

    

      return (
        <div>
          {renderRow()}
        </div>
      );
}


export default Board;