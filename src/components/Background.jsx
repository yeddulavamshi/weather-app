import React from "react";
import "./background.css";

const Background = ({ type }) => {
  const showFog = type === 'morning-clear' || type === 'cloudy' || type === 'fog';

  return (
    <div className={`background ${type}`}>

      {/* --- FOG ANIMATION (Conditional) --- */}
      {showFog && (
        <div className="fog-container">
          <div className="fog-img-1"></div>
          <div className="fog-img-2"></div>
        </div>
      )}

      {/* --- NIGHT STAR (Visible for Night) --- */}
      <div className="star"></div>

      {/* --- RAIN --- */}
      {type === 'rainy' && (
        <div className="rain-container">
            <div className="rain-texture"></div>
        </div>
      )}
      {/* --- SNOW (New!) --- */}
      {type === 'snowy' && (
        <div className="snow-container">
          {[...Array(30)].map((_, i) => <div key={i} className="snow-flake"></div>)}
        </div>
      )}
    </div>
  );
};

export default Background;