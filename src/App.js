import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner === 'draw') {
    status = 'Draw'
  } else if (winner !== null) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  function renderboard() {
    const board = [];
    let row = [];
    for (let i = 0; i < 9; i++) {
      if (i !== 0 && i % 3 === 0) {
        board.push(
          <div key={i / 3} className="board-row">
            {row}
          </div>
        );
        row = [];
      }
      row.push(
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    }

    // Push the last row
    board.push(
      <div key={Math.floor(9 / 3)} className="board-row">
        {row}
      </div>
    );
    return board;
  }
  
  return (
    <>
      <div className="status">{status}</div>
      {renderboard()}
    </>
  );
}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isToggled, setIsToggled] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  function ToggleButton() {
    // Step 1: Set up the initial state
  
    // Step 2: Create a function to handle the toggle
    const handleToggle = () => {
      setIsToggled(prevState => !prevState);
    };
    // Step 3: Render the component
    return (
      <div>
        <button onClick={handleToggle}>
          {isToggled? 'Ascending' : 'Descending'}
        </button>
      </div>
    );
  }
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move == currentMove) {
      description = "You are at move #" + move;
      return (<li key={move}>
      {description}
     </li>)
    }
    else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const displayedmove = isToggled ? [...moves].reverse() : moves;
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <ToggleButton />
        </div>
        <ol>{displayedmove}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let allfilled = true;
  for (let i = 0; i < 9; i ++) {
    if (squares[i] == null) {
      allfilled = false;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {


      return squares[a];
    }
  }
  if (allfilled) {
    return 'draw'
  }
  return null;
}