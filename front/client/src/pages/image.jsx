import React from 'react';
import './image.css';

const Image = () => {
  // Array of button labels
  const buttons = ['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5'];

  return (
    <div className="v-shape-container">
      {/* Create the top button */}
      <button className="v-shape-button top">{buttons[0]}</button>

      {/* Create the middle buttons */}
      <button className="v-shape-button middle">{buttons[1]}</button>
      <button className="v-shape-button middle">{buttons[2]}</button>

      {/* Create the bottom buttons */}
      <button className="v-shape-button bottom">{buttons[3]}</button>
      <button className="v-shape-button bottom">{buttons[4]}</button>
    </div>
  );
};

export default Image;