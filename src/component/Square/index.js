import React from "react";

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

export default Square;