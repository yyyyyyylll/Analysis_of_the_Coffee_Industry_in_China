import React from 'react';
import coffeeUp from '../assets/coffee-cup.png';
import Slider from './Slider';

export default function Hero({ onEnter }) {
  return (
    <section className="hero">
      <div className="watermark-grid">
        {/* Optional: Add a grid background if time permits */}
      </div>

      <div className="image-wrapper">
        <img src={coffeeUp} alt="Sketch of a coffee cup" className="vine-image" />
      </div>

      <div className="title-container">
        <h1 className="liquid-title" data-text="COFFEE">COFFEE</h1>
        <div className="subtitle">Data & Beans</div>
        <div className="credits">By Antigravity</div>
      </div>

      <Slider onComplete={onEnter} />
    </section>
  );
}
