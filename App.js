import React, { useState, useEffect } from 'react'; 
import './App.css';

//Used to be a Component, but if only using 'Render', can refactor as a 'Function', Display Component
//Doesn't Do Anything to Data except display it
function Square(props){
  //console.log("Props: ", props);
    return (
      <button 
        className = "square" 
        onClick = {props.onClick} //Listens for Clicks, will LINK BACK to the Board when Clicked
      >
        {props.value}
      </button>
    );
}

//Board Class, Parent
function Board(props) {
  //console.log("Props: ", props);
  //Renders and Draws the Square
  function renderSquare(i) {
    return (
        <Square 
          value = {props?.squares?.[i]}
          onClick = {() => props.onClick(i)}
        />
      );
  }

return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export function Game() {
  //Old Constructor
  const[history, setHistory] = useState(
    Array(9).fill(null)
  );
  const[stepNumber, setStepNumber] = useState(0);
  const[xIsNext, setXIsNext] = useState(true);
  
  //Jump To Function
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }
  
  //Handle Click Function
  function handleClick(i) {
    const handleHistoryNew = history.slice(0, stepNumber + 1);
    const handleCurrent = history[handleHistoryNew.length - 1]?.squares;
    //console.log("Handle Current: ", handleCurrent);
    //console.log("Value Line 70: ", handleHistoryNew.length - 1);
    const handleSquares = handleCurrent ? handleCurrent.slice() : []; //Duplicates Objects, No Mutation

    if(calculateWinner(handleSquares) || handleSquares[i]) return;
    handleSquares[i] = xIsNext ? "X" : "O";

    setHistory(handleHistoryNew.concat([{
      squares: handleSquares,
    }]));
    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  }
    
  //Determines Winner
  const historyNew = history;
  const current = historyNew[stepNumber];
  //console.log("History: ", history);
  //console.log("Step Number: ", stepNumber);
  //console.log("Current: ", current);
  const winner = calculateWinner(current?.squares);

  //Mapping Over History
  const moves = historyNew.map((step, move) => {
    const desc = move ?
      'Go To Move # ' + move :
      'Go To Game Start';
    return (
      <li key = {move}> 
        <button onClick = {() => jumpTo(move)}>{desc}</button>  
      </li>
    );
    });
  
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = 'Next player: ' + (xIsNext ? "X" : "O");
  }
  
  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares = {current?.squares}
          onClick = {(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol> 
      </div>
    </div>
  );
  
}

//Determines WHO WINS
function calculateWinner(squares) {
  console.log(squares);
  if(!squares) return null;

  //console.log("HERE");
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
  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
    const [a, b, c] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}