import React from 'react';
import coffeeUp from '../assets/coffee-cup.png';
import subtitleImg from '../assets/part0_asset/2.png';
import leftImg from '../assets/part0_asset/324.png';
import rightImg from '../assets/part0_asset/323.png';
import topLeftDeco from '../assets/part0_asset/325.png';
import deco326 from '../assets/part0_asset/326.png';
import bottomRightDeco from '../assets/part0_asset/1.png';
// Slider is no longer used here, it's replaced by the main content transition in App.jsx

export default function Hero() {
  return (
    <section className="hero">
      <img src={topLeftDeco} alt="Decoration Top Left" className="top-left-decoration" />
      <img src={bottomRightDeco} alt="Decoration Bottom Right" className="bottom-right-decoration" />
      <div className="watermark-grid">
        {/* Optional: Add a grid background if time permits */}
      </div>

      <div className="hero-main-visual">
        <img src={leftImg} alt="Decoration Left" className="side-decoration left" />
        <div className="image-wrapper">
          <img src={coffeeUp} alt="Sketch of a coffee cup" className="vine-image" />
          <div className="hero-subtitle-wrapper">
            <img src={subtitleImg} alt="Page Subtitle" className="hero-middle-subtitle-content" />
            <img src={deco326} alt="" className="subtitle-decoration-326" />
          </div>
        </div>
        <img src={rightImg} alt="Decoration Right" className="side-decoration right" />
      </div>

      <div className="title-container">
        <h1 className="liquid-title" data-text="COFFEE">COFFEE</h1>
        <img src={subtitleImg} alt="Subtitle" className="hero-subtitle-img" />
      </div>
    </section>
  );
}
