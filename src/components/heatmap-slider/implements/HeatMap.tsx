import React from 'react';

const HeatMap: React.FC = () => {
  const renderGradientSquare = () => {
    // Adjust the gradient to be vertical.
    const gradient = `linear-gradient(to bottom, #FFFF00, #FF0000, #8eff00, #0000FF)`;
    return (
      <div
        style={{
          background: gradient,
          width: '20px', // Adjusted width for vertical display
          height: '100%', // Make the square fill the entire height of its container
        }}
      />
    );
  };

  return (
    <div style={{ height: '300px' }}>
      {renderGradientSquare()}
    </div>
  );
};

export default HeatMap;
