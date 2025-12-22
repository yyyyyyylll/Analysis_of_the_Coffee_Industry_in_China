import React from 'react';
import coffeeUp from '../assets/coffee-cup.png';

export default function Hero() {
  return (
    <section className="hero">
      <div className="watermark-grid">
        {/* Optional: Add a grid background if time permits */}
      </div>

      <img src={coffeeUp} alt="Sketch of a coffee cup" className="vine-image" />

      <div className="title-container">
        <h1 className="liquid-title" data-text="COFFEE">COFFEE</h1>
        <div className="subtitle">Data & Beans</div>
        <div className="credits">By Antigravity</div>
      </div>
    </section>
  );
}
